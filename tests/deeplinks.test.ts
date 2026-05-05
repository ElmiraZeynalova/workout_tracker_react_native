import { DeepLinkRouter } from '../src/navigation/DeepLinkRouter'

const mockPush = jest.fn()
const mockReplace = jest.fn()
jest.mock('expo-router', () => ({
  router: {
    push: (...args: any[]) => mockPush(...args),
    replace: (...args: any[]) => mockReplace(...args),
    canGoBack: () => false,
  },
}))

jest.mock('../src/zustand-store/date-store', () => ({
  useDateStore: {
    getState: () => ({
      setCenterDate: jest.fn(),
      setSelectedDate: jest.fn(),
    }),
  },
}))

beforeEach(() => {
  mockPush.mockClear()
  mockReplace.mockClear()
})


describe('parseURL', () => {
  test('розпізнає invite з кастомною схемою exp://', () => {
    const result = DeepLinkRouter.parseURL('exp://192.168.1.134:8081/--/invite/ABC')
    expect(result).toEqual({ type: 'invite', token: 'ABC' })
  })

  test('розпізнає invite з HTTPS-схемою', () => {
    const result = DeepLinkRouter.parseURL('https://workouttracker.com/invite/TOKEN99')
    expect(result).toEqual({ type: 'invite', token: 'TOKEN99' })
  })

  test('розпізнає index з параметром date', () => {
    const result = DeepLinkRouter.parseURL('exp://192.168.1.134:8081/--/?date=2024-12-01')
    expect(result).toEqual({ type: 'index', date: '2024-12-01' })
  })

  test('розпізнає index з параметром date через HTTPS', () => {
    const result = DeepLinkRouter.parseURL('https://workouttracker.com/?date=2025-01-15')
    expect(result).toEqual({ type: 'index', date: '2025-01-15' })
  })

  test('розпізнає calendar', () => {
    const result = DeepLinkRouter.parseURL('exp://192.168.1.134:8081/--/calendar')
    expect(result).toEqual({ type: 'calendar' })
  })

  test('розпізнає calendar через HTTPS', () => {
    const result = DeepLinkRouter.parseURL('https://workouttracker.com/calendar')
    expect(result).toEqual({ type: 'calendar' })
  })

  test('розпізнає кореневий маршрут як index', () => {
    const result = DeepLinkRouter.parseURL('exp://192.168.1.134:8081/--/')
    expect(result).toEqual({ type: 'index' })
  })

  test('невідомий маршрут повертає null без exception', () => {
    expect(() => {
      const result = DeepLinkRouter.parseURL('exp://192.168.1.134:8081/--/nonexistent/route')
      expect(result).toBeNull()
    }).not.toThrow()
  })

  test('порожній рядок повертає null без exception', () => {
    expect(() => {
      const result = DeepLinkRouter.parseURL('')
      expect(result).toBeNull()
    }).not.toThrow()
  })

  test('невідома схема повертає null', () => {
    const result = DeepLinkRouter.parseURL('ftp://someserver.com/invite/123')
    expect(result).toBeNull()
  })
})


describe('handle', () => {
  test('handle з валідним invite URL викликає router.push на /invite/[token]', () => {
    DeepLinkRouter.handle('exp://192.168.1.134:8081/--/invite/777')
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/invite/[token]',
      params: { token: '777' },
    })
  })

  test('handle з невідомим URL не викликає navigate', () => {
    DeepLinkRouter.handle('exp://192.168.1.134:8081/--/nonexistent')
    expect(mockPush).not.toHaveBeenCalled()
    expect(mockReplace).not.toHaveBeenCalled()
  })
})