"use client";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { toast } from "sonner";

export const StudioUploadModal = () => {
    const utils = trpc.useUtils();
    const create = trpc.videos.create.useMutation({
        // When successfully created a video, invalidate the current state and cause a reload
        onSuccess: () => {
            toast.success("Video uploaded successfully!");
            utils.studio.getMany.invalidate();
        },
        onError: () => {
            toast.error("Something went wrong... 🫤");
        },
    });

    return (
        <Button variant="secondary" onClick={() => create.mutate()} disabled={create.isPending}>
            {create.isPending ? <Loader2Icon className="animate-spin" /> : <PlusIcon />}
            Create
        </Button>
    );
};
