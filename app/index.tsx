import {View, Pressable, StyleSheet} from "react-native";
import { Stack} from "expo-router";
import MainSwiper from "../src/components/MainSwiper"
import DateBar from "../src/components/DateBar"
import { useDateStore } from "@/src/store/date-store";
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
            <Pressable onPress={() => router.navigate('/log-workout')} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
              <AntDesign name="plus" size={24} color="black" />
            </Pressable>,
          headerRight: () => 
              <Pressable onPress={() => router.navigate('/calendar')} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
                <MaterialCommunityIcons name="calendar-month-outline" size={24} color="black" />
              </Pressable>,
          headerTitle: dayjs(date).format("MMMM D"),
          headerTitleAlign: 'center',
          headerShadowVisible: false,

      }} />
      <View style={styles.view}>
        <DateBar/>
        <MainSwiper/>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  }
})