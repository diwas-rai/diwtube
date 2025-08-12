import { PlaylistsGetManyOutput } from "@/modules/playlists/types";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useMemo } from "react";

interface PlaylistInfoProps {
  data: PlaylistsGetManyOutput["items"][number];
}

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
      <Link
        className="text-xs font-semibold text-muted-foreground hover:text-primary"
        href={`/playlists/${data.id}`}
      >
        View full playlist
      </Link>
    </div>
  );
};
