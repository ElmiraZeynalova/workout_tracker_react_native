import {View, Text, Pressable, StyleSheet, Animated} from 'react-native'
import PagerView from 'react-native-pager-view';
import {useDateStore} from '../store/date-store'
import {useState, useMemo, useRef, useEffect} from 'react'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
dayjs.extend(isoWeek)

const getDayXPosition = (date: string, containerWidth: number) => {
    const weekday = dayjs(date).isoWeekday() - 1  
    const dayWidth = containerWidth / 7
    return dayWidth * weekday + dayWidth / 2 - 22 
}
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
    const xPosition = useRef(new Animated.Value(0)).current
    const [containerWidth, setContainerWidth] = useState(0)
    const isFirstRender = useRef(true)

    useEffect(() => {
        if (containerWidth === 0) return
        const x = getDayXPosition(selectedDate, containerWidth)
        
        if (isFirstRender.current) {
            xPosition.setValue(x)
            isFirstRender.current = false
        } else {
            Animated.spring(xPosition, {
                toValue: x,
                useNativeDriver: true,
            }).start()
        }

        if (!centerWeek.some(day => day.isSame(selectedDate, 'day'))) {
            setCenterWeek(() => generateWeek(dayjs(selectedDate).startOf('isoWeek')))
        }
    }, [selectedDate, containerWidth])


    function handleSelectedPage(e: any){
        const index = e.nativeEvent.position

        const weekday = dayjs(selectedDate).isoWeekday() - 1

        const newDate = weeks[index][weekday] 
    
        setSelectedDate(newDate.format('YYYY-MM-DD'))  

        if(index === weeks.length - 1 || index === 0){
            setCenterWeek(weeks[index])
        }
    }
    const today = dayjs().format('YYYY-MM-DD')
    return(
        <View style={{ position: 'relative' }} onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}>
            <PagerView  
                key={centerWeek[0].format('YYYY-MM-DD')}
                ref={pagerRef}
                style={styles.pagerView}
                pageMargin={25}
                initialPage={1}
                onPageSelected={handleSelectedPage}>
                {weeks.map((week, idx) => (
                    <View key={idx} style={styles.slide}>
                        {idx === 1 && (
                            <Animated.View 
                                pointerEvents="none" 
                                style={[styles.selector, { transform: [{ translateX: xPosition }] }]} 
                            />
                        )}
                        {week.map((day, dayIdx) => (
                            <View key={dayIdx} style={styles.day}>
                                <Text style={[styles.dayLetter, day.format('YYYY-MM-DD') === today && styles.today]}>
                                    {day.format('YYYY-MM-DD') === today ? "TODAY" : day.format("dd")[0]}
                                </Text>
                                <Pressable 
                                    style={[styles.dayNumber]} 
                                    onPress={() => setSelectedDate(day.format('YYYY-MM-DD'))}
                                >
                                    <Text style={[day.format('YYYY-MM-DD') === selectedDate && styles.selectedNumber, {fontSize: 16}]}>{day.format("D")}</Text>
                                </Pressable>
                            </View>
                        ))}
                    </View>
                ))}
            </PagerView>
        </View>
    )
}
const styles = StyleSheet.create({
    dateBar: {
        position: 'sticky',
        zIndex: 9,
    },

    pagerView: {
        height: 70,
        width: '100%',
        backgroundColor: '#F3F3F3',
    },
    slide: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',

    },
    day: {
        position: 'relative',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
    },
    dayLetter:{
        fontSize: 9,
        fontWeight: 400,
        color: '#494949',

    },
    today: {
        color: 'black',
        fontWeight: 700,
    },
    dayNumber: {
        position: 'relative',
        zIndex: 11,  
    },
    selectedNumber: {
        color: 'white',
        fontWeight: 700,
    },
    selector: {
        position: 'absolute',
        top: 25, 
        left: 0,
        width: 44,
        height: 44,
        borderRadius: 50,
        backgroundColor: '#FF5526',
        zIndex: 10,
    },
})