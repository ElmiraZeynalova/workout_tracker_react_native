import { StatusBar } from "react-native"
import {useEffect} from 'react'
import {openDB} from '@/src/sqlite/open_db'
import { supabase } from '@/src/supabase/crud'
import { useUserStore } from "@/src/store/user-store";
import { Stack } from 'expo-router'

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
        const db = await openDB()
        console.log('DB opened', db)
      }

    loadDB()
    return () => {
      authListener?.subscription.unsubscribe()

    }
  }, [])
  return(
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff"/>
        <Stack>
          {userId ? (
              <Stack.Screen name="index" />     
            ) : (
              <Stack.Screen name="log-in" />    
          )}
        </Stack>
    </>
  );
}
