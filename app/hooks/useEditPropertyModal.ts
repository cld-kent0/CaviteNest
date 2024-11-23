import { create } from "zustand";

interface EditPropertyModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useEditPropertyModal = create<EditPropertyModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useEditPropertyModal;
