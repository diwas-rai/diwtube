import { UserAvatar } from "@/components/user-avatar";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { CommentsGetManyOutput } from "../../types";

interface CommentItemProps {
    comment: CommentsGetManyOutput[number];
}

export const CommentItem = ({ comment }: CommentItemProps) => {
    return (
        <div>
            <div className="flex gap-4">
                <Link href={`/users/${comment.userId}`}>
                    <UserAvatar
                        size="lg"
                        imageUrl={comment.user?.imageUrl ?? "/placeholder.svg"} // TODO: make this a user placeholder image
                        name={comment.user?.name ?? "User"}
                    />
                </Link>
                <div className="min-w-0 flex-1">
                    <Link href={`/users/${comment.userId}`}>
                        <div className="mb-0.5 flex items-center gap-2">
                            <span className="pb-0.5 text-sm font-medium">{comment.user.name}</span>
                            <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                            </span>
                        </div>
                    </Link>
                    <p className="text-sm">{comment.value}</p>
                </div>
            </div>
        </div>
    );
};
