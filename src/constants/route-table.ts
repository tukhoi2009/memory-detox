export enum ERouteTable {
  ROOT = '/',
  ONBOARD = '/onboard',
  SIGIN_IN = '/sign-in',
  SIGIN_UP = '/sign-up',
  VERIFY_EMAIL = '/verify',
  USER_INFO = '/user-information',
  FORGOT_PASSWORD = '/forgot-password',
  VERIFY_OTP_RESET = '/verify-otp-reset',
  RESET_PASSWORD = '/reset-password',
  HOME = '/home',
  STATS = '/stats',
  LEADERBOARD = '/leaderboard',
  USER = '/user',
  NOTIFICATIONS = '/notifications',
  ABOUT = '/about',
  SUPPORT = '/support',
  TERMS = '/terms',
}

/** Đường dẫn màn trong nhóm `(screens)` */
export function screensHref(
  route: ERouteTable | string,
  params?: Record<string, string | undefined>
): string {
  const path = route.startsWith('/') ? route : `/${route}`
  if (!params) return path
  const query = Object.entries(params)
    .filter(([, value]) => value != null && value !== '')
    .map(([key, value]) => `${key}=${encodeURIComponent(value!)}`)
    .join('&')
  return query ? `${path}?${query}` : path
}
