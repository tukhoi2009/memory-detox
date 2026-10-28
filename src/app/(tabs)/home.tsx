import React, { useCallback, useMemo, useRef } from 'react'
import {
  ActivityIndicator,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useQuery } from '@tanstack/react-query'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '@/context/auth-provider'
import { useProfile } from '@/hooks/useProfile'
import { useNotificationCount } from '@/hooks/useNotificationCount'
import { images } from '@/constants'
import { APP_BUTTON_GRADIENT } from '@/components/common/AppButton'
import { CyberSafetyGameService, type Category } from '@/services/cyberSafetyGame.service'
import { navigateToCategory } from '@/utils/categoryNavigation'
import { getAvatarSource } from '@/utils/avatar'
import { SUSTAINABLE_MEMORY_SLUG } from '@/constants/categories'
import IconStar from '~/assets/icons/home/star'
import { Play } from 'iconsax-react-native'

const SCREEN_BG = '#FFF7ED'
const HERO_MINT = '#D8F5A8'

const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 10,
  elevation: 4,
} as const


/** Cột trái lệch xuống ≈ chiều cao thẻ đầu cột phải + khoảng cách */
const CATEGORY_LEFT_COLUMN_OFFSET = 165
/** Màu nền thẻ danh mục theo Figma */
const CATEGORY_COLORS = {
  lime: '#D9F27E',
  pink: '#FBCFE8',
  blue: '#BAE6FD',
} as const

/**
 * 5 danh mục cố định — masonry 2 cột:
 * Phải: #1, #3, #5 | Trái (lệch xuống): #2, #4
 */
const CATEGORY_MASONRY_LAYOUT = [
  {
    column: 'right' as const,
    cardBg: CATEGORY_COLORS.lime,
    artKey: 'categoryPhone' as const,
    slug: 'scroll-habit',
  },
  {
    column: 'left' as const,
    cardBg: CATEGORY_COLORS.pink,
    artKey: 'categoryEye' as const,
    slug: 'fleeting-content',
  },
  {
    column: 'right' as const,
    cardBg: CATEGORY_COLORS.blue,
    artKey: 'categoryHandsBrain' as const,
    slug: 'reasoning-traps',
  },
  {
    column: 'left' as const,
    cardBg: CATEGORY_COLORS.lime,
    artKey: 'categoryHandFlower' as const,
    slug: 'focus-noise',
  },
  {
    column: 'right' as const,
    cardBg: CATEGORY_COLORS.pink,
    artKey: 'categoryBrainLeaves' as const,
    slug: 'sustainable-memory',
  },
] as const

type CategoryMasonryItem = {
  category: Category
  cardBg: string
  art: ImageSourcePropType
}

function buildCategoryMasonry(categories: Category[]): {
  left: CategoryMasonryItem[]
  right: CategoryMasonryItem[]
} {
  const left: CategoryMasonryItem[] = []
  const right: CategoryMasonryItem[] = []
  const bySlug = new Map(categories.map((c) => [c.slug, c]))

  CATEGORY_MASONRY_LAYOUT.forEach((slot) => {
    const category = bySlug.get(slot.slug)
    if (!category) return

    const item: CategoryMasonryItem = {
      category,
      cardBg: slot.cardBg,
      art: images.home[slot.artKey],
    }
    if (slot.column === 'left') left.push(item)
    else right.push(item)
  })

  return { left, right }
}

function levelFromPoints(points: number): number {
  return Math.max(1, Math.floor(points / 150) + 1)
}

type CategoryCardProps = {
  category: Category
  art: ImageSourcePropType
  cardBg: string
  onPress: (id: string) => void
  type: 'left' | 'right'
  index?: number
}

function CategoryCard({ category, art, cardBg, onPress, type, index }: CategoryCardProps) {
  return (
    <Pressable
      onPress={() => onPress(category.id)}
      className="rounded-[24px] mb-4 justify-between"
      style={{ backgroundColor: cardBg, padding: 16, height: type === 'left' ||( index !== 0 && index !== 2)  ? 264 : 208 }}
    >
      <Image source={art} contentFit="contain" style={{ width: (index === 0 || index === 2 ) ? 100 : '100%', height: (index === 0 || index === 2 ) ? 100 : 156 }} />
      <Text
        className="text-[#333333] font-bold mt-3"
        style={{ fontSize: 18, lineHeight: 22 }}
        numberOfLines={3}
      >
        {category.name}
      </Text>
    </Pressable>
  )
}

export default function Home() {
  const scrollRef = useRef<ScrollView>(null)
  const categoriesSectionY = useRef(0)

  const { user } = useAuth()
  const { profile } = useProfile()
  const { unreadCount } = useNotificationCount()

  const { data: categories = [], isPending } = useQuery({
    queryKey: ['categories'],
    queryFn: () => CyberSafetyGameService.getCategories(),
  })

  const totalPoints = profile?.total_points ?? 0
  const displayName =
    profile?.full_name?.trim() ||
    profile?.username ||
    user?.email?.split('@')[0] ||
    'bạn'

  const userLevel = levelFromPoints(totalPoints)
  const missionCountdown = '2 giờ 15 phút'

  const { left: leftCategories, right: rightCategories } = useMemo(
    () => buildCategoryMasonry(categories),
    [categories],
  )

  const avatarSource = useMemo(() => {
    return getAvatarSource(profile?.avatar_url, displayName)
  }, [profile?.avatar_url, displayName])

  const openCategory = useCallback(
    (categoryId: string) => {
      const category = categories.find((c) => c.id === categoryId)
      navigateToCategory(categoryId, category?.slug)
    },
    [categories],
  )

  const openCategoryBySlug = useCallback(
    (slug: string) => {
      const category = categories.find((c) => c.slug === slug)
      if (category) {
        openCategory(category.id)
      }
    },
    [categories, openCategory],
  )

  const featuredMissionCategory = useMemo(
    () => categories.find((c) => c.slug === SUSTAINABLE_MEMORY_SLUG),
    [categories],
  )

  const scrollToCategories = useCallback(() => {
    scrollRef.current?.scrollTo({ y: categoriesSectionY.current, animated: true })
  }, [])

  const openNotifications = useCallback(() => {
    router.push('/(screens)/notifications' as never)
  }, [])

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: SCREEN_BG }} edges={['top']}>
      <View className="flex-row items-center px-5 pt-2 pb-3">
        <Image
          source={avatarSource}
          style={{ width: 48, height: 48, borderRadius: 24 }}
          contentFit="cover"
        />
        <View className="flex-1 ml-3">
          <Text className="text-[#9CA3AF] text-sm">Xin chào! 👋</Text>
          <Text className="text-[#1F2937] text-lg font-bold mt-0.5" numberOfLines={1}>
            {displayName}
          </Text>
        </View>

        <TouchableOpacity
          onPress={openNotifications}
          activeOpacity={0.85}
          className="w-11 h-11 rounded-full bg-white items-center justify-center"
          style={CARD_SHADOW}
        >
          <Ionicons name="notifications-outline" size={22} color="#212B36" />
          {unreadCount > 0 && (
            <View className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#4CC9F0] border border-white" />
          )}
        </TouchableOpacity>

        <View
          className="flex-row items-center bg-white rounded-full px-3.5 py-2 ml-2.5"
          style={CARD_SHADOW}
        >
          <Text className="font-semibold text-[#1F2937] text-[15px]">
            {totalPoints.toLocaleString()}
          </Text>
          <View className="ml-1">
            <IconStar />
          </View>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120, paddingTop: 20 }}
      >
        <View className="rounded-[28px] overflow-hidden mb-2">
          <View className="flex-row px-5 pt-5">
            <View className="flex-1 pr-2 justify-center">
              <Text className="text-[#1F2937] text-[22px] font-bold leading-8">
                Tập trung sâu hơn{'\n'}Nhớ lâu hơn
              </Text>
            </View>
          </View>
        </View>
        <View className="p-3 bg-[#b3f00b29] h-[180px] items-end justify-end relative rounded-[32px] mt-4 mb-4">
          <Image
            source={images.home.heroIllustration}
            contentFit="contain"
            style={{ width: 196, height: 200, position: "absolute", bottom: 76, zIndex: 999 }}
          />

          <Pressable onPress={scrollToCategories} className="rounded-full" style={CARD_SHADOW}>
            <LinearGradient
              colors={[...APP_BUTTON_GRADIENT]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 12,
                borderRadius: 24,
                justifyContent: 'space-between',
                height: 64,
                width: '100%',
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <Text className="text-[#1F2937] font-bold ml-2 text-base">Bắt đầu ngay!</Text>
              <View className="w-14 h-14 rounded-[20px] bg-[#FFFFFF3D] items-center justify-center">
                <Play color="#212B36" size={24} variant="Bold"/>
              </View>
            </LinearGradient>
          </Pressable>
        </View>


        <Pressable
          onPress={() => openCategoryBySlug(SUSTAINABLE_MEMORY_SLUG)}
          className="bg-white rounded-[24px] p-4 mb-6 flex-row"
          style={CARD_SHADOW}
        >
          <View className="w-[88px] h-[88px] rounded-[20px] bg-[#FFF0F5] items-center justify-center">
            <Image
              source={images.home.missionBrain}
              contentFit="contain"
              style={{ width: 72, height: 72 }}
            />
          </View>
          <View className="flex-1 ml-3.5 justify-center">
            <View className="flex-row items-center flex-wrap gap-2 mb-1.5">
              <View className="bg-[#FFE4EF] rounded-full px-2.5 py-0.5">
                <Text className="text-[#EC4899] text-xs font-semibold">Nhiệm vụ</Text>
              </View>
              <Text className="text-[#3B82F6] text-xs font-semibold">Cấp {userLevel}</Text>
            </View>
            <Text className="text-[#1F2937] font-bold text-base">
              {featuredMissionCategory?.name ?? 'Ghi nhớ bền vững'}
            </Text>
            <Text className="text-[#9CA3AF] text-sm mt-0.5">
              {featuredMissionCategory?.slug === SUSTAINABLE_MEMORY_SLUG
                ? 'Củng cố trí nhớ dài hạn.'
                : 'Tiếp tục luyện tập hôm nay.'}
            </Text>
            <Text className="text-[#EF4444] text-xs font-semibold mt-2">
              Thời gian còn lại: {missionCountdown}
            </Text>
          </View>
        </Pressable>

        <View
          onLayout={(e) => {
            categoriesSectionY.current = e.nativeEvent.layout.y
          }}
        >
          <Text className="text-[#1F2937] font-bold text-lg mb-4">Danh mục</Text>

          <View className="relative min-h-[200px]">
          <Image
            source={images.home.bgSplat}
            contentFit="contain"
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: -4,
              top: 8,
              width: 217,
              height: 210,
              opacity: 0.9,
              zIndex: 0,
            }}
          />

          {isPending ? (
            <View className="py-16 items-center">
              <ActivityIndicator size="large" color="#9AE600" />
            </View>
          ) : leftCategories.length === 0 && rightCategories.length === 0 ? (
            <View className="bg-white rounded-3xl p-8 items-center" style={CARD_SHADOW}>
              <Text className="text-[#637381] font-semibold text-center">
                Chưa có đủ 5 danh mục. Chạy lại seed.sql trên Supabase để cập nhật dữ liệu mẫu.
              </Text>
            </View>
          ) : (
            <View className="flex-row z-10" style={{ gap: 12 }}>
              <View className="flex-1" style={{ marginTop: CATEGORY_LEFT_COLUMN_OFFSET }}>
                {leftCategories.map((item) => (
                  <CategoryCard
                    key={item.category.id}
                    type="left"
                    category={item.category}
                    art={item.art}
                    cardBg={item.cardBg}
                    onPress={openCategory}
                  />
                ))}
              </View>
              <View className="flex-1">
                {rightCategories.map((item, index) => (
                  <CategoryCard
                    key={item.category.id}
                    category={item.category}
                    art={item.art}
                    type="right"
                    index={index}
                    cardBg={item.cardBg}
                    onPress={openCategory}
                  />
                ))}
              </View>
            </View>
          )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
