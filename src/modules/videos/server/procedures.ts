import { db } from "@/db";
import { videos } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { mux } from "@/lib/mux";

export const videosRouter = createTRPCRouter({
    create: protectedProcedure.mutation(async ({ ctx }) => {
        const { id: userId } = ctx.user;

        const upload = await mux.video.uploads.create({
            new_asset_settings: {
                passthrough: userId,
                playback_policies: ["public"],
                static_renditions: [
                    {
                        resolution: "highest",
                    },
                ],
            },
            cors_origin: process.env.MUX_UPLOAD_CORS_ORIGIN!,
        });

        const [video] = await db
            .insert(videos)
            .values({ userId, title: "Untitled", muxStatus: "waiting", muxUploadId: upload.id })
            .returning();

        return {
            video: video,
            url: upload.url,
        };
    }),
});
