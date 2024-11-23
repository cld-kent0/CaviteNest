import { create } from "zustand";

interface ConfirmReservationModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useConfirmReservationModal = create<ConfirmReservationModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useConfirmReservationModal;
