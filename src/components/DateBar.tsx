import {View, Text, Pressable, StyleSheet} from 'react-native'
import PagerView from 'react-native-pager-view';
import {useDateStore} from '../store/date-store'
import {useState, useMemo, useRef, useEffect} from 'react'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
dayjs.extend(isoWeek)

const generateWeek= (weekStart: any) => {
    return Array.from({ length: 7 }, (_, i) => weekStart.add(i, 'day'))
}

const generateWeeks = (centerWeek: any) => {
    return Array.from({length: 3}, (_, i) => {
        return generateWeek(centerWeek[0].add(i - 1, 'week'))
    })
}

export default function DateBar(){
    const selectedDate = useDateStore(state => state.selectedDate)
    const setSelectedDate = useDateStore(state => state.setSelectedDate)
    const pagerRef = useRef<PagerView>(null)
    const [centerWeek, setCenterWeek] = useState(() => generateWeek(dayjs(selectedDate).startOf('isoWeek')))
    const weeks = useMemo(() => generateWeeks(centerWeek), [centerWeek])
    const [activeIndex, setActiveIndex] = useState(1)

    useEffect(() => {
        if(!centerWeek.some(day => day.isSame(selectedDate, 'day'))){
            setCenterWeek(() => generateWeek(dayjs(selectedDate).startOf('isoWeek')))
        }
    }, [selectedDate])


    function handleSelectedPage(e: any){
        const index = e.nativeEvent.position
        setActiveIndex(index)

        const weekday = dayjs(selectedDate).isoWeekday() - 1

        const newDate = weeks[index][weekday] 
    
        setSelectedDate(newDate.format('YYYY-MM-DD'))  

        if(index === weeks.length - 1 || index === 0){
            setCenterWeek(weeks[index])
        }
    }

    return(
        <PagerView  
            key={centerWeek[0].format('YYYY-MM-DD')}
            ref={pagerRef}
            style={styles.pagerView}
            initialPage={1}
            onPageSelected={handleSelectedPage}>
            {weeks.map((week, idx) => (
                <View key={idx} style={styles.slide}>
                    { week.map((day, idx) => (
                        <View key={idx} style={styles.day}>
                            <Text>{day.format("dd")[0]}</Text>
                            <Pressable onPress={() => setSelectedDate(day.format('YYYY-MM-DD'))}><Text>{day.format("D")}</Text></Pressable>
                        </View>
                    ))}
                </View>
            ))}
        </PagerView>
    )
}

const styles = StyleSheet.create({
    pagerView: {
        height: 70,
        width: '100%',
    },
    slide: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: '#d44d1b',
    },
    day: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
    },
    dayLetter:{
        fontSize: 9,
    },
    dayNumber:{
        fontSize: 14,
    }

})