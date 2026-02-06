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
  landlordId: string
  setLandlordId: (value: string) => void
  title: string
  setTitle: (value: string) => void
  lastTab: string
  setLastTab: (value: string) => void
}

export const useRefreshStore = create<RefreshStore>()(
  persist(
    (set) => ({
      id:0,
      openDetail: false,
      shouldRefresh: false,
      landlordId: '',
      setLandlordId: (value: string) => set({ landlordId: value }),
      setId: (value: number) => set({ id: value }),
      setOpenDetail: (value) => set({ openDetail: value }),
      markShouldRefresh: () => set({ shouldRefresh: true }),
      clearRefresh: () => set({ shouldRefresh: false }),
      title: '',
      setTitle: (value: string) => set({ title: value }),
      lastTab: '',
      setLastTab: (value: string) => set({ lastTab: value }),
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