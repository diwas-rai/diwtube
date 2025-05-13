"use client";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { Loader2Icon, PlusIcon } from "lucide-react";

export const StudioUploadModal = () => {
    const utils = trpc.useUtils();
    const create = trpc.videos.create.useMutation({
        // When succesfully created a video, invalidate the current state and cause a reload
        onSuccess: () => {
            utils.studio.getMany.invalidate();
        },
    });

    return (
        <Button variant="secondary" onClick={() => create.mutate()} disabled={create.isPending}>
            {create.isPending ? <Loader2Icon className="animate-spin" /> : <PlusIcon />}
            Create
        </Button>
    );
};
