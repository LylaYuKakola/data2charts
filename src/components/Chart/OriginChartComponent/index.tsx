import * as React from 'react'
import './index.scss'
import PieChart from '../../PieChart'
import BarChart from '../../BarChart'
import LineChart from '../../LineChart'
import MapChart from '../../MapChart'

interface OriginChartComponentProps {
  type: string,
  chartData: any,
  extraChartOption?: any,
  isFullScreen?: boolean,
  componentStyle?: any,
  theme?: any,
  title?: string,
}

export default class OriginChartComponent extends React.Component<OriginChartComponentProps, {}> {

  static isChartEmpty(data:any, type:string) {
    if (type === 'numeric' && data.value === '0') {
      return true
    }

    if (type === 'bar' || type === 'pie') {
      if (data.sourceData && data.sourceData.length === 0) {
        return true
      }
    } else if (type === 'line') {
      if ((data.sourceData && data.sourceData.length === 0) ||
        (data.sourceData && data.sourceData[0].data && data.sourceData[0].data.length === 0)) {
        return true
      }
    }
    return false
  }

  constructor(props:OriginChartComponentProps) {
    super(props)
  }

  wrapper: any

  state = {
    isFullScreen: this.props.isFullScreen,
    type: this.props.type || '',
    chartData: this.props.chartData || '',
    extraChartOption: this.props.extraChartOption,
  }

  componentWillReceiveProps(changes:OriginChartComponentProps) {
    this.setState({
      type: changes.type,
      chartData: changes.chartData,
      extraChartOption: changes.extraChartOption,
    })
  }

  changeChartData = (chartData:any) => {
    this.setState({ chartData })
  }

  render() {
    const { componentStyle, theme, title } = this.props
    const { type, chartData, isFullScreen, extraChartOption } = this.state
    let chart = null
    let hasData = true
    if (OriginChartComponent.isChartEmpty(chartData, type) && !extraChartOption) {
      hasData = false
      chart = (<div className="null-text">暂无数据</div>)
    } else {
      switch (type) {
        case 'line':
          chart = <LineChart data={chartData} theme={theme} extraChartOption={extraChartOption} />
          break
        case 'bar':
          chart = <BarChart data={chartData} theme={theme} extraChartOption={extraChartOption} />
          break
        case 'pie':
          chart = <PieChart data={chartData} theme={theme} extraChartOption={extraChartOption} />
          break
        case 'heatMap':
          chart = <MapChart data={chartData} theme={theme} extraChartOption={extraChartOption} />
          break
        default:
          chart = <div className="null-text">暂无 {type} 类型的图表</div>
      }
    }
    let containerStyle = {
      height: 350,
      padding: '0 20px 20px 20px',
      ...componentStyle,
    }
    if (type === 'numeric' || !hasData) {
      containerStyle = null
    }
    return (
      <div
        className={!isFullScreen ? 'chart-wrapper' : 'chart-wrapper-fullscreen'}
        ref={el => { this.wrapper = el }}
      >
        {title}
        <div
          style={!isFullScreen ? containerStyle : { flex: 1 }}
        >
          {chart}
        </div>
      </div>
    )
  }
}
