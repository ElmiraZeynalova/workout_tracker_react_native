import { create } from 'zustand'
import dayjs from 'dayjs'

type DateStore = {
    centerDate: string,
    selectedDate: string,
    setCenterDate: (date: string) => void,
    setSelectedDate: (date: string) => void,
}

export const useDateStore = create<DateStore>((set) => ({
    centerDate:  dayjs().format('YYYY-MM-DD'),
    selectedDate:  dayjs().format('YYYY-MM-DD'),
    setCenterDate: (date) => set({centerDate: date}),
    setSelectedDate: (date) => set({selectedDate: date}),

}))
