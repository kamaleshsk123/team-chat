"use client";
import { useEffect, useState } from "react";
import { CreateServerModal } from "@/components/modals/create-server-modal";
import { useModal } from "@/hooks/use-modal-store";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { isOpen, type } = useModal();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* Conditionally render the modal */}
      <CreateServerModal />
    </>
  );
};
