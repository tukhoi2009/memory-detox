import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import clsx from 'clsx'
import { Category2, Chart2, Coin, MoneyTick, ReceiptEdit } from 'iconsax-react-native'
import { ERouteTable } from '@/constants/route-table'
import { useRouter } from 'expo-router'

type ButtonActionProps = {
  icon: React.ReactNode
  label: string
  bgColor: string
  route: any
}

const ButtonAction = ({ icon, label, bgColor, route }: ButtonActionProps) => {
  const router = useRouter()
  const _onNavigate = () => {
    router.push(route)
  }
  return (
    <TouchableOpacity onPress={_onNavigate}>
      <View className="items-center justify-center">
        <View className={clsx('p-3 rounded-2xl items-center justify-center mb-3', bgColor)}>
          {icon}
        </View>
        <Text
          className="text-xs font-medium text-primary text-center"
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

type Props = {}

const ListButtonAction = (props: Props) => {
  return (
    <View className="flex-row justify-between gap-4 my-5">
      <ButtonAction
        route={ERouteTable.HOME}
        label="Giao dịch"
        icon={<ReceiptEdit size={24} color="#EC38BC" variant="Bold" />}
        bgColor="bg-transparent-secondary"
      />
      <ButtonAction
        route={ERouteTable.HOME}
        label="Biến động"
        icon={<Chart2 size={24} color="#21C45D" variant="Bold" />}
        bgColor="bg-transparent-success"
      />
      <ButtonAction
        route={ERouteTable.HOME}
        label="Ngân sách"
        icon={<Coin size={24} color="#5070FF" variant="Bold" />}
        bgColor="bg-transparent-quaternary"
      />
      <ButtonAction
        route={ERouteTable.HOME}
        label="Tiết kiệm"
        icon={<MoneyTick size={24} color="#FF9800" variant="Bold" />}
        bgColor="bg-transparent-warning"
      />
      <ButtonAction
        route={ERouteTable.HOME}
        label="Tiện ích"
        icon={<Category2 size={24} color="#9075FF" variant="Bold" />}
        bgColor="bg-transparent-primary"
      />
    </View>
  )
}

export default ListButtonAction
