import { Stack, router } from "expo-router";
import { StatusBar } from "react-native"

export default function RootLayout() {
  return(
    <>
      <StatusBar barStyle="light-content" backgroundColor="#111"/>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#111"
          },
          headerShadowVisible: true,
          headerTintColor: "#111",
          headerTitleStyle: {
            color: "white"
          },
        }}>


      </Stack>
    </>
  );
}
