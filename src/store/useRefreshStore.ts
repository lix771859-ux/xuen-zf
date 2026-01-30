import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface RefreshStore {
  id: number
  setId: (value: number) => void
  openDetail: boolean
  shouldRefresh: boolean
  setOpenDetail: (value: boolean) => void
  markShouldRefresh: () => void
  clearRefresh: () => void
}

export const useRefreshStore = create<RefreshStore>()(
  persist(
    (set) => ({
      id:0,
      openDetail: false,
      shouldRefresh: false,

      setId: (value: number) => set({ id: value }),
      setOpenDetail: (value) => set({ openDetail: value }),
      markShouldRefresh: () => set({ shouldRefresh: true }),
      clearRefresh: () => set({ shouldRefresh: false }),
    }),
    {
      name: 'refresh-store',
      partialize: (state) => ({
        id: state.id,
        openDetail: state.openDetail, // 只持久化这个
      }),
    }
  )
)