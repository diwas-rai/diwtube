import { UserAvatar } from "@/components/user-avatar";
import { UserInfo } from "@/modules/users/ui/components/user-info";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useMemo } from "react";
import { VideoGetManyOutput } from "../../types";
import { VideoMenu } from "./video-menu";

interface VideoInfoProps {
  data: VideoGetManyOutput["items"][number];
  onRemove?: () => void;
}

export const VideoInfo = ({ data, onRemove }: VideoInfoProps) => {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat("en", {
      notation: "compact",
    }).format(data.viewCount);
  }, [data.viewCount]);

  const timeSinceUpload = useMemo(() => {
    return formatDistanceToNow(data.createdAt, { addSuffix: true });
  }, [data.createdAt]);

  return (
    <div className="flex gap-3">
      <Link href={`/users/${data.user.id}`}>
        <UserAvatar imageUrl={data.user.imageUrl} name={data.user.name} />
      </Link>
      <div className="min-w-0 flex-1">
        <Link href={`/videos/${data.id}`}>
          <h3 className="line-clamp-1 break-words text-base font-medium lg:line-clamp-2">
            {data.title}
          </h3>
        </Link>
        <div className="flex align-text-bottom">
          <Link href={`/users/${data.user.id}`}>
            <UserInfo name={data.user.name} size="sm" />
          </Link>
          <Link href={`/videos/${data.id}`}>
            <p className="line-clamp-1 pl-1 text-xs text-gray-500">
              • {compactViews} views • {timeSinceUpload}
            </p>
          </Link>
        </div>
      </div>
      <div className="flex-shrink-0">
        <VideoMenu videoId={data.id} onRemove={onRemove} />
      </div>
    </div>
  );
};
