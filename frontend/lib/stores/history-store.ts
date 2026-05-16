import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Slide } from '@/lib/types'

export const HISTORY_INACTIVITY_TTL_MS = 3 * 60 * 60 * 1000

export interface HistoryItem {
  id: string
  fileName: string
  fileSize: number
  timestamp: number
  slides: Slide[]
  status: 'completed' | 'processing' | 'failed'
}

interface HistoryState {
  items: HistoryItem[]
  lastActiveAt: number
  addItem: (item: HistoryItem) => void
  markActive: () => void
  pruneExpired: () => void
  removeItem: (id: string) => void
  getItem: (id: string) => HistoryItem | undefined
}

function isExpired(lastActiveAt: number) {
  return Date.now() - lastActiveAt > HISTORY_INACTIVITY_TTL_MS
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      items: [],
      lastActiveAt: Date.now(),
      addItem: (item) => set((state) => ({ 
        items: [item, ...state.items].slice(0, 50), // Keep last 50
        lastActiveAt: Date.now(),
      })),
      markActive: () => set({ lastActiveAt: Date.now() }),
      pruneExpired: () => set((state) => (
        state.items.length > 0 && isExpired(state.lastActiveAt)
          ? { items: [], lastActiveAt: Date.now() }
          : state
      )),
      removeItem: (id) => set((state) => ({ 
        items: state.items.filter((item) => item.id !== id) 
      })),
      getItem: (id) => get().items.find((item) => item.id === id),
    }),
    {
      name: 'infograph-ai-history',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
