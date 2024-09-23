import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public route for UploadThing
const isPublicRoute = createRouteMatcher([
  "/api/uploadthing", // Ensure this route is public for file uploads
]);

export default clerkMiddleware((auth, req) => {
  const { userId } = auth(); // Ensure auth is called properly
  if (!userId) {
    throw new Error("User not authenticated");
  }

  console.log("Middleware triggered for route: ", req.nextUrl.pathname);
  if (!isPublicRoute(req)) {
    auth(); // Ensure auth is applied for protected routes
  }
});

export const config = {
  matcher: [
    "/servers/:serverId/channels/:channelId*",
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
