import { useCallback, useEffect, useRef, useState } from 'react'

type Options = {
  totalSec: number
  /** Gọi một lần khi hết giờ (tự chuyển locked / cooldown) */
  onTimerComplete: () => void | Promise<void>
  /** ms đã đọc — khôi phục từ session */
  initialElapsedMs?: number
  /** Bật lại từ đầu (ví dụ xem lại) */
  reset?: boolean
  /** false = chờ load session trước khi chạy timer */
  enabled?: boolean
}

/**
 * Đếm ngược đọc/ghi nhớ: hết giờ → onTimerComplete (thường là replace sang locked/cooldown).
 */
export function useReadingCountdown({
  totalSec,
  onTimerComplete,
  initialElapsedMs = 0,
  reset = false,
  enabled = true,
}: Options) {
  const [remainingSec, setRemainingSec] = useState(totalSec)
  const [hydrated, setHydrated] = useState(false)
  const elapsedRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const completedRef = useRef(false)
  const onCompleteRef = useRef(onTimerComplete)
  onCompleteRef.current = onTimerComplete

  useEffect(() => {
    if (!enabled) return

    completedRef.current = false
    if (reset) {
      setRemainingSec(totalSec)
      elapsedRef.current = 0
      setHydrated(true)
      return
    }

    const spentSec = Math.floor((initialElapsedMs ?? 0) / 1000)
    const left = Math.max(0, totalSec - spentSec)
    setRemainingSec(left)
    elapsedRef.current = initialElapsedMs ?? 0
    setHydrated(true)
  }, [totalSec, initialElapsedMs, reset, enabled])

  useEffect(() => {
    if (!enabled || !hydrated) return

    timerRef.current = setInterval(() => {
      setRemainingSec((prev) => {
        if (prev <= 0) {
          if (timerRef.current) clearInterval(timerRef.current)
          return 0
        }
        const next = prev - 1
        elapsedRef.current = (totalSec - next) * 1000
        return next
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [enabled, hydrated, totalSec])

  const triggerComplete = useCallback(() => {
    if (completedRef.current) return
    completedRef.current = true
    if (timerRef.current) clearInterval(timerRef.current)
    void onCompleteRef.current()
  }, [])

  useEffect(() => {
    if (!enabled || !hydrated || remainingSec > 0) return
    triggerComplete()
  }, [enabled, hydrated, remainingSec, triggerComplete])

  return { remainingSec, elapsedRef, hydrated, triggerComplete }
}
