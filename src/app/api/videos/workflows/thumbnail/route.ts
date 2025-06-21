import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

interface inputType {
  userId: string;
  videoId: string;
  prompt: string;
}

export const { POST } = serve(async (context) => {
  const input = context.requestPayload as inputType;
  const { videoId, userId, prompt } = input;

  const video = await context.run("get-video", async () => {
    const [existingVideo] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));

    if (!existingVideo) {
      throw new Error("Not found");
    }

    return existingVideo;
  });

  const { body } = await context.call<{ data: { url: string }[] }>(
    "generate-thumbnail",
    {
      url: "https://api.openai.com/v1/images/generations",
      method: "POST",
      body: {
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1792x1024",
      },
      headers: {
        authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    }
  );

  // extract the description and remove any quotes
  const generatedThumbnailUrl = body.data[0].url;

  if (!generatedThumbnailUrl) {
    throw new Error("Bad request");
  }

  const utapi = new UTApi();
  await context.run("cleanup-uploadthing", async () => {
    if (video.thumbnailKey) {
      await utapi.deleteFiles(video.thumbnailKey);
      await db
        .update(videos)
        .set({ thumbnailKey: null, thumbnailUrl: null })
        .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)));
    }
  });

  const uploadedThumbnail = await context.run(
    "upload-thumbnail-to-uploadthing",
    async () => {
      // Upload default thumbnails and preview to UploadThing for consistency
      const { data, error } = await utapi.uploadFilesFromUrl(
        generatedThumbnailUrl
      );

      if (error) {
        throw new Error("Bad request");
      }

      return data;
    }
  );

  await context.run("update-thumbnail", async () => {
    await db
      .update(videos)
      .set({
        thumbnailKey: uploadedThumbnail.key,
        thumbnailUrl: uploadedThumbnail.ufsUrl,
      })
      .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)));
  });
});
