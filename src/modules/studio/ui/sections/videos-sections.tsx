"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DEFAULT_LIMIT } from "@/constants";
import { snakeCaseToTitle } from "@/lib/utils";
import { VideoThumbnail } from "@/modules/videos/ui/components/video-thumbnails";
import { trpc } from "@/trpc/client";
import { format } from "date-fns";
import { Globe2Icon, LockIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const VideosSection = () => {
    return (
        <Suspense fallback={<></>}>
            <ErrorBoundary fallback={<></>}>
                <VideosSectionsSuspense />
            </ErrorBoundary>
        </Suspense>
    );
};

export const VideosSectionsSuspense = () => {
    const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
        { limit: DEFAULT_LIMIT },
        { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );

    return (
        <div>
            <div className="border-y">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[510px] pl-6">Video</TableHead>
                            <TableHead>Visibility</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Views</TableHead>
                            <TableHead className="text-right">Comments</TableHead>
                            <TableHead className="pr-6 text-right">Likes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {videos.pages.flatMap((page) =>
                            page.items.map((video) => (
                                <Link href={`/studio/videos/${video.id}`} key={video.id} legacyBehavior>
                                    <TableRow className="cursor-pointer">
                                        <TableCell>
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col gap-y-1 overflow-hidden">
                                                    <span className="line-clamp-1 text-sm">
                                                        {video.title}
                                                    </span>
                                                    <span className="line-clamp-1 text-xs text-muted-foreground">
                                                        {video.description ?? "No description"}
                                                    </span>
                                                </div>
                                                <div className="relative aspect-video w-36 shrink-0">
                                                    <VideoThumbnail
                                                        imageUrl={video.thumbnailUrl}
                                                        previewUrl={video.previewUrl}
                                                        title={video.title}
                                                        duration={video.duration ?? 0}
                                                    />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">
                                                {video.visibility === "private" ? (
                                                    <LockIcon className="mr-2 size-4" />
                                                ) : (
                                                    <Globe2Icon className="mr-2 size-4" />
                                                )}
                                                {snakeCaseToTitle(video.visibility)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="items-center flex">
                                                {snakeCaseToTitle(video.muxStatus ?? "error")}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="items-center flex">
                                                {format(new Date(video.createdAt), "dd MMM yyyy")}
                                            </div>
                                        </TableCell>
                                        <TableCell>Views</TableCell>
                                        <TableCell>Comments</TableCell>
                                        <TableCell>Likes</TableCell>
                                    </TableRow>
                                </Link>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <InfiniteScroll
                hasNextPage={query.hasNextPage}
                isFetchingNextPage={query.isFetchingNextPage}
                fetchNextPage={query.fetchNextPage}
                isManual
            />
        </div>
    );
};
