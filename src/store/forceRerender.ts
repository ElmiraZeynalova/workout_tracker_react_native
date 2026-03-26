import { create } from 'zustand'

type RerenderStore = {
    rerender: number,
    setRerender: () => void,
}

export const useForceRerenderStore = create<RerenderStore>((set) => ({
    rerender:  0,
    setRerender: () => set(state => ({ rerender: state.rerender + 1 })),

}))