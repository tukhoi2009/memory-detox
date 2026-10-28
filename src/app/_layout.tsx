// @@iconify-code-gen
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useRef } from 'react'
import { Text, TextInput } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import '~/global.css' // Tailwind / NativeWind globals
import { QueryProvider } from '@/context/QueryProvider'
import { AuthProvider } from '@/context/auth-provider'
import { DateProvider } from '@/context/date-context'
import { NotificationProvider } from '@/context/notification-provider'
import { ToastManager } from '@/components/common/ToastManager'

SplashScreen.preventAutoHideAsync()



/** Gán Inter Regular làm font mặc định cho Text/TextInput */
function registerDefaultTextFamily() {
  const baseStyle = { fontFamily: 'Inter_400Regular' }

  // @ts-ignore
  if (Text.defaultProps) {
    // @ts-ignore
    Text.defaultProps.style = baseStyle
  } else {
    // @ts-ignore
    Text.defaultProps = { style: baseStyle }
  }

  // @ts-ignore
  if (TextInput.defaultProps) {
    // @ts-ignore
    TextInput.defaultProps.style = baseStyle
  } else {
    // @ts-ignore
    TextInput.defaultProps = { style: baseStyle }
  }
}

export default function RootLayout() {
  const didRegisterDefaults = useRef(false)
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  })

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, fontError])

  if (fontsLoaded && !didRegisterDefaults.current) {
    registerDefaultTextFamily()
    didRegisterDefaults.current = true
  }

  if (!fontsLoaded && !fontError) {
    return null
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <QueryProvider>
            <DateProvider>
              <NotificationProvider>
                <>
                  <Stack screenOptions={{ headerShown: false }} />
                  <ToastManager />
                </>
              </NotificationProvider>
            </DateProvider>
          </QueryProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
