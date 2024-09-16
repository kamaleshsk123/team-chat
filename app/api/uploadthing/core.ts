import { getAuth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { NextRequest } from "next/server"; // Import NextRequest
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// Updated server-side auth function
const handleAuth = async (req: NextRequest) => {
  const { userId } = await getAuth(req);

  if (!userId) {
    throw new UploadThingError("Unauthorized");
  }

  return { userId };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // Pass only req.req (the NextRequest part) to handleAuth
      return await handleAuth(req);
    })
    .onUploadComplete(() => {
      console.log("Upload complete");
    }),
  messageFile: f(["image", "pdf"])
    .middleware(async ({ req }) => {
      // Same here, pass only req.req
      return await handleAuth(req);
    })
    .onUploadComplete(() => {
      console.log("Message file upload complete");
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
