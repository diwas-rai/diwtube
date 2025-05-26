import { db } from "@/db";
import { videoReactions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const videoReactionsRouter = createTRPCRouter({
    dislike: protectedProcedure
        .input(z.object({ videoId: z.string().uuid() }))
        .mutation(async ({ input, ctx }) => {
            const { id: userId } = ctx.user;
            const { videoId } = input;

            const [existingVideoDislike] = await db
                .select()
                .from(videoReactions)
                .where(
                    and(
                        eq(videoReactions.videoId, videoId),
                        eq(videoReactions.userId, userId),
                        eq(videoReactions.reaction, "dislike")
                    )
                );

            if (existingVideoDislike) {
                const [deletedViewerDislike] = await db
                    .delete(videoReactions)
                    .where(and(eq(videoReactions.userId, userId), eq(videoReactions.videoId, videoId)))
                    .returning();

                return deletedViewerDislike;
            }

            const [createdVideoDislike] = await db
                .insert(videoReactions)
                .values({ userId, videoId, reaction: "dislike" })
                .onConflictDoUpdate({
                    target: [videoReactions.userId, videoReactions.videoId],
                    set: {
                        reaction: "dislike",
                    },
                })
                .returning();

            return createdVideoDislike;
        }),
    like: protectedProcedure
        .input(z.object({ videoId: z.string().uuid() }))
        .mutation(async ({ input, ctx }) => {
            const { id: userId } = ctx.user;
            const { videoId } = input;

            const [existingVideoLike] = await db
                .select()
                .from(videoReactions)
                .where(
                    and(
                        eq(videoReactions.videoId, videoId),
                        eq(videoReactions.userId, userId),
                        eq(videoReactions.reaction, "like")
                    )
                );

            if (existingVideoLike) {
                const [deletedViewerLike] = await db
                    .delete(videoReactions)
                    .where(and(eq(videoReactions.userId, userId), eq(videoReactions.videoId, videoId)))
                    .returning();

                return deletedViewerLike;
            }

            const [createdVideoLike] = await db
                .insert(videoReactions)
                .values({ userId, videoId, reaction: "like" })
                .onConflictDoUpdate({
                    target: [videoReactions.userId, videoReactions.videoId],
                    set: {
                        reaction: "like",
                    },
                })
                .returning();

            return createdVideoLike;
        }),
});
