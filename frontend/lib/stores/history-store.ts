import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Slide } from './types'

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
  addItem: (item: HistoryItem) => void
  removeItem: (id: string) => void
  getItem: (id: string) => HistoryItem | undefined
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => ({ 
        items: [item, ...state.items].slice(0, 50) // Keep last 50
      })),
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
