import { Button } from "@/components/ui/button";
import MuxUploader, {
    MuxUploaderDrop,
    MuxUploaderFileSelect,
    MuxUploaderProgress,
    MuxUploaderStatus,
} from "@mux/mux-uploader-react";
import { UploadIcon } from "lucide-react";

interface StudioUploaderProps {
    endpoint?: string | null;
    onSuccess: () => void;
}

export const StudioUploader = ({ endpoint, onSuccess }: StudioUploaderProps) => {
    const MUX_UPLOADER_ID = "video-uploader";

    return (
        <div>
            <MuxUploader
                onSuccess={onSuccess}
                endpoint={endpoint}
                id={MUX_UPLOADER_ID}
                className="group/uploader hidden"
            />
            <MuxUploaderDrop muxUploader={MUX_UPLOADER_ID} className="group/drop">
                <div slot="heading" className="flex flex-col items-center gap-6">
                    <div className="flex size-32 items-center justify-center gap-2 rounded-full bg-muted">
                        <UploadIcon className="group/drop-[&[:active]]:animate-bounce size-10 text-muted-foreground" />
                    </div>
                    <div className="gap=2 flex flex-col text-center">
                        <p className="text-sm">Drag and drop video files to upload them</p>
                        <p className="text-xs text-muted-foreground">
                            {" "}
                            Your videos will be private until you publish them
                        </p>
                    </div>
                    <MuxUploaderFileSelect muxUploader={MUX_UPLOADER_ID}>
                        <Button type="button" className="rounded-full">
                            Select files
                        </Button>
                    </MuxUploaderFileSelect>
                </div>
                <span slot="separator" className="hidden" />
                <MuxUploaderStatus muxUploader={MUX_UPLOADER_ID} className="text-sm" />
                <MuxUploaderProgress muxUploader={MUX_UPLOADER_ID} className="text-sm" type="percentage" />
                <MuxUploaderProgress muxUploader={MUX_UPLOADER_ID} className="text-sm" type="bar" />
            </MuxUploaderDrop>
        </div>
    );
};
