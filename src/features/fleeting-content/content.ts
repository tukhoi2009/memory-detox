import type { FleetingLevelContent, SalesChartData } from './types'

export const DEFAULT_SALES_CHART: SalesChartData = {
  title: 'Doanh số bán hàng 6 tháng đầu năm',
  months: ['Thg 1', 'Thg 2', 'Thg 3', 'Thg 4', 'Thg 5', 'Thg 6'],
  values: [100, 120, 160, 140, 180, 170],
  maxValue: 200,
  notes: [
    'Tháng 5 đạt doanh số cao nhất',
    'Tháng 1 thấp nhất',
    'Tổng quan doanh số 6 tháng: 870 triệu',
  ],
}

export const FLEETING_FALLBACK_LEVELS: FleetingLevelContent[] = Array.from(
  { length: 8 },
  (_, i) => ({
    levelNumber: i + 1,
    title: `Cấp độ ${i + 1}`,
    chart: DEFAULT_SALES_CHART,
    maxXp: 100,
  }),
)

export function fleetingLevelFromLesson(
  sortOrder: number,
  title: string,
  pointsReward: number,
): FleetingLevelContent {
  const levelNumber = sortOrder || 1
  return {
    levelNumber,
    title: title || `Cấp độ ${levelNumber}`,
    chart: DEFAULT_SALES_CHART,
    maxXp: pointsReward > 0 ? pointsReward * 4 : 100,
  }
}
