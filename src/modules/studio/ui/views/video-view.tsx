import { FormSection } from "../sections/form-section";

interface PageProps {
    videoId: string;
}

export const VideoView = ({ videoId }: PageProps) => {
    return (
        <div className="px-4 max-w-screen-lg pt-2.5">
            <FormSection videoId={videoId} />
        </div>
    );
};
