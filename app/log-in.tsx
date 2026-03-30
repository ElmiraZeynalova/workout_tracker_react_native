import { useUserStore } from "@/src/store/user-store"
import { signInUser, verifyOtp } from "@/src/supabase/crud"
import { useState, useEffect } from 'react'
import { View, Pressable, Text, TextInput, StyleSheet } from 'react-native'
import { Stack} from "expo-router";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Feather from '@expo/vector-icons/Feather';

export default function LogIn() {
    const emailFromStore = useUserStore((state) => state.email)
    const setEmail = useUserStore((state) => state.setEmail)

    const [email, setLocalEmail] = useState(emailFromStore ?? '')
    const [error, setError] = useState('')
    const [step, setStep] = useState<'email' | 'otp'>('email')
    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleLogin() {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Invalid email address')
            return
        }

        setLoading(true)
        setError('')

        const { error } = await signInUser(email)

        setLoading(false)

        if (error) {
            setError(error.message)
            return
        }

        setEmail(email) 
        setStep('otp')
    }

    async function handleVerify() {
        if (code.length !== 6) {
            setError('Enter 6-digit code')
            return
        }

        setLoading(true)  
        setError('')

        const { error } = await verifyOtp(email!, code)

        setLoading(false) 

        if (error) {
            setError(error.message)
            return
        }
    }

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.view}>
                {step === 'email' ? (
                    <>
                        <Text style={styles.headerText}>Login</Text>
                        <Text style={styles.subHeaderText}>Please Sign in to continue</Text>
                        <View style={styles.form}>                       
                            <FontAwesome6 name="envelope" size={20} color="black" />
                            <TextInput
                                testID="email-input"
                                placeholder="Email"
                                placeholderTextColor="#7a7a7a"
                                value={email}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                onChangeText={(text) => {
                                    setLocalEmail(text)
                                    setError('')
                                }}
                                style={[styles.input]}
                            />
                        </View>


                        {error ? (
                            <Text style={{ color: 'red', marginTop: 8}}>{error}</Text>
                        ) : null}

                        <Pressable
                            testID="login-button"
                            disabled={!email || loading}
                            onPress={handleLogin}
                            style={({ pressed }) => [styles.button, pressed && styles.pressed, {backgroundColor: (!email || loading) ? '#ccc' : '#FF5526'}]}
                        >
                            <Text style={{
                                color: (!email || loading) ? '#666' : '#fff',
                                textAlign: 'center',
                                fontWeight: 500,
                                fontSize: 16

                            }}>
                                {loading ? 'Sending...' : 'Login'}
                            </Text>
                        </Pressable>
                    </>
                ) : (
                    <>
                        <Text style={styles.subHeaderText}>Enter the 6-digit code sent to {email}:</Text>
                        <View style={styles.form}>
                            <Feather name="lock" size={20} color="black" />
                            <TextInput
                                testID="otp-input"
                                placeholder="6-digit code"
                                placeholderTextColor="#7a7a7a"
                                value={code}
                                keyboardType="number-pad"
                                maxLength={6}
                                autoFocus
                                onChangeText={(text) => {
                                    setCode(text)
                                    setError('')
                                }}
                                style={styles.input}
                            />
                        </View>


                        {error ? (
                            <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text>
                        ) : null}

                        <Pressable
                            testID="verify-btn"
                            disabled={code.length !== 6 || loading}
                            onPress={handleVerify}
                            style={({ pressed }) => [styles.button, pressed && styles.pressed, {backgroundColor: (code.length !== 6 || loading) ? '#ccc' : '#FF5526'}]}
                            >
                            <Text style={{
                                color: (code.length !== 6 || loading) ? '#666' : '#fff',
                                textAlign: 'center',
                                fontWeight: 500,
                                fontSize: 16
                            }}>
                                {loading ? 'Verifying...' : 'Verify'}
                            </Text>
                        </Pressable>

                        <Pressable
                            testID="back-btn"
                            onPress={() => {
                                setStep('email')
                                setCode('')
                                setError('')
                            }}
                            style={{ marginTop: 20 }}
                        >
                            <Text style={{ color: 'black', textAlign: 'center' }}>
                                Back
                            </Text>
                        </Pressable>
                    </>
                )}
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    pressed: {
      opacity: 0.5,
    },
    view: { 
        padding: 30,
        flex: 1, 
        justifyContent: 'center' 
    },
    headerText:{
        color: 'black',
        fontWeight: 700,
        fontSize: 35,
        marginBottom: 5,
    },
    subHeaderText: {
        color: '#7a7a7a',
        fontWeight: 400,
        fontSize: 17,
        marginBottom: 30,
    },
    form: {
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 10,
        backgroundColor: 'white',
        borderRadius: 40,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 25,
        elevation: 4,          
        shadowColor: '#787878',    
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    }, 

    input: {       
        borderWidth: 0,             
        borderColor: 'none',
        margin: 0,
        padding: 0

    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 50,
        borderRadius: 20,
    },
})