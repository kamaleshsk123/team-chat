import { useSocket } from "@/components/providers/socket-providers";
import { useQueryClient } from "@tanstack/react-query";
import { Member, Message, Profile } from "@prisma/client";
import { useEffect } from "react";

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

type MessageWithMemberWithProfile = Message & {
  member: Member & { profile: Profile };
};

interface OldData {
  pages: Page[];
}

interface Page {
  items: MessageWithMemberWithProfile[];
  // Include other properties if needed
}

export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey,
}: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    // Handle adding new messages
    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData<OldData>([queryKey], (oldData) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [{ items: [message] }],
          };
        }

        const newData = [...oldData.pages];
        newData[0] = {
          ...newData[0],
          items: [message, ...newData[0].items],
        };

        return { ...oldData, pages: newData };
      });
    });

    // Handle updating existing messages
    socket.on(updateKey, (updatedMessage: MessageWithMemberWithProfile) => {
      queryClient.setQueryData<OldData>([queryKey], (oldData) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData; // Early return if there's no data
        }

        const newData = oldData.pages.map((page: Page) => {
          return {
            ...page,
            items: page.items.map((item: MessageWithMemberWithProfile) => {
              // Check if the message ID matches the updated message ID
              if (item.id === updatedMessage.id) {
                return updatedMessage; // Return the updated message
              }
              return item; // Return the original item
            }),
          };
        });

        return { ...oldData, pages: newData };
      });
    });

    // Cleanup the socket listeners
    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [queryClient, addKey, updateKey, queryKey, socket]);
};
