import { PlaylistsGetManyOutput } from "@/modules/playlists/types";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/constants";
import Link from "next/link";
import { PlaylistInfo } from "./playlist-info";
import { PlaylistThumbnail } from "./playlist-thumbnail";

interface PlaylistGridCardProps {
  data: PlaylistsGetManyOutput["items"][number];
}

export const PlaylistGridCard = ({ data }: PlaylistGridCardProps) => {
  return (
    <Link href={`/playlists/${data.id}`}>
      <div className="group flex w-full flex-col gap-2">
        <PlaylistThumbnail
          title={data.name}
          videoCount={data.videoCount}
          imageUrl={THUMBNAIL_FALLBACK}
        />
        <PlaylistInfo data={data} />
      </div>
    </Link>
  );
};
