import { PlaylistsGetManyOutput } from "@/modules/playlists/types";
import { formatDistanceToNow } from "date-fns";
import { useMemo } from "react";

interface PlaylistInfoProps {
  data: PlaylistsGetManyOutput["items"][number];
}

export const PlaylistInfoSkeleton = () => {
  return (
    <div>
      <div className="h-4 w-3/4 bg-muted animate-pulse rounded mb-2"></div>
      <div className="h-3 w-1/2 bg-muted animate-pulse rounded mb-2"></div>
      <div className="h-3 w-1/3 bg-muted animate-pulse rounded mb-2"></div>
      <div className="h-3 w-1/4 bg-muted animate-pulse rounded"></div>
    </div>
  );
};

export const PlaylistInfo = ({ data }: PlaylistInfoProps) => {
  const timeSinceUpdate = useMemo(() => {
    return formatDistanceToNow(data.updatedAt, { addSuffix: true });
  }, [data.updatedAt]);

  return (
    <div>
      <p className="line-clamp-1 break-words text-sm font-medium lg:line-clamp-2">
        {data.name}
      </p>
      <p className="text-xs text-muted-foreground">
        {/* TODO: Add playlist privacy settings */}
        {data.user.name} • Playlist
      </p>
      <p className="text-xs text-muted-foreground">Updated {timeSinceUpdate}</p>
      <p
        className="text-xs font-semibold text-muted-foreground hover:text-primary"
      >
        View full playlist
      </p>
    </div>
  );
};
