// store/useRefreshStore.ts
import { create } from 'zustand'

interface RefreshStore {
  shouldRefresh: boolean
  markShouldRefresh: () => void
  clearRefresh: () => void
}
export const useRefreshStore = create<RefreshStore>((set) => ({
  shouldRefresh: false,
  markShouldRefresh: () => set({ shouldRefresh: true }),
  clearRefresh: () => set({ shouldRefresh: false }),
}))