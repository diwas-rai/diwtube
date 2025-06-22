"use client";

import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { VideoRowCard } from "../components/video-row-card";

interface SuggestionsSectionProp {
  videoId: string;
}
export const SuggestionsSection = ({ videoId }: SuggestionsSectionProp) => {
  const [suggestions] = trpc.suggestions.getMany.useSuspenseInfiniteQuery(
    {
      videoId,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <div>
      {suggestions.pages.flatMap((page) =>
        page.items.map((video) => (
          <VideoRowCard key={video.id} data={video} size="compact" />
        ))
      )}
    </div>
  );
};
