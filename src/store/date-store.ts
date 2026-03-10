import { create } from 'zustand'
import dayjs from 'dayjs'


type DateStore = {
    centerDate: string,
    selectedDate: string,
    setCenterDate: (date: string) => void,
    setSelectedDate: (date: string) => void,
    goPrevDay: () => void,
    goNextDay: () => void,
}

export const useDateStore = create<DateStore>((set) => ({
    centerDate:  dayjs().format('YYYY-MM-DD'),
    selectedDate:  dayjs().format('YYYY-MM-DD'),
    setCenterDate: (date) => set({centerDate: date}),
    setSelectedDate: (date) => set({selectedDate: date}),
    goPrevDay: () => 
        set(state => ({
            selectedDate: dayjs(state.selectedDate)
                .subtract(1, 'day')
                .format('YYYY-MM-DD')
        })),
    goNextDay: () => 
        set(state => ({
            selectedDate: dayjs(state.selectedDate)
                .add(1, 'day')
                .format('YYYY-MM-DD')
        })) 
}))


