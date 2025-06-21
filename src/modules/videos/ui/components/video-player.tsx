import MuxPlayer from "@mux/mux-player-react";
import { THUMBNAIL_FALLBACK } from "../../constants";

interface VideoPlayerProps {
  playbackId?: string | null;
  thumbnailUrl?: string | null;
  autoplay?: boolean;
  onPlay?: () => void;
}

export const VideoPlayerSkeleton = () => {
  return <div className="aspect-video rounded-xl bg-black"></div>;
};

export const VideoPlayer = ({
  playbackId,
  thumbnailUrl,
  autoplay,
  onPlay,
}: VideoPlayerProps) => {
  if (!playbackId) return null;

  return (
    <MuxPlayer
      playbackId={playbackId ?? ""}
      poster={thumbnailUrl ?? THUMBNAIL_FALLBACK}
      playerInitTime={0}
      autoPlay={autoplay}
      thumbnailTime={0}
      className="size-full object-contain"
      accentColor="#FF2056"
      onPlay={onPlay}
    />
  );
};
