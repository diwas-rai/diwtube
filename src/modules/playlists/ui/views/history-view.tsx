import { HistoryVideosSection } from "../sections/history-videos-section";

export const HistoryView = () => {
  return (
    <div className="mx-auto mb-10 flex max-w-screen-md flex-col gap-y-6 px-4 pt-2.5">
      <div>
        <div className="flex flex-row items-center gap-1">
          <h1 className="text-3xl font-bold">Watch history</h1>
        </div>
      </div>
      <HistoryVideosSection />
    </div>
  );
};
