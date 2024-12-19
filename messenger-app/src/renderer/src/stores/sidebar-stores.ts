import { create } from 'zustand'

export interface SidebarState {
  isOpen: boolean
  isMinimal: boolean
  handleOpenOrClose: () => void
  handleClose: () => void
  handleChangeSideBar: () => void
  setIsOpen: (isOpen: boolean) => void
}

export const useSidebarStore = create<SidebarState>()((set) => ({
  isOpen: false,
  isMinimal: false,
  handleOpenOrClose: () => set((state) => ({ ...state, isOpen: !state.isOpen })),
  handleClose: () => set({ isOpen: false }),
  handleChangeSideBar: () => set((state) => ({ ...state, isMinimal: !state.isMinimal })),
  setIsOpen: (isOpen: boolean) => set({ isOpen })
}))
