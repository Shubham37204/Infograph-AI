import { create } from 'zustand'

interface UIState {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  activeSlide: number
  setActiveSlide: (index: number) => void
  isFullscreen: boolean
  toggleFullscreen: () => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  activeSlide: 0,
  setActiveSlide: (index) => set({ activeSlide: index }),
  isFullscreen: false,
  toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),
}))
