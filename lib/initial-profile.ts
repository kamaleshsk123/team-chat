import { currentUser, auth } from "@clerk/nextjs/server"; // Keep using `currentUser` for user retrieval
import { db } from "./db";

export const initialProfile = async () => {
  try {
    const user = await currentUser(); // This fetches the current user

    if (!user) {
      return auth().redirectToSignIn({
        returnBackUrl: "/", // Redirects to the home page after signing in
      });
    }

    console.log("User data:", user); // Debugging log to see what user looks like

    const profile = await db.profile.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (profile) {
      return profile;
    }

    const newProfile = await db.profile.create({
      data: {
        userId: user.id,
        name: `${user.username}`, // Removed extra space
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return newProfile;
  } catch (error) {
    console.error("Error in initialProfile:", error); // Log any error
    throw error;
  }
};
