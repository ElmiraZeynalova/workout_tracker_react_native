import { StatusBar } from "react-native"
import {useEffect} from 'react'
import {openDB} from '@/src/sqlite/open_db'
import {printAllWorkouts, cleanDB} from '@/src/sqlite/crud'
import { supabase, syncWorkouts } from '@/src/supabase/crud'
import { useUserStore } from "@/src/store/user-store";
import { Stack, Redirect } from 'expo-router'
import NetInfo from '@react-native-community/netinfo'

export default function RootLayout() {
  const setUserId = useUserStore((state) => state.setUserId)
  const userId = useUserStore((state) => state.userId)

  useEffect(() => {

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session) {
        setUserId(session.user.id)
      }
    })

    let isSyncing = false

    async function syncDataWithServer() {
      if (isSyncing) return
      isSyncing = true
      try {
        await syncWorkouts()
        console.log("Synced with supabase!")
      } finally {
        isSyncing = false
      }
    }

    async function init() {
      await openDB()
      //await cleanDB()
      await printAllWorkouts()
      await syncDataWithServer()
    }

    // const unsubscribe = NetInfo.addEventListener(state => {
    //   if (state.isConnected) {
    //     console.log("Syncing sql with supabase...")
    //     syncDataWithServer() 
    //   }
    // })

    init()
    return () => {
      authListener?.subscription.unsubscribe()
      //unsubscribe()
    }
  }, [])

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor='#F3F3F3' />
      <Stack>

      </Stack>
      {userId ? <Redirect href="/" /> : <Redirect href="/log-in" />}
    </>
  )
}