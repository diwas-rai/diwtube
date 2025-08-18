export const dynamic = "force-dynamic";

import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/server";

interface PageProps {
  params: Promise<{ playlistId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { playlistId } = await params;

  void trpc.playlists.getVideos.prefetchInfinite({
    playlistId: playlistId,
    limit: DEFAULT_LIMIT,
  });

  return <div>{playlistId}</div>;
};

export default Page;
