interface PageProps {
    videoId: string;
}

export const VideoView = ({ videoId }: PageProps) => {
    return <div className="px max-w-screen-lg pt-2.5">{videoId}</div>;
};
