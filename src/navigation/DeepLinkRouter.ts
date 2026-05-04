import { router } from 'expo-router'
import { Destination } from './destination'
import { useDateStore } from '../zustand-store/date-store'

export const DeepLinkRouter = {

  parseURL(url: string): Destination | null {
    try {
      const urlObj = new URL(url)
      const path = urlObj.pathname
      const dateParam = urlObj.searchParams.get('date')

      const isCustomScheme = urlObj.protocol === 'exp:' || urlObj.protocol === 'workouttracker:'
      const isHttps = urlObj.protocol === 'https:' && urlObj.hostname === 'workouttracker.com'

      if (!isCustomScheme && !isHttps) return null

      if (path.includes('invite')) {
        const token = path.split('/').pop()!
        return { type: 'invite', token }
      }
      if (dateParam) {
        return { type: 'index', date: dateParam }
      }
      if (path.includes('calendar')) {
        return { type: 'calendar' }
      }

      const normalizedPath = path.replace(/^\/--/, '').replace(/\/$/, '')
      if (normalizedPath === '' || normalizedPath === '/') {
        return { type: 'index' }
      }

      return null
    } catch (e) {
      console.warn('DeepLinkRouter: failed to parse URL:', url, e)
      return null
    }
  },

  navigate(destination: Destination) {
    switch (destination.type) {
      case 'invite':
        router.push({ 
          pathname: '/invite/[token]' as any, 
          params: { token: destination.token } 
        });
      break

      case 'index':
        if (destination.date) {
          useDateStore.getState().setCenterDate(destination.date)
          useDateStore.getState().setSelectedDate(destination.date)
        }
        if (router.canGoBack()) {
          try {
            router.dismissAll()
          } catch (e) {

          }
        }
        router.replace('/')
        break

        case 'calendar':
          router.push('/calendar')
        break
    }
  },

  handle(url: string) {
    const dest = this.parseURL(url)
    if (dest) {
      this.navigate(dest)
    } else {
      console.warn(`DeepLinkRouter: Unknown route for URL: ${url}`)
    }
  }
};