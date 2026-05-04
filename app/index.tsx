import { View, Pressable, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import DaySwiper from "../src/components/DaySwiper";
import WeekSwiper from "../src/components/WeekSwiper";
import { useDateStore } from "@/src/zustand-store/date-store";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import dayjs from "dayjs"


export default function Index() {

  const router = useRouter();

  const selectedDate = useDateStore((state) => state.selectedDate);
  const setSelectedDate = useDateStore((state) => state.setSelectedDate);

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Pressable
              onPress={() => router.navigate("/log-workout")}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            >
              <AntDesign name="plus" size={24} color="black" />
            </Pressable>
          ),

          headerRight: () => (
            <Pressable
              onPress={() => router.navigate("/calendar")}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            >
              <MaterialCommunityIcons
                name="calendar-month-outline"
                size={24}
                color="black"
              />
            </Pressable>
          ),

          headerTitle: dayjs(selectedDate).format("MMMM D"),
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#F3F3F3" },
        }}
      />

      <View style={styles.view}>
        <WeekSwiper />
        <DaySwiper />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
});