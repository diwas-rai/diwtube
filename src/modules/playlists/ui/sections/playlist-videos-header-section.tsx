"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/trpc/client";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";

interface PlaylistVideosHeaderSectionProps {
  playlistId: string;
}

export const PlaylistVideosHeaderSection = ({
  playlistId,
}: PlaylistVideosHeaderSectionProps) => {
  return (
    <Suspense fallback={<PlaylistVideosHeaderSectionHeaderSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <PlaylistVideosHeaderSectionSuspense playlistId={playlistId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const PlaylistVideosHeaderSectionHeaderSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
};

const PlaylistVideosHeaderSectionSuspense = ({
  playlistId,
}: PlaylistVideosHeaderSectionProps) => {
  const router = useRouter();
  const utils = trpc.useUtils();
  const [playlist] = trpc.playlists.getOne.useSuspenseQuery({
    playlistId,
  });

  const remove = trpc.playlists.remove.useMutation({
    onSuccess: () => {
      toast.success("Playlist successfully deleted");
      utils.playlists.getMany.invalidate();
      router.push("/playlists");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return (
    <div>
      <div className="flex flex-row items-center gap-1">
        <h1 className="text-3xl font-bold">{playlist.name}</h1>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        onClick={() => remove.mutate({ playlistId })}
        disabled={remove.isPending}
      >
        <Trash2Icon />
      </Button>
      {/* TODO: Add privacy option to playlists */}
    </div>
  );
};
