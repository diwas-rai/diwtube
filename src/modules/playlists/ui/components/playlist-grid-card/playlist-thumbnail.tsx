import { cn } from "@/lib/utils";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/constants";
import { ListVideoIcon, PlayIcon } from "lucide-react";
import Image from "next/image";

interface PlaylistThumbnailProps {
  title: string;
  videoCount: number;
  imageUrl?: string;
  className?: string;
}

export const PlaylistThumbnailSkeleton = () => {
  return (
    <div className={`relative pt-3`}>
      <div className="relative">
        {/* Stacking video effect skeleton */}
        <div className="absolute -top-3 left-1/2 aspect-video w-[97%] -translate-x-1/2 animate-pulse overflow-hidden rounded-xl bg-muted"></div>
        <div className="absolute -top-1.5 left-1/2 aspect-video w-[98.5%] -translate-x-1/2 animate-pulse overflow-hidden rounded-xl bg-muted"></div>

        {/* Playlist thumbnail skeleton */}
        <div className="relative aspect-video w-full animate-pulse overflow-hidden rounded-xl bg-muted"></div>
      </div>
    </div>
  );
};

export const PlaylistThumbnail = ({
  imageUrl,
  title,
  className,
  videoCount,
}: PlaylistThumbnailProps) => {
  return (
    <div className={cn("relative pt-3", className)}>
      <div className="relative">
        {/* Stacking video effect */}
        <div className="absolute -top-3 left-1/2 aspect-video w-[97%] -translate-x-1/2 overflow-hidden rounded-xl bg-black/20"></div>
        <div className="absolute -top-1.5 left-1/2 aspect-video w-[98.5%] -translate-x-1/2 overflow-hidden rounded-xl bg-black/25"></div>

        {/* Playlist thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
          <Image
            src={imageUrl ?? THUMBNAIL_FALLBACK}
            alt={title}
            className="h-full w-full object-cover"
            fill
          />

          {/* Overlay for hover effect */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex items-center gap-x-2">
              <PlayIcon className="size-4 fill-white text-white" />
              <span className="font-medium text-white">Play all</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video count display */}
      <div className="absolute bottom-2 right-2 flex items-center gap-x-1 rounded bg-black/80 px-1 py-0.5 text-xs font-medium text-white">
        <ListVideoIcon className="size-4" />
        {videoCount} videos
      </div>
    </div>
  );
};
