"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { CommentForm } from "@/modules/comments/ui/components/comment-form";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface CommentsSectionProps {
    videoId: string;
}

export const CommentsSection = ({ videoId }: CommentsSectionProps) => {
    return (
        <Suspense fallback={<CommentsSectionSkeleton />}>
            <ErrorBoundary fallback={<p>Error</p>}>
                <CommentsSectionSuspense videoId={videoId} />
            </ErrorBoundary>
        </Suspense>
    );
};

const CommentsSectionSkeleton = () => {
    return <Skeleton />;
};

const CommentsSectionSuspense = ({ videoId }: CommentsSectionProps) => {
    const [comments] = trpc.comments.getMany.useSuspenseQuery({ videoId });

    return (
        <div className="mt-6">
            <div className="flex flex-col gap-6">
                {/* update this to use correct comment count */}
                <h1>0 comments</h1>
                <CommentForm videoId={videoId} />
            </div>
            {JSON.stringify(comments)}
        </div>
    );
};
