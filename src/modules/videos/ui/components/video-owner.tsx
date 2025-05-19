import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { SubscriptionButton } from "@/modules/subscriptions/ui/components/subscription-button";
import { UserInfo } from "@/modules/users/ui/components/user-info";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { VideoGetOneOutput } from "../../types";

interface VideoOwnerProps {
    user: VideoGetOneOutput["user"];
    videoId: string;
}

export const VideoOwner = ({ user, videoId }: VideoOwnerProps) => {
    const { userId: userClerkId } = useAuth();
    return (
        <div className="flex min-w-0 items-center justify-between gap-3 sm:items-start sm:justify-start">

            <Link href={`/users/${user.id}`}>
                <div className="flex min-w-0 items-center gap-3">
                    <UserAvatar size="lg" imageUrl={user.imageUrl} name={user.name} />
                    <div className="flex min-w-0 flex-col gap-1">
                        <UserInfo size="lg" name={user.name} />
                        <span className="line-clamp-1 text-sm text-muted-foreground">
                            {/* TODO: implement subcount properly */}
                            {0} subscribers
                        </span>
                    </div>
                </div>
            </Link>

            {userClerkId === user.clerkId ? (
                <Button className="rounded-full" variant="secondary" asChild>
                    <Link href={`/studio/videos/${videoId}`}>Edit video</Link>
                </Button>
            ) : (
                <SubscriptionButton
                    onClick={() => {
                        console.log("SubscriptionButton pressed");
                    }}
                    disabled={false}
                    isSubscribed={false}
                    className="flex-none"
                    size={"default"}
                />
            )}
        </div>
    );
};
