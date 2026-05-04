import { create } from 'zustand'

type UserStore = {
    email: string | null,
    userId: string | null,
    pendingDeepLink: string | null,
    setEmail: (email: string) => void
    setUserId: (id: string | null) => void,
    setPendingDeepLink: (url: string | null) => void
}

export const useUserStore = create<UserStore>((set) => ({
    email: null,
    userId: null,
    pendingDeepLink: null,
    setEmail: (email) => set({email: email}),
    setUserId: (id) => set({userId: id}),
    setPendingDeepLink: (url) => set({ pendingDeepLink: url }),
}))
