interface ChartData {
  title: string,
  legendData: any[],
  baseAxisData: any[],
  xOrY: string,
  valueAxisData?: any[], // 直角坐标系专用
  sourceData?: any[],
  originDataTree?: any, // map专用
  canDrillDown?: boolean, // map专用
  area: string, // map专用
  subTitle?: string,
  tooltip?: {
    formatter: string,
  },
  grid?: {},
}

export interface CommonChartProps {
  data: ChartData,
  extraChartOption?: {},
  theme?: {}
}
