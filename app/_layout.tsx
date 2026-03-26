import { StatusBar } from "react-native"
import {useEffect, useRef} from 'react'
import {openDB} from '@/src/sqlite/open_db'
import {printAllWorkouts, cleanDB} from '@/src/sqlite/crud'
import { supabase, syncWorkouts, syncLocalDBWithServer } from '@/src/supabase/crud'
import { useUserStore } from "@/src/store/user-store";
import { Stack, Redirect } from 'expo-router'
import NetInfo from '@react-native-community/netinfo'
import { useForceRerenderStore } from "@/src/store/forceRerender"

export default function RootLayout() {
  const setUserId = useUserStore((state) => state.setUserId)
  const userId = useUserStore((state) => state.userId)
  const isSyncing = useRef(false)
  const forceRerender = useForceRerenderStore(state => state.setRerender)
  useEffect(() => {

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session) {
        setUserId(session.user.id)
      }
    })

    async function syncData() {
      if (isSyncing.current) return
      isSyncing.current = true
      try {
        await syncWorkouts()
        console.log("Synced sqlite with supabase!")
        await syncLocalDBWithServer()
        console.log("Synced supabase with sqlite!!")
      } finally {
        isSyncing.current = false
      }
    }

    async function init() {
      await openDB()
      //await cleanDB()
      await printAllWorkouts()
      await syncData()
      forceRerender()
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