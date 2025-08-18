export const dynamic = "force-dynamic";

import { DEFAULT_LIMIT } from "@/constants";
import { PlaylistVideosView } from "@/modules/playlists/ui/views/playlist-videos-view";
import { HydrateClient, trpc } from "@/trpc/server";

interface PageProps {
  params: Promise<{ playlistId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { playlistId } = await params;

  void trpc.playlists.getVideos.prefetchInfinite({
    playlistId: playlistId,
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <PlaylistVideosView playlistId={playlistId} />
    </HydrateClient>
  );
};

export default Page;
