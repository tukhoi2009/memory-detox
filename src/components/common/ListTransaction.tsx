import { Text, View } from 'react-native'
import React from 'react'
import TransactionCard from './TransactionCard'

type Props = {}

const ListTransaction = (props: Props) => {
  return (
    <View>
      <Text className="text-lg font-semibold text-primary">Giao dịch gần đây</Text>
      <View className="mt-4 gap-2">
        <Text className="text-sm font-normal text-secondary">12/06/2025</Text>
        <View className="gap-1">
          <TransactionCard />
        </View>
      </View>
    </View>
  )
}

export default ListTransaction
