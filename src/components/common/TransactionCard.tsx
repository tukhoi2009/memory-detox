import { Text, View } from 'react-native'
import React from 'react'
import { formatCurrencyToVND } from '../../utils/utils'
import clsx from 'clsx'
import AppIconify, { AppIcons } from './AppIcontify'
type Props = {
  price?: number
}

const TransactionCard = ({ price = 30000 }: Props) => {
  return (
    <View className="flex-row items-center justify-between gap-2 p-2 bg-white rounded-2xl">
      <View className="flex-row items-center gap-3">
        <AppIconify
          icon={AppIcons.cart}
          size={24}
          color="#00CEE6"
          className="bg-transparent-error p-1.5 rounded-xl"
        />
        <Text className="text-base text-primary">Chi tiêu mua sắm</Text>
      </View>
      <Text
        className={clsx(
          'text-base font-semibold',
          price > 0 ? 'text-primary-main' : 'text-secondary-main',
        )}
      >
        {price > 0 ? '+' : '-'} {formatCurrencyToVND(price)}
      </Text>
    </View>
  )
}

export default TransactionCard
