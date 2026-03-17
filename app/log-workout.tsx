import {useState} from 'react'
import {View, Pressable, Text, StyleSheet} from "react-native";
import { Stack} from "expo-router";
import { useDateStore } from "@/src/store/date-store";
import dayjs from 'dayjs'
import { useRouter } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';

export default function LogWorkout() {
  const router = useRouter();
  const date = useDateStore(state => state.selectedDate)
  return(
    <>
      <Stack.Screen options={{
          headerLeft: () => 
            <Pressable onPress={() => router.navigate('/')} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
              <Entypo name="chevron-left" size={24} color="black" />
            </Pressable>,
          headerRight: () => 
              <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
                <Text>Finish</Text>
              </Pressable>,
          headerTitle: 'Log Workout',
          headerTitleAlign: 'center',
          headerShadowVisible: false,

      }} />
      <View style={styles.view}>

      </View>
    </>
  )
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  }
})