import { PlaylistsGetManyOutput } from "@/modules/playlists/types";
import Link from "next/link";

interface PlaylistGridCardProps {
  data: PlaylistsGetManyOutput["items"][number];
}

export const PlaylistGridCard = ({ data }: PlaylistGridCardProps) => {
  return (
    <Link href={`/playlists/${data.id}`}>
      <div className="group flex w-full flex-col gap-2">
        {data.name}
      </div>
    </Link>
  );
};
