import { db } from "@/db";
import { commentReactions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const commentReactionsRouter = createTRPCRouter({
  dislike: protectedProcedure
    .input(z.object({ commentId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const { id: userId } = ctx.user;
      const { commentId } = input;

      const [existingCommentDislike] = await db
        .select()
        .from(commentReactions)
        .where(
          and(
            eq(commentReactions.commentId, commentId),
            eq(commentReactions.userId, userId),
            eq(commentReactions.reaction, "dislike")
          )
        );

      if (existingCommentDislike) {
        const [deletedCommentDislike] = await db
          .delete(commentReactions)
          .where(
            and(
              eq(commentReactions.userId, userId),
              eq(commentReactions.commentId, commentId)
            )
          )
          .returning();

        return deletedCommentDislike;
      }

      const [createdCommentDislike] = await db
        .insert(commentReactions)
        .values({ userId, commentId, reaction: "dislike" })
        .onConflictDoUpdate({
          target: [commentReactions.userId, commentReactions.commentId],
          set: {
            reaction: "dislike",
          },
        })
        .returning();

      return createdCommentDislike;
    }),
  like: protectedProcedure
    .input(z.object({ commentId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const { id: userId } = ctx.user;
      const { commentId } = input;

      const [existingCommentLike] = await db
        .select()
        .from(commentReactions)
        .where(
          and(
            eq(commentReactions.commentId, commentId),
            eq(commentReactions.userId, userId),
            eq(commentReactions.reaction, "like")
          )
        );

      if (existingCommentLike) {
        const [deletedCommentLike] = await db
          .delete(commentReactions)
          .where(
            and(
              eq(commentReactions.userId, userId),
              eq(commentReactions.commentId, commentId)
            )
          )
          .returning();

        return deletedCommentLike;
      }

      const [createdCommentLike] = await db
        .insert(commentReactions)
        .values({ userId, commentId, reaction: "like" })
        .onConflictDoUpdate({
          target: [commentReactions.userId, commentReactions.commentId],
          set: {
            reaction: "like",
          },
        })
        .returning();

      return createdCommentLike;
    }),
});
