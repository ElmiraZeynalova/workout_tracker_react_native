import { StatusBar } from "react-native"
import { useEffect, useRef, useCallback} from 'react'
import { getAllWorkouts } from '@/src/sqlite/crud'
import { supabase, syncServerWithSQLite, syncSqliteWithServer } from '@/src/supabase/crud'
import { useUserStore } from "@/src/zustand-store/user-store"
import { useRenderWorkoutOnScreenStore } from "@/src/zustand-store/render-workout-store"
import { Stack, useRouter, usePathname } from 'expo-router'
import NetInfo from '@react-native-community/netinfo'
import { SocketManager } from '../src/sockets/SocketManager'
import { DeepLinkRouter } from '../src/navigation/DeepLinkRouter'
import * as Linking from 'expo-linking';

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();
  
  const setUserId = useUserStore((state) => state.setUserId)
  const setAllWorkouts = useRenderWorkoutOnScreenStore((state) => state.setAll)
  const userId = useUserStore((state) => state.userId)
  
  const pendingDeepLink = useUserStore((state) => state.pendingDeepLink)
  const setPendingDeepLink = useUserStore((state) => state.setPendingDeepLink)

  const isSyncing = useRef(false)
  const wasOffline = useRef(false)


  const init = useCallback(async () => {
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
  }, [])


  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session) {
        setUserId(session.user.id);
        init();
        SocketManager.connect(session.user.id);
      } else {
        setUserId(null)
        SocketManager.disconnect();
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
      SocketManager.disconnect();
    }
  }, [init, setUserId])


  useEffect(() => {
    Linking.getInitialURL().then(url => {
      if (url) setPendingDeepLink(url);
    });
  }, []) 


  useEffect(() => {
    const handleURL = (url: string) => {
      if (!userId) {
        setPendingDeepLink(url);
      } else {
        DeepLinkRouter.handle(url);  
      }
    };

    const subscription = Linking.addEventListener('url', ({ url }) => handleURL(url));
    return () => subscription.remove();
  }, [userId])


  useEffect(() => {
    if (userId && pendingDeepLink && pathname === '/') {
      DeepLinkRouter.handle(pendingDeepLink)
      setPendingDeepLink(null)
    }
  }, [userId, pendingDeepLink, pathname])


  useEffect(() => {
    const isAuthPage = pathname === '/log-in'
    if (!userId && !isAuthPage) {
      router.replace('/log-in')
    } else if (userId && isAuthPage) {
      router.replace('/')
    }
  }, [userId, pathname])


  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor='#F3F3F3' />
      <Stack  />
    </>
  )
}