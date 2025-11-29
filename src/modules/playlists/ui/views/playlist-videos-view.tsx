import { PlaylistVideosHeaderSection } from "../sections/playlist-videos-header-section";
import { VideosSection } from "../sections/videos-section";

interface PlaylistVideosViewProps {
  playlistId: string;
}

export const PlaylistVideosView = ({ playlistId }: PlaylistVideosViewProps) => {
  return (
    <div className="mx-auto mb-10 flex max-w-screen-md flex-col gap-y-6 px-4 pt-2.5">
      <PlaylistVideosHeaderSection playlistId={playlistId} />
      <VideosSection playlistId={playlistId} />
    </div>
  );
};
