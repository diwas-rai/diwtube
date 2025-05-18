import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";

interface inputType {
    userId: string;
    videoId: string;
}

export const { POST } = serve(async (context) => {
    const input = context.requestPayload as inputType;
    const { videoId, userId } = input;

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

    const { body } = await context.api.openai.call("generate-title", {
        token: process.env.OPENAI_API_KEY!,
        operation: "chat.completions.create",
        body: {
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: process.env.GENERATE_TITLE_PROMPT,
                },
                {
                    role: "user",
                    content:
                        "This is a youtube video testing if this openAI integration is going to work with upstash workflows!",
                },
            ],
        },
    });

    // extract the title and remove any quotes
    const generatedTitle = body.choices[0].message.content?.replaceAll('"', "");

    await context.run("update-video", async () => {
        await db
            .update(videos)
            .set({ title: generatedTitle ?? video.title })
            .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)));
    });
});
