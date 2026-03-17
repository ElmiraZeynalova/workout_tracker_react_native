import { Text, View, Pressable, StyleSheet} from "react-native";
import { Stack} from "expo-router";
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from 'expo-router';

export default function Calendar(){
    const router = useRouter();
    return(
        <>
            <Stack.Screen options={{
                headerLeft: () => 
                    <Pressable onPress={() => router.navigate('/')} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
                        <Entypo name="chevron-left" size={24} color="black" />
                     </Pressable>, 
                headerTitle: 'Calendar',
                headerTitleAlign: 'center',
                headerShadowVisible: false,
            }} />
            <View style={styles.view}>
                <Text>Calendar Page</Text>
            </View>
        </>
    )
}


const styles = StyleSheet.create({
  view: {
    flex: 1,
  }
})