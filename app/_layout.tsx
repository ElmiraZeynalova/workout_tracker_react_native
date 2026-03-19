import { StatusBar } from "react-native"
import {useEffect} from 'react'
import {openDB} from '@/src/sqlite/open_db'
import { supabase } from '@/src/supabase/crud'
import { useUserStore } from "@/src/store/user-store";
import { Stack, Redirect } from 'expo-router'

export default function RootLayout() {
  const setUserId = useUserStore((state) => state.setUserId)
  const userId = useUserStore((state) => state.userId)

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session) {
        setUserId(session.user.id)
      }
    })

    async function loadDB() {
      await openDB()
    }

    loadDB()
    return () => authListener?.subscription.unsubscribe()
  }, [])

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor='#F3F3F3' />
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="log-in" />
      </Stack>
      {userId ? <Redirect href="/" /> : <Redirect href="/log-in" />}
    </>
  )
}