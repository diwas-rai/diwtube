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

export const LikedVideosSection = () => {
  return (
    <Suspense fallback={<LikedVideosSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <LikedVideosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const LikedVideosSectionSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 gap-y-10 md:hidden">
      {Array.from({ length: 6 }).map((_, index) => (
        <VideoGridCardSkeleton key={index} />
      ))}
    </div>
  );
};

const LikedVideosSectionSuspense = () => {
  const [videos, { hasNextPage, isFetchingNextPage, fetchNextPage }] =
    trpc.playlists.getLiked.useSuspenseInfiniteQuery(
      { limit: DEFAULT_LIMIT },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const likedVideos = videos.pages.flatMap((pages) => pages.items);

  return (
    <div>
      <div className="flex flex-col gap-4 gap-y-10 md:hidden">
        {likedVideos.map((video) => (
          <VideoGridCard key={video.id} data={video} />
        ))}
      </div>
      <div className="hidden flex-col gap-4 md:flex">
        {likedVideos.map((video) => (
          <VideoRowCard key={video.id} data={video} />
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
