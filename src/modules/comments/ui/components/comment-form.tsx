import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user-avatar";
import { useUser } from "@clerk/nextjs";

interface CommentFormProps {
    videoId: string;
    onSuccess?: () => void;
}

export const CommentForm = ({ videoId, onSuccess }: CommentFormProps) => {
    const { user } = useUser();

    return (
        <form className="group flex gap-4">
            <UserAvatar
                size="lg"
                imageUrl={user?.imageUrl ?? "/placeholder.svg"} // TODO: replace this with a user placeholder image
                name={user?.username ?? "User"}
            />
            <div className="flex-1">
                <div>
                    <Textarea
                        placeholder="Add a comment..."
                        className="min-h-0 resize-none overflow-hidden bg-transparent"
                    />
                </div>
                <div className="mt-2 flex justify-end gap-2">
                    <Button type="submit" size="sm">
                        Comment
                    </Button>
                </div>
            </div>
        </form>
    );
};
