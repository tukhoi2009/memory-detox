import React, { useEffect, useState } from 'react'
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native'

type Bank = {
  bin: string
  name: string
  shortName: string
  logo: string
  code: string
}

type Props = {
  onSelect: (bank: Bank) => void
}

const BankAutocompleteInput = ({ onSelect }: Props) => {
  const [banks, setBanks] = useState<Bank[]>([])
  const [filtered, setFiltered] = useState<Bank[]>([])
  const [search, setSearch] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  const getBanks = async () => {
    const res = await fetch('https://api.vietqr.io/v2/banks')
    const data = await res.json()
    return data.data // Danh sách ngân hàng nằm trong data.data
  }

  useEffect(() => {
    getBanks().then(setBanks)
  }, [])

  useEffect(() => {
    if (search.trim().length === 0) {
      setFiltered([])
      setShowDropdown(false)
    } else {
      const keyword = search.toLowerCase()
      const result = banks.filter(
        (bank) =>
          bank.name.toLowerCase().includes(keyword) ||
          bank.shortName.toLowerCase().includes(keyword) ||
          bank.code.toLowerCase().includes(keyword),
      )
      setFiltered(result)
      setShowDropdown(true)
    }
  }, [search])

  const handleSelect = (bank: Bank) => {
    setSearch(bank.name)

    // Delay một chút để tránh race condition khi update state
    setTimeout(() => {
      setShowDropdown(false)
    }, 10)

    onSelect(bank)
  }

  return (
    <View className="relative">
      <TextInput
        placeholder="Nhập tên ngân hàng..."
        value={search}
        onChangeText={setSearch}
        className="border-b border-gray-300 rounded-xl p-3 bg-white"
      />

      {showDropdown && (
        <View className="absolute top-14 left-0 right-0 bg-white rounded-xl border max-h-60 z-50">
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.code}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelect(item)}
                className="px-4 py-2 border-b border-gray-100"
              >
                <Text className="text-base">{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  )
}

export default BankAutocompleteInput
