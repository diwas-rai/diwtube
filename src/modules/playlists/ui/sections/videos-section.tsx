"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import {
  VideoGridCard,
  VideoGridCardSkeleton,
} from "@/modules/videos/ui/components/video-grid-card";
import { VideoRowCard } from "@/modules/videos/ui/components/video-row-card";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";

interface VideosSectionProps {
  playlistId: string;
}

export const VideosSection = ({ playlistId }: VideosSectionProps) => {
  return (
    <Suspense fallback={<VideosSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <VideosSectionSuspense playlistId={playlistId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const VideosSectionSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 gap-y-10 md:hidden">
      {Array.from({ length: 6 }).map((_, index) => (
        <VideoGridCardSkeleton key={index} />
      ))}
    </div>
  );
};

const VideosSectionSuspense = ({ playlistId }: VideosSectionProps) => {
  const utils = trpc.useUtils();
  const [videos, { hasNextPage, isFetchingNextPage, fetchNextPage }] =
    trpc.playlists.getVideos.useSuspenseInfiniteQuery(
      { playlistId, limit: DEFAULT_LIMIT },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const watchedVideos = videos.pages.flatMap((page) => page.items);

  const removeVideo = trpc.playlists.removeVideo.useMutation({
    onSuccess: (data) => {
      toast.success("Video successfully removed from playlist");
      utils.playlists.getMany.invalidate();
      utils.playlists.getManyWithVideoStatus.invalidate({
        videoId: data.videoId,
      });
      utils.playlists.getOne.invalidate({ playlistId: data.playlistId });
      utils.playlists.getVideos.invalidate({ playlistId: data.playlistId });
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return (
    <div>
      <div className="flex flex-col gap-4 gap-y-10 md:hidden">
        {watchedVideos.map((video) => (
          <VideoGridCard
            key={video.id}
            data={video}
            onRemove={() =>
              removeVideo.mutate({ playlistId, videoId: video.id })
            }
          />
        ))}
      </div>
      <div className="hidden flex-col gap-4 md:flex">
        {watchedVideos.map((video) => (
          <VideoRowCard
            key={video.id}
            data={video}
            size="compact"
            onRemove={() =>
              removeVideo.mutate({ playlistId, videoId: video.id })
            }
          />
        ))}
      </div>
      <InfiniteScroll
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
};
