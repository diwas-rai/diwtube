import Link from "next/link";
import { VideoGetManyOutput } from "../../types";
import { VideoInfo } from "./video-info";
import { VideoThumbnail } from "./video-thumbnails";

interface VideoGridCardProps {
  data: VideoGetManyOutput["items"][number];
  onRemove?: () => void;
}

export const VideoGridCard = ({ data, onRemove }: VideoGridCardProps) => {
  return (
    <div className="group flex w-full flex-col gap-2">
      <Link href={`/videos/${data.id}`}>
        <VideoThumbnail
          imageUrl={data.thumbnailUrl}
          previewUrl={data.previewUrl}
          title={data.title}
          duration={data.duration}
        />
      </Link>
      <VideoInfo data={data} onRemove={onRemove} />
    </div>
  );
};

export const VideoGridCardSkeleton = () => {
  return (
    <div className="group flex w-full flex-col gap-2 animate-pulse">
      <div className="w-full h-48 bg-gray-300 rounded-md" />
      <div className="flex flex-col gap-2">
        <div className="h-4 bg-gray-300 rounded-md w-3/4" />
        <div className="h-4 bg-gray-300 rounded-md w-1/2" />
      </div>
    </div>
  );
};
