import { StatusBar } from "react-native"
import {useEffect, useRef, useCallback, useState} from 'react'
import {openDB} from '@/src/sqlite/open_db'
import {cleanDB, getAllWorkouts, deleteTables} from '@/src/sqlite/crud'

import {createTables} from '@/src/sqlite/create_tables'
import { supabase, syncServerWithSQLite, syncSqliteWithServer } from '@/src/supabase/crud'
import { useUserStore } from "@/src/zustand-store/user-store";
import { useRenderWorkoutOnScreenStore } from "@/src/zustand-store/render-workout-store"
import { Stack, Redirect } from 'expo-router'
import NetInfo from '@react-native-community/netinfo'

export default function RootLayout() {
  const setUserId = useUserStore((state) => state.setUserId)
  const setAllWorkouts = useRenderWorkoutOnScreenStore((state) => state.setAll)
  const userId = useUserStore((state) => state.userId)
  const isSyncing = useRef(false)
  const wasOffline = useRef(false)
  const [dbReady, setDbReady] = useState(false)   
    const pendingSync = useRef(false) // ← добавь

  const init = useCallback(async () => {
    if (!dbReady) {
      pendingSync.current = true // ← запомни что нужно синкнуть
      return
    }
    if (isSyncing.current) return
    isSyncing.current = true
    try {
      const workouts = await getAllWorkouts()
      setAllWorkouts(workouts)
      await syncServerWithSQLite()
      await syncSqliteWithServer()
    } catch (err) {
      console.warn("Sync failed", err)
    } finally {
      isSyncing.current = false
    }
  }, [dbReady])

  useEffect(() => {
    const start = async () => {
      await openDB()
      setDbReady(true)
    }
    start()
  }, [])

  useEffect(() => {
    if (dbReady && pendingSync.current) {
      pendingSync.current = false
      init()
    }
  }, [dbReady])

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session) {
        setUserId(session.user.id)
        init()
      }
    })

    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      if (!state.isConnected) {
        wasOffline.current = true
        return
      }
      if (state.isConnected && wasOffline.current) {
        wasOffline.current = false
        init()
      }
    })

    return () => {
      authListener?.subscription.unsubscribe()
      unsubscribeNetInfo()
    }
  }, [init])


  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor='#F3F3F3' />
      <Stack></Stack>
      {userId ? <Redirect href="/" /> : <Redirect href="/log-in" />}
    </>
  )
}