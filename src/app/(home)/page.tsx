export const dynamic = "force-dynamic";

import { HydrateClient, trpc } from "@/trpc/server";
import { HomeView } from "@/modules/home/ui/views/home-view";
interface PageProps {
    searchParams: Promise<{ categoryId?: string }>;
}
const Page = async ({ searchParams }: PageProps) => {
    const { categoryId } = await searchParams;
    void trpc.categories.getMany.prefetch();

    return (
        // HydrateClient whenever prefetching
        <HydrateClient>
            <HomeView categoryId={categoryId} />
        </HydrateClient>
    );
};

export default Page;
