import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { useLocalSearchParams, Stack, useRouter} from "expo-router";
import Entypo from '@expo/vector-icons/Entypo';

export default function InviteScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const router = useRouter();

  return (
    <>
        <Stack.Screen options={{
            headerLeft: () => 
                <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
                    <Entypo name="chevron-left" size={24} color="black" />
                </Pressable>, 
            headerTitle: 'Invite',
            headerTitleAlign: 'center',
            headerShadowVisible: false,
            headerStyle: {
                backgroundColor: '#F3F3F3',
            },
        }} />

        <View style={styles.container}>
        <Text style={styles.header}>You've been invited!</Text>
        <Text style={styles.description}>
            You've been invited to join workout by token:
        </Text>
        <View style={styles.tokenContainer}>
            <Text style={styles.tokenText}>{token}</Text>
        </View>

        <View style={styles.buttonGroup}>
            <TouchableOpacity 
            style={[styles.btn]} 
            onPress={() => router.replace('/')}
            >
            <Text style={styles.btnText}>Accept</Text>
            </TouchableOpacity>

            <TouchableOpacity 
            onPress={() => router.replace('/')}
            >
            <Text style={{color: 'black', fontWeight: 500, fontSize: 16, textAlign: 'center'}}>Decline</Text>
            </TouchableOpacity>
        </View>
        </View>
    </>
  );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 25, 
        backgroundColor: '#F3F3F3' 
    },
    header: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        color: '#333', 
        marginBottom: 15 
    },
    description: { 
        fontSize: 16, 
        textAlign: 'center', 
        color: '#666', 
        marginBottom: 25 
    },
    tokenContainer: { 
        backgroundColor: '#fff', 
        padding: 15, 
        borderRadius: 10, 
        borderWidth: 1, 
        borderColor: '#ddd', 
        marginBottom: 40 
    },
    tokenText: { 
        fontSize: 18, 
        fontWeight: '900', 
        color: '#000', 
        letterSpacing: 2 
    },
    buttonGroup: { 
        width: '100%', 
        gap: 15 
    },
    btn: {
        flexDirection: 'row',
        gap: 10,
        width: '95%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#FF5526',
        paddingVertical: 8,
        paddingHorizontal: 25,
        borderRadius: 20,
        marginHorizontal: 'auto'
    },
    btnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 500,
    },
    reject: { backgroundColor: '#FF5252' },
    //btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});