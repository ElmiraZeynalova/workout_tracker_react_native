import { SocketManager } from '../src/sockets/SocketManager';
import { socket } from '../src/sockets/socket';
import { useRenderWorkoutOnScreenStore } from '../src/zustand-store/render-workout-store';

jest.mock('../src/sockets/socket', () => ({
  socket: {
    connect: jest.fn(),
    disconnect: jest.fn(),
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    io: { opts: { query: {} } },
    connected: false,
  },
}));

const mockSetWorkout = jest.fn();

jest.mock('../src/zustand-store/render-workout-store', () => ({
  useRenderWorkoutOnScreenStore: {
    getState: () => ({
      setWorkout: mockSetWorkout,
    }),
  },
}));

describe('SocketManager Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('1. Initial socket status should be Disconnected', () => {
    expect(SocketManager).toBeDefined(); 
    expect(SocketManager.getStatus()).toBe('Disconnected');
  });

  test('2. connect() should call socket.connect method', () => {
    SocketManager.connect('user_123');
    expect(socket.connect).toHaveBeenCalled();
  });

  test('3. connect() should change status to Connecting', () => {
    SocketManager.connect('user_123');
    expect(SocketManager.getStatus()).toBe('Connecting');
  });

  test('4. userId should be correctly passed into the socket query', () => {
    SocketManager.connect('test-uuid');
    expect(socket.io.opts.query).toEqual({ userId: 'test-uuid' });
  });

  test('5. Status should change to Connected on connect event', () => {
    SocketManager.connect('user_123');
    const onConnectCall = (socket.on as jest.Mock).mock.calls.find(c => c[0] === 'connect');
    onConnectCall[1](); 
    expect(SocketManager.getStatus()).toBe('Connected');
  });

  test('6. Status should change to Reconnecting on connection error', () => {
    SocketManager.connect('user_123'); 
    const onErrorCall = (socket.on as jest.Mock).mock.calls.find(c => c[0] === 'connect_error');
    onErrorCall[1](); 
    expect(SocketManager.getStatus()).toBe('Reconnecting');
  });

  test('7. disconnect() should call socket.disconnect method', () => {
    SocketManager.disconnect();
    expect(socket.disconnect).toHaveBeenCalled();
  });

  test('8. disconnect() should reset status to Disconnected', () => {
    SocketManager.disconnect();
    expect(SocketManager.getStatus()).toBe('Disconnected');
  });

  test('9. disconnect() should remove SET_WORKOUT listener', () => {
    SocketManager.disconnect();
    expect(socket.off).toHaveBeenCalledWith("SET_WORKOUT");
  });

  test('10. send() should call emit if the socket is connected', () => {
    socket.connected = true;
    SocketManager.send('EVENT', { data: 1 });
    expect(socket.emit).toHaveBeenCalledWith('EVENT', { data: 1 });
  });

  test('11. send() should not call emit if the socket is disconnected', () => {
    socket.connected = false;
    SocketManager.send('EVENT', { data: 1 });
    expect(socket.emit).not.toHaveBeenCalled();
  });

  test('12. onMessage should successfully register a custom handler', () => {
    const handler = jest.fn();
    SocketManager.onMessage(handler);
    
    const validData = { date: '2026-05-02', exercises: [] };
    
    const onMessageCall = (socket.on as jest.Mock).mock.calls.find(c => c[0] === 'SET_WORKOUT');
    onMessageCall[1](validData);
    
    expect(handler).toHaveBeenCalledWith(validData);
  });
});

describe('Data Sync Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    SocketManager.connect('user_123'); 
  });

  test('13. Receiving SET_WORKOUT should call setWorkout in the store', () => {
    const mockData = { date: '2026-05-02', exercises: [] };
    const onMessageCall = (socket.on as jest.Mock).mock.calls.find(c => c[0] === 'SET_WORKOUT');
    onMessageCall[1](mockData);

    expect(mockSetWorkout).toHaveBeenCalledWith(mockData.date, mockData.exercises);
  });

  test('14. Store should not update if the data is corrupted (missing exercises)', () => {
    mockSetWorkout.mockClear(); 
    const onMessageCall = (socket.on as jest.Mock).mock.calls.find(c => c[0] === 'SET_WORKOUT');
    onMessageCall[1]({ date: '2026-05-02' }); 
    
    expect(mockSetWorkout).not.toHaveBeenCalled();
  });

  test('15. Store should not update if null is received', () => {
    mockSetWorkout.mockClear();
    const onMessageCall = (socket.on as jest.Mock).mock.calls.find(c => c[0] === 'SET_WORKOUT');
    onMessageCall[1](null);
    
    expect(mockSetWorkout).not.toHaveBeenCalled();
  });
});