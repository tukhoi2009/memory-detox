import bgSplash from '@/assets/images/bg-splash.jpg'
import bgResult from '@/assets/images/bg-game.png'
import bgAuth from '@/assets/images/bg-auth.jpg'
import bgMain from '@/assets/images/bg-main.png'
import bgOnBoarding from '@/assets/images/bg-onboarding.jpg'
import bgSuccess from '@/assets/images/bg-success.png'
import heroBanner from '@/assets/images/hero-banner.png'
import logoHeader from '@/assets/logos/logo_header.png'
import readyIcon from '@/assets/images/ready-icon.png'
import missionIcon from '@/assets/images/mission-icon.png'
import lockIcon from '@/assets/images/lock-icon.png'
import requestIcon from '@/assets/images/request-icon.png'
import trophyIcon from '@/assets/images/trophy-icon.png'

import bgWallet from '@/assets/images/bg-wallet.png'

import logoApp from '@/assets/logos/logo_app.png'
import logoApp2 from '@/assets/logos/logo_app2.png'
import bot from '@/assets/images/bot.png'
import location from '@/assets/images/location.png'

import ob1 from '@/assets/images/onboarding/img.png'
import ob2 from '@/assets/images/onboarding/img_1.png'
import ob3 from '@/assets/images/onboarding/img_2.png'

/**
 * MEMORY DETOX — onboarding hero.
 * Thay import bên dưới khi đã thêm file:
 * `assets/images/onboarding/onboarding-hero.png`
 */
import onboardingHero from '@/assets/images/onboarding/img_3.png'

import noDayWork from '@/assets/images/no-day-work.png'
import ride from '@/assets/images/ride.jpg'

import hint from '@/assets/images/hint.png'

import avatarPlaceholder from '@/assets/images/avatar/img.png'

/** Đường dẫn asset onboarding (để tham chiếu / thay file sau) */
export const ONBOARDING_IMAGE_PATHS = {
  hero: 'assets/images/onboarding/onboarding-hero.png',
} as const

/** Import tạm — đổi sang file trong `assets/images/home/` khi có asset thật */
import homeHeroIllustration from '@/assets/images/home/img_4.png'
import homeCategoryEye from '@/assets/images/home/category-eye.png'
import homeCategoryPhone from '@/assets/images/home/img_1.png'
import homeCategoryHandsBrain from '@/assets/images/home/img_2.png'
import homeCategoryHandFlower from '@/assets/images/home/img.png'
import homeCategoryBrain from '@/assets/images/home/img_3.png'
import homeBgSplat from '@/assets/images/bot.png'
import homeHeroCtaIcon from '@/assets/images/location.png'

export const homeImages = {
  userAvatarPlaceholder: avatarPlaceholder,
  heroIllustration: homeHeroIllustration,
  missionBrain: homeCategoryBrain,
  categoryEye: homeCategoryEye,
  categoryPhone: homeCategoryPhone,
  categoryHandsBrain: homeCategoryHandsBrain,
  categoryHandFlower: homeCategoryHandFlower,
  categoryBrainLeaves: homeCategoryBrain,
  bgSplat: homeBgSplat,
  heroCtaIcon: homeHeroCtaIcon,
  /** Thứ tự minh họa danh mục (xoay vòng theo index) */
  categoryArtCycle: [
    homeCategoryEye,
    homeCategoryPhone,
    homeCategoryHandsBrain,
    homeCategoryHandFlower,
    homeCategoryBrain
  ] as const,
}

const images = {
  bgSplash,
  bgAuth,
  bgWallet,
  bgMain,
  bgOnBoarding,
  bgSuccess,
  logoApp,
  logoApp2,
  logoHeader,
  bot,
  heroBanner,
  ob1,
  ob2,
  ob3,
  onboardingHero,
  hint,
  bgResult,
  location,
  noDayWork,
  ride,
  home: homeImages,
  readyIcon,
  missionIcon,
  lockIcon,
  requestIcon,
  trophyIcon
}

export default images
