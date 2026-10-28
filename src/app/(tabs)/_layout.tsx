import React from 'react'
import { Tabs } from 'expo-router'
import { View } from 'react-native'
import { Profile, Home, PresentionChart, Rank } from 'iconsax-react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { APP_BUTTON_GRADIENT } from '@/components/common/AppButton'

const icons = {
  home: Home,
  stats: PresentionChart,
  leaderboard: Rank,
  user: Profile,
}

type TabIconProps = {
  Icon: React.ElementType
  focused: boolean
}

const TabIcon = ({ Icon, focused }: TabIconProps) => {
  return (
    <>
      {focused ? <LinearGradient
          colors={[...APP_BUTTON_GRADIENT]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        style={{
          paddingHorizontal: 12,
          paddingVertical: 12,
          borderRadius: 100,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 4,
          height: 56,
          marginTop: 30,
          width: 56,
        }}
      >
        <Icon
          size={24}
          color="#212B36"
          variant='Bold'
        />
      </LinearGradient>
        :
        <View
          style={{
            paddingHorizontal: 12,
            paddingVertical: 12,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 30,
            width: 56,
            height: 56,
            backgroundColor: '#FFFFFF',
            borderRadius: 100,
          }}
        >
          <Icon
            size={24}
            color="#212B36"
            variant='Outline'
          />
        </View>
      }
    </>
  )
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }: { route: { name: string } }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 20,
          right: 20,
          height: 100,
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          paddingTop: 10,
          paddingHorizontal: 40,
        },
        tabBarItemStyle: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarIcon: ({ focused }: { focused: boolean }) => {
          const Icon = icons[route.name as keyof typeof icons]
          return <TabIcon Icon={Icon} focused={focused} />
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: 'Trang chủ' }} />
      <Tabs.Screen name="stats" options={{ title: 'Thống kê' }} />
      <Tabs.Screen name="leaderboard" options={{ title: 'Xếp hạng' }} />
      <Tabs.Screen name="user" options={{ title: 'Cá nhân' }} />
    </Tabs>
  )
}
