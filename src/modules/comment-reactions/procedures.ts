import { db } from "@/db";
import { commentReactions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const commentReactionsRouter = createTRPCRouter({
  dislike: protectedProcedure
    .input(z.object({ commentId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      return toggleReaction(ctx.user.id, input.commentId, "dislike");
    }),
  like: protectedProcedure
    .input(z.object({ commentId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      return toggleReaction(ctx.user.id, input.commentId, "like");
    }),
});

async function toggleReaction(userId: string, commentId: string, reactionType: "like" | "dislike") {
  const [existingReaction] = await db
    .select()
    .from(commentReactions)
    .where(
      and(
        eq(commentReactions.commentId, commentId),
        eq(commentReactions.userId, userId),
        eq(commentReactions.reaction, reactionType)
      )
    );

  if (existingReaction) {
    const [deletedReaction] = await db
      .delete(commentReactions)
      .where(
        and(
          eq(commentReactions.userId, userId),
          eq(commentReactions.commentId, commentId)
        )
      )
      .returning();

    return deletedReaction;
  }

  const [createdReaction] = await db
    .insert(commentReactions)
    .values({ userId, commentId, reaction: reactionType })
    .onConflictDoUpdate({
      target: [commentReactions.userId, commentReactions.commentId],
      set: {
        reaction: reactionType,
      },
    })
    .returning();

  return createdReaction;
}
