import { useUserStore } from "@/src/store/user-store"
import { signInUser, verifyOtp } from "@/src/supabase/crud"
import { useState, useEffect } from 'react'
import { View, Pressable, Text, TextInput } from 'react-native'

export default function LogIn() {
    const emailFromStore = useUserStore((state) => state.email)
    const setEmail = useUserStore((state) => state.setEmail)

    const [email, setLocalEmail] = useState(emailFromStore ?? '')
    const [error, setError] = useState('')
    const [step, setStep] = useState<'email' | 'otp'>('email')
    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(false)

    // если email в сторе изменился (например после reload)
    useEffect(() => {
        if (emailFromStore) {
            setLocalEmail(emailFromStore)
        }
    }, [emailFromStore])

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

        setEmail(email) // сохраняем в zustand
        setStep('otp')
    }

    async function handleVerify() {
        if (code.length !== 6) {
            setError('Enter 6-digit code')
            return
        }

        setLoading(true)
        setError('')

        const { error } = await verifyOtp(email, code)

        setLoading(false)

        if (error) {
            setError(error.message)
            return
        }

        // успех → layout сам переключит экран
    }

    return (
        <View style={{ padding: 20, flex: 1, justifyContent: 'center' }}>
            {step === 'email' ? (
                <>
                    <Text>Email:</Text>

                    <TextInput
                        placeholder="example@gmail.com"
                        value={email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onChangeText={(text) => {
                            setLocalEmail(text)
                            setError('')
                        }}
                        style={{
                            borderWidth: 1,
                            padding: 10,
                            marginTop: 8,
                            borderRadius: 6
                        }}
                    />

                    {error ? (
                        <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text>
                    ) : null}

                    <Pressable
                        disabled={!email || loading}
                        onPress={handleLogin}
                        style={{
                            backgroundColor: (!email || loading) ? '#ccc' : '#4a90e2',
                            padding: 14,
                            borderRadius: 6,
                            marginTop: 16
                        }}
                    >
                        <Text style={{
                            color: (!email || loading) ? '#666' : '#fff',
                            textAlign: 'center'
                        }}>
                            {loading ? 'Sending...' : 'Log in'}
                        </Text>
                    </Pressable>
                </>
            ) : (
                <>
                    <Text>
                        Enter the 6-digit code sent to {email}:
                    </Text>

                    <TextInput
                        placeholder="123456"
                        value={code}
                        keyboardType="number-pad"
                        maxLength={6}
                        autoFocus
                        onChangeText={(text) => {
                            setCode(text)
                            setError('')
                        }}
                        style={{
                            borderWidth: 1,
                            padding: 10,
                            marginTop: 12,
                            borderRadius: 6,
                            textAlign: 'center',
                            letterSpacing: 8
                        }}
                    />

                    {error ? (
                        <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text>
                    ) : null}

                    <Pressable
                        disabled={code.length !== 6 || loading}
                        onPress={handleVerify}
                        style={{
                            backgroundColor: (code.length !== 6 || loading) ? '#ccc' : '#4a90e2',
                            padding: 14,
                            borderRadius: 6,
                            marginTop: 16
                        }}
                    >
                        <Text style={{
                            color: (code.length !== 6 || loading) ? '#666' : '#fff',
                            textAlign: 'center'
                        }}>
                            {loading ? 'Verifying...' : 'Verify'}
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() => {
                            setStep('email')
                            setCode('')
                            setError('')
                        }}
                        style={{ marginTop: 20 }}
                    >
                        <Text style={{ color: '#4a90e2', textAlign: 'center' }}>
                            ← Back
                        </Text>
                    </Pressable>
                </>
            )}
        </View>
    )
}
