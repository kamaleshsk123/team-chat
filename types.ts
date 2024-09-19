import { Server, Member, Profile } from "@prisma/client";

export type ServerWithMembesWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
};
