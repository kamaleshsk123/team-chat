import { v4 as uuidv4 } from "uuid";
import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if profileId and userId exist in the corresponding tables
    const existingProfile = await db.profile.findUnique({
      where: { id: profile.id },
    });

    if (!existingProfile) {
      return new NextResponse("Profile not found", { status: 404 });
    }

    const server = await db.server.create({
      data: {
        name,
        imageUrl,
        profileId: profile.id, // Ensure profile.id exists in Profile table
        inviteCode: uuidv4(),
        channels: {
          create: [
            {
              name: "general",
              profileId: profile.id, // Ensure profile.id exists
            },
          ],
        },
        members: {
          create: [
            {
              profileId: profile.id, // Ensure profile.userId exists
              role: MemberRole.ADMIN,
            },
          ],
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
