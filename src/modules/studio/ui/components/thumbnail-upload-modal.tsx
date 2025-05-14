import { ResponsiveModal } from "@/components/responsive-dialog";
import { UploadDropzone } from "@/lib/uploadthing";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
interface ThumbnailUploadModal {
    videoId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ThumbnailUploadModal = ({ videoId, open, onOpenChange }: ThumbnailUploadModal) => {
    const utils = trpc.useUtils();

    const onUploadComplete = () => {
        utils.studio.getMany.invalidate();
        utils.studio.getOne.invalidate({ id: videoId });
        toast.success("Thumbnail uploaded successfully")
        onOpenChange(false);
    };

    const onUploadError = () => {
        toast.error("Thumbnail upload failed")
        onOpenChange(false);
    }

    return (
        <ResponsiveModal title="Upload a thumbnail" open={open} onOpenChange={onOpenChange}>
            <UploadDropzone
                endpoint="thumbnailUploader"
                input={{ videoId }}
                onClientUploadComplete={onUploadComplete}
                onUploadError={onUploadError}
            />
        </ResponsiveModal>
    );
};
