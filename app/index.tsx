import {View, Pressable, StyleSheet} from "react-native";
import { Stack } from "expo-router";
import DaySwiper from "../src/components/DaySwiper"
import WeekSwiper from "../src/components/WeekSwiper"
import { useDateStore } from "@/src/zustand-store/date-store";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import dayjs from 'dayjs'
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();
  const date = useDateStore(state => state.selectedDate)

  return(
    <>
      <Stack.Screen options={{
          headerLeft: () => 
            <Pressable testID="plus-btn" accessible={true} accessibilityLabel="plus-btn"  onPress={() => router.navigate('/log-workout')} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
              <AntDesign name="plus" size={24} color="black" />
            </Pressable>,
          headerRight: () => 
              <Pressable testID="calendar-btn" accessible={true} accessibilityLabel="calendar-btn" onPress={() => router.navigate('/calendar')} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
                <MaterialCommunityIcons name="calendar-month-outline" size={24} color="black" />
              </Pressable>,
          headerTitle: dayjs(date).format("MMMM D"),
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#F3F3F3',
          },

      }} />
      <View style={styles.view}>
        <WeekSwiper/>
        <DaySwiper/>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  }
})