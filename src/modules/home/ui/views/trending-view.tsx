import { FlameIcon } from "lucide-react";
import { TrendingVideosSection } from "../sections/trending-videos-section";

export const TrendingView = () => {
  return (
    <div className="mx-auto mb-10 flex max-w-[2400px] flex-col gap-y-6 px-4 pt-2.5">
      <div>
        <div className="flex flex-row items-center gap-1">
          <FlameIcon className="size-8 rounded-full bg-red-500 fill-red-500 stroke-white" />
          <h1 className="text-3xl font-bold">Trending</h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Most popular videos all in one place
        </p>
      </div>
      <TrendingVideosSection />
    </div>
  );
};
