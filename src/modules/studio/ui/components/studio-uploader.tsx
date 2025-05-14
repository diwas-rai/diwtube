import MuxUploader from '@mux/mux-uploader-react';

interface StudioUploaderProps {
    endpoint?: string | null;
}

export const StudioUploader = ({endpoint}: StudioUploaderProps) => {
    return (
        <div>
            <MuxUploader endpoint={endpoint}/>
        </div>
    )
}