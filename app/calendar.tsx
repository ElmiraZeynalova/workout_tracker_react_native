import { Text, View, Pressable, StyleSheet} from "react-native";
import { Stack} from "expo-router";
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from 'expo-router';
import { supabase } from '@/src/supabase/crud'

export default function Calendar(){
    const router = useRouter();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error(error.message);
        }
        router.navigate('/log-in')
    };

    return(
        <>
            <Stack.Screen options={{
                headerLeft: () => 
                    <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
                        <Entypo name="chevron-left" size={24} color="black" />
                     </Pressable>, 
                headerTitle: 'Calendar',
                headerTitleAlign: 'center',
                headerShadowVisible: false,
                headerStyle: {
                    backgroundColor: '#F3F3F3',
                },
            }} />
            <View style={styles.view}>
            {__DEV__ && (
                <Pressable onPress={() => router.push('/debug')} style={({ pressed }) => [styles.debugBtn, pressed && styles.pressed]}>
                    <Text style={{fontSize: 16, fontWeight: 500}}>🛠 Debug</Text>
                </Pressable>
            )}
            <Pressable onPress={handleLogout} style={({ pressed }) => [styles.btn, pressed && styles.pressed]}>
                <Text style={styles.btnText}>Log out</Text>
            </Pressable>
            </View>
        </>
    )
}


const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: '#F3F3F3',
    padding: 12,
    gap: 20
  },
  pressed: {
      opacity: 0.5,
  },
  btn: {
    flexDirection: 'row',
    gap: 10,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#FF5526',
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 500,
  },
  debugBtn: {
    width: 120,
    borderWidth: 1.5,
    borderColor: '#FF5526',
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 18
  },

})
