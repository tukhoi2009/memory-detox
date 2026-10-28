import { Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Eye, EyeSlash } from 'iconsax-react-native'
import { formatCurrencyToVND } from '@/utils/utils'

export enum ESizeBalance {
  M,
  S,
}

type Props = {
  size?: ESizeBalance
  balance: number
}

const BalanceMoney = ({ size = ESizeBalance.M, balance }: Props) => {
  const [showBalance, setShowBalance] = useState(true)

  return (
    <View className="flex-row items-center gap-3">
      <Text
        className={`font-semibold text-pretty  ${
          size == ESizeBalance.M ? 'text-3xl min-w-48' : 'text-2xl min-w-36'
        }`}
      >
        {showBalance ? formatCurrencyToVND(balance) : '••••••••••'}
      </Text>
      <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
        {showBalance ? (
          <Eye size={size == ESizeBalance.M ? 20 : 16} color="#000" variant="Bold" />
        ) : (
          <EyeSlash size={size == ESizeBalance.M ? 20 : 16} color="#000" variant="Bold" />
        )}
      </TouchableOpacity>
    </View>
  )
}

export default BalanceMoney
