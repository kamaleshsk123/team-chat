import { ChannelType, Server } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "createServer"
  | "invite"
  | "editServer"
  | "members"
  | "createChannel"
  | "leaveServer"
  | "deleteServer";

interface ModalData {
  server?: Server;
  channelType?: ChannelType;
}

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  data: ModalData;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type, data = {}) => {
    console.log("onOpen called with type:", type);
    set({ type, isOpen: true, data });
  },
  onClose: () => {
    console.log("onClose called");
    set({ type: null, isOpen: false });
  },
}));
