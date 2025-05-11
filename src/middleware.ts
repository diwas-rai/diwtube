import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/protected(.*)"]);
const isWebhookRoute = createRouteMatcher(["/api/users/webhook"]);

export default clerkMiddleware(async (auth, req) => {
    // Skip Clerk protection for webhook route
    if (isWebhookRoute(req)) return;

    if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
    matcher: [
        // Exclude _next, static files, and api/users/webhook (from the app directory)
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)|api/users/webhook).*)",

        // Apply to all API routes except webhook route
        "/(api|trpc)(.*)",
    ],
};
