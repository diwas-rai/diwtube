import placeholder from "@/../public/placeholder.svg";
import MuxPlayer from "@mux/mux-player-react";

interface VideoPlayerProps {
    playbackId?: string | null;
    thumbnailUrl?: string | null;
    autoplay?: boolean;
    onPlay?: () => void;
}

export const VideoPlayer = ({ playbackId, thumbnailUrl, autoplay, onPlay }: VideoPlayerProps) => {
    if (!playbackId) return null;

    return (
        <MuxPlayer
            playbackId={playbackId ?? ""}
            poster={thumbnailUrl ?? placeholder}
            playerInitTime={0}
            autoPlay={autoplay}
            thumbnailTime={0}
            className="size-full object-contain"
            accentColor="#FF2056"
            onPlay={onPlay}
        />
    );
};
