import {View, Text, StyleSheet} from 'react-native'
import PagerView from 'react-native-pager-view';
import {useDateStore} from '../zustand-store/date-store'
import {useState, useMemo, useRef, useEffect} from 'react'
import dayjs from 'dayjs'
import DayContent from './DayContent';

const RANGE = 14
function generateDateRange(centerDate: string){
    return Array.from({length: RANGE * 2 + 1}, (_, i) => (
        i < RANGE ? 
            dayjs(centerDate).subtract(RANGE - i, 'day').format('YYYY-MM-DD') : 
            dayjs(centerDate).add(i - RANGE, 'day').format('YYYY-MM-DD'))
    )
}

export default function DaySwiper(){
    const selectedDate = useDateStore(state => state.selectedDate)
    const setSelectedDate = useDateStore(state => state.setSelectedDate)
    const centerDate = useDateStore(state => state.centerDate)
    const setCenterDate = useDateStore(state => state.setCenterDate)
    const pagerRef = useRef<PagerView>(null)

    const dates = useMemo(
        () => generateDateRange(centerDate),
        [centerDate]
    )

    const initialSlideIndex = useMemo(() => {
        return dates.findIndex(date => date === selectedDate);
    }, [dates, selectedDate])

    useEffect(() => {
        const index = dates.findIndex(date => date === selectedDate)
        if (index >= 0 && pagerRef.current) {
            pagerRef.current.setPage(index);
        }
    }, [selectedDate, dates])

    function handleSelectedPage(e: any){
        const index = e.nativeEvent.position
        setSelectedDate(dates[index])
        if(index === dates.length - 1 || index === 0){
            setCenterDate(dates[index])
        }
    }

    return(
        <PagerView 
            key={centerDate}
            ref={pagerRef}
            style={styles.pagerView}
            initialPage={initialSlideIndex}
            onPageSelected={handleSelectedPage}>
            {dates.map(date => (
                <View key={date} style={styles.slide}>
                    <DayContent date={date}/>
                </View>
            ))}
        </PagerView>
    )
}

const styles = StyleSheet.create({
    pagerView: {
        flex: 1,
        backgroundColor: '#F3F3F3',
    },
    slide: {
        flex: 1,
        padding: 7,

    },

})