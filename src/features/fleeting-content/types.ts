export type SalesChartData = {
  title: string
  months: string[]
  values: number[]
  maxValue: number
  notes: string[]
}

export type FleetingLevelContent = {
  levelNumber: number
  title: string
  chart: SalesChartData
  maxXp: number
}
