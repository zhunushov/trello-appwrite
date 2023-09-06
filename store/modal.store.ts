import { create } from "zustand";

interface ModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  openModal() {
    console.log("OPEN");

    set({ isOpen: true });
  },
  closeModal() {
    set({ isOpen: false });
  },
}));
