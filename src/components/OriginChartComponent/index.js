import React from 'react'
import CSSModules from 'react-css-modules'
import 'antd/lib/icon/style/css'
import styles from './Chart.css'
import PieChart from '../PieChart/PieChart'
import BarChart from '../BarChart/BarChart'
import LineChart from '../LineChart/LineChart'
import SumChart from '../SumChart/SumChart'
import MapChart from '../MapChart/MapChart'

function isChartEmpty(data, type) {
  if (type === 'numeric' && data.value === '0') {
    return true
  } else if (type === 'bar' || type === 'pie') {
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

/**
 * 原始的chart的组件，主要实现react
 */
class ChartContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isFullScreen: props.isFullScreen,
      type: props.type || '',
      chartData: props.chartData || '',
    }
  }

  componentWillReceiveProps(changes) {
    this.setState({
      type: changes.type,
      chartData: changes.chartData,
    })
  }

  changeChartData = chartData => {
    this.setState({ chartData })
  }

  render() {
    const { componentStyle, children, theme, extraChartOption, title } = this.props
    const { type, chartData, isFullScreen } = this.state
    let chart = null
    let hasData = true
    const nullTextStyle = {
      textAlign: 'center',
      padding: 16,
      fontSize: 22,
      color: '#999',
    }
    if (isChartEmpty(chartData, type)) {
      hasData = false
      chart = <div style={nullTextStyle}>暂无数据</div>
    } else {
      switch (type) {
        case 'line':
          chart = <LineChart data={chartData} theme={theme} extraChartOption={extraChartOption} />
          break
        case 'bar':
        case 'stackedBar':
          chart = <BarChart data={chartData} theme={theme} extraChartOption={extraChartOption} />
          break
        case 'pie':
          chart = <PieChart data={chartData} theme={theme} extraChartOption={extraChartOption} />
          break
        case 'numeric':
          chart = <SumChart data={chartData} theme={theme} extraChartOption={extraChartOption} />
          break
        case 'heatMap':
          chart = <MapChart data={chartData} theme={theme} extraChartOption={extraChartOption} />
          break
        default:
          chart = <div style={nullTextStyle}>暂无 {type} 类型的图表</div>
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
        styleName={!isFullScreen ? 'chart-wrapper' : 'chart-wrapper-fullscreen'}
        className="border-top-1px"
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

export default CSSModules(ChartContainer, styles)
