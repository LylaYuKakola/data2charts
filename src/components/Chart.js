import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './Chart.css'
import PieChart from './PieChart/PieChart'
import BarChart from './BarChart/BarChart'
import LineChart from './LineChart/LineChart'
import SumChart from './SumChart/SumChart'
import TreeChart from './TreeChart/TreeChart'
import MapChart from './MapChart/MapChart'
import FunnelChart from './FunnelChart/FunnelChart'
import StoreDetail from './StoreDetail/StoreDetail'
import StoreTarget from './StoreTarget/StoreTarget'
import BmapChart from './BmapChart/BmapChart'

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

class ChartContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      search: '',
      isFullScreen: false,
      type: props.type || '',
      chartData: props.chartData || '',
    }
  }

  toggleFullScreen = () => {
    this.setState({
      isFullScreen: true,
    }, () => {
      if (this.toolbar) this.toolbar.setAttribute('style', `position:fixed; z-Index:1000`)
      document.body.setAttribute('style', 'overflow: hidden')
    })
  }

  exitFullScreen = () => {
    this.setState({
      isFullScreen: false,
    }, () => {
      if (this.toolbar) this.toolbar.removeAttribute('style')
      document.body.removeAttribute('style')
    })
  }

  changeChartData = chartData => {
    this.setState({ chartData })
  }

  render() {
    const { style: componentStyle, children } = this.props
    const { type, chartData } = this.state
    let chart = null
    let hasData = true
    if (isChartEmpty(chartData, type)) {
      hasData = false
      const style = {
        textAlign: 'center',
        padding: 16,
        fontSize: 22,
        color: '#999',
      }
      chart = <div style={style}>暂无数据</div>
    } else {
      switch (type) {
        case 'line':
          chart = <LineChart data={chartData} />
          break
        case 'bar':
        case 'stackedBar':
          chart = <BarChart data={chartData} />
          break
        case 'pie':
          chart = <PieChart data={chartData} />
          break
        case 'numeric':
          chart = <SumChart data={chartData} />
          break
        case 'Tree':
          chart = <TreeChart data={chartData} />
          break
        case 'heatMap':
          chart = <MapChart data={chartData} />
          break
        case 'funnelTest':
          chart = <FunnelChart />
          break
        case 'board':
          chart = <StoreDetail data={chartData} />
          break
        case 'multiNumeric':
          chart = <StoreTarget data={chartData} />
          break
        case 'bmapScatter':
          chart = <BmapChart data={chartData} />
          break
        default:
          break
      }
    }
    let iconQpStyle = 'iconfont icon-quanping'
    if (this.props.position && this.props.position === 'recommend') {
      iconQpStyle = 'iconfont icon-quanping recommend-quanping'
    }
    let containerStyle = {
      height: 300,
      padding: 20,
      ...componentStyle,
    }
    if (type === 'numeric' || type === 'board' || type === 'multiNumeric' || type === 'bmapScatter' || !hasData) {
      containerStyle = null
    }
    return (
      <div styleName="chart-wrapper" className="border-top-1px" style={containerStyle} ref={el => { this.wrapper = el }}>
        {
          type === 'numeric' || type === 'board' || type === 'multiNumeric'
            ? null
            : <i className={iconQpStyle} onClick={this.toggleFullScreen} />
        }
        {chart}
        {
          this.state.isFullScreen ?
            <div styleName="chart-fullscreen">
              <i className="iconfont icon-guanbi1" onClick={this.exitFullScreen} />
              <div styleName="chart-fullscreen-container">
                {chart}
                <div styleName="chart-fullscreen-text">横屏浏览效果更佳</div>
              </div>
            </div>
            :
            null
        }
        {
          children && (
            <div styleName="chart-toolbar" ref={t => this.toolbar = t}>{children}</div>
          )
        }
      </div>
    )
  }
}

export default CSSModules(ChartContainer, styles)
