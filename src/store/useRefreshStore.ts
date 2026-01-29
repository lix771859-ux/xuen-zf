import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface RefreshStore {
  openDetail: boolean
  shouldRefresh: boolean
  setOpenDetail: (value: boolean) => void
  markShouldRefresh: () => void
  clearRefresh: () => void
}

export const useRefreshStore = create<RefreshStore>()(
  persist(
    (set) => ({
      openDetail: false,
      shouldRefresh: false,

      setOpenDetail: (value) => set({ openDetail: value }),
      markShouldRefresh: () => set({ shouldRefresh: true }),
      clearRefresh: () => set({ shouldRefresh: false }),
    }),
    {
      name: 'refresh-store',
      partialize: (state) => ({
        openDetail: state.openDetail, // 只持久化这个
      }),
    }
  )
)