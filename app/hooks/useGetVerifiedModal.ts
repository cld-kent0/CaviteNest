import { create } from "zustand";

interface GetVerifiedStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useGetVerifiedModal = create<GetVerifiedStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useGetVerifiedModal;
