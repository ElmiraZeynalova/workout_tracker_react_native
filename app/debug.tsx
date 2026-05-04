import { useState } from 'react'
import { Stack, useRouter} from "expo-router";
import Entypo from '@expo/vector-icons/Entypo';
import {
  View,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native'
import { DeepLinkRouter } from '../src/navigation/DeepLinkRouter'

const QUICK_LINKS = [
  { label: 'Home', url: 'exp://192.168.1.134:8081/--/' },
  { label: 'Calendar', url: 'exp://192.168.1.134:8081/--/calendar' },
  { label: 'Calendar (https)', url: 'https://workouttracker.com/calendar' },
  { label: 'Workout by /?date=2026-04-02', url: 'exp://192.168.1.134:8081/--/?date=2026-04-02' },
  { label: 'Invite (777)', url: 'exp://192.168.1.134:8081/--/invite/777' },
  { label: 'Invite (abc)', url: 'exp://192.168.1.134:8081/--/invite/abc' },
  { label: 'Invite (https)', url: 'https://workouttracker.com/invite/777' },
  { label: 'Unknown route', url: 'exp://192.168.1.134:8081/--/nonexistent' },
]

export default function DebugScreen() {
  if (!__DEV__) return null

  const [url, setUrl] = useState('')
  const [log, setLog] = useState<{ url: string; result: string; time: string }[]>([])
  const router = useRouter()

  const handleOpen = (targetUrl: string) => {
    const trimmed = targetUrl.trim()
    if (!trimmed) {
      Alert.alert('Введіть URL')
      return
    }

    const dest = DeepLinkRouter.parseURL(trimmed)
    const result = dest
      ? `${JSON.stringify(dest)}`
      : 'Unknown route'

    setLog(prev => [
      { url: trimmed, result, time: new Date().toLocaleTimeString() },
      ...prev,
    ])

    if (dest) {
      DeepLinkRouter.navigate(dest)
    }
  }

  return (
    <>
        <Stack.Screen options={{
            headerLeft: () => 
                <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
                    <Entypo name="chevron-left" size={24} color="white" />
                </Pressable>, 
            headerTitle: 'Debug',
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerShadowVisible: false,
            headerStyle: {
                backgroundColor: '#191919',
            },
        }} />
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Deep Link Router Tester</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="exp:// or workouttracker://"
          placeholderTextColor="#666"
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.button} onPress={() => handleOpen(url)}>
          <Text style={styles.buttonText}>Open</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Quick deep links</Text>
      <View style={styles.quickLinks}>
        {QUICK_LINKS.map(({ label, url: u }) => (
          <TouchableOpacity
            key={label}
            style={styles.chip}
            onPress={() => {
              setUrl(u)
              handleOpen(u)
            }}
          >
            <Text style={styles.chipText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {log.length > 0 && (
        <>
          <View style={styles.logHeader}>
            <Text style={styles.sectionTitle}>Log</Text>
            <TouchableOpacity onPress={() => setLog([])}>
              <Text style={styles.clearText}>Clean</Text>
            </TouchableOpacity>
          </View>
          {log.map((entry, i) => (
            <View key={i} style={styles.logEntry}>
              <Text style={styles.logTime}>{entry.time}</Text>
              <Text style={styles.logUrl} numberOfLines={1}>{entry.url}</Text>
              <Text style={styles.logResult}>{entry.result}</Text>
            </View>
          ))}
        </>
      )}
    </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    paddingHorizontal: 20,
    paddingVertical: 40
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 28,
  },

  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  input: {
    flex: 1,
    backgroundColor: '#1c1c1e',
    color: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    fontFamily: 'monospace',
    borderWidth: 1,
    borderColor: '#2c2c2e',
  },
  button: {
    backgroundColor: '#FF5526',
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  sectionTitle: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  quickLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 28,
  },
  chip: {
    backgroundColor: '#1c1c1e',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#2c2c2e',
  },
  chipText: {
    color: '#fff',
    fontSize: 13,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clearText: {
    color: '#ff3b30',
    fontSize: 13,
  },
  logEntry: {
    backgroundColor: '#1c1c1e',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2c2c2e',
  },
  logTime: {
    color: '#555',
    fontSize: 11,
    marginBottom: 4,
  },
  logUrl: {
    color: '#888',
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  logResult: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'monospace',
  },
})