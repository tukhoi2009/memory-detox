import React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { MenuItem } from '../types/user-profile.types'

interface SettingsMenuItemProps {
    item: MenuItem
}

const SettingsMenuItem: React.FC<SettingsMenuItemProps> = ({ item }) => {
    return (
        <TouchableOpacity
            onPress={item.onPress}
            className="flex-row items-center py-4"
        >
            {/* Icon */}
            <Ionicons
                name={item.icon as any}
                size={22}
                color={item.color || '#374151'}
            />

            {/* Label */}
            <Text
                className="flex-1 ml-3 text-base"
                style={{ color: item.color || '#374151' }}
            >
                {item.label}
            </Text>

            {/* Chevron */}
            {item.route && (
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            )}
        </TouchableOpacity>
    )
}

export default SettingsMenuItem
