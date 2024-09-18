import { create } from "zustand";

export type ModalType = "createServer";

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  onOpen: (type: ModalType) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  onOpen: (type) => {
    console.log("onOpen called with type:", type);
    set({ type, isOpen: true });
  },
  onClose: () => {
    console.log("onClose called");
    set({ type: null, isOpen: false });
  },
}));
