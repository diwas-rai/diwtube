import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import React, { useEffect } from "react";
import { Button } from "./ui/button";

interface InfiniteScrollProps {
  isManual?: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  infiniteFetchingComponent?: React.ReactNode;
}

export const InfiniteScroll = ({
  isManual,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  infiniteFetchingComponent,
}: InfiniteScrollProps) => {
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.5,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage && !isManual) {
      fetchNextPage();
    }
  }, [
    isIntersecting,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isManual,
  ]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div ref={targetRef} className="h-1" />
      {hasNextPage ? (
        isManual ? (
          <Button
            variant="ghost"
            onClick={fetchNextPage}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </Button>
        ) : (
          infiniteFetchingComponent
        )
      ) : (
        <p className="text-xs text-muted-foreground">
          You have reached the end!
        </p>
      )}
    </div>
  );
};
