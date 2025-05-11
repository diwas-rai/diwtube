"use client";

import { trpc } from "@/trpc/client";

export const PageClient = () => {
    const [data] = trpc.hello.useSuspenseQuery({
        text: "Diwas",
    });

    return <div>{data.greeting}</div>;
};
