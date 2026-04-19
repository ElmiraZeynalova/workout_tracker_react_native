import { create } from 'zustand'

type UserStore = {
    email: string | null,
    userId: string | null,
    setEmail: (email: string) => void
    setUserId: (id: string) => void
}

export const useUserStore = create<UserStore>((set) => ({
    email: null,
    userId: null,
    setEmail: (email) => set({email: email}),
    setUserId: (id) => set({userId: id})
}))
