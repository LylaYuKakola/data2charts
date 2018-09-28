import React from 'react'
import echarts from 'echarts'
import CSSModules from 'react-css-modules'
import styles from './LineChart.css'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import chartCss from '../../files/chartCss.json'
import { lengendNotSelected } from './option'

class LineChart extends React.PureComponent {
  componentDidMount() {
    const dom = this.chart
    echarts.registerTheme('chongming', chartCss)
    let myChart = echarts.init(dom, 'chongming') // eslint-disable-line
    const data = this.props.data
    const notSelected = {}
    lengendNotSelected.forEach(item => {
      notSelected[item] = false
    })
    const option = {
      title: {
        text: data.title,
        padding: [4, 0],
        textStyle: {
          fontWeight: 'normal',
          fontSize: 15,
        },
      },
      tooltip: {
        trigger: 'axis',
        confine: true,
      },
      legend: {
        type: 'scroll',
        top: '12',
        animation: true,
        pageIconSize: [20, 20],
        data: data.legendData,
        selected: notSelected,
      },
      xAxis: {
        data: data.xAxisData,
      },
      yAxis: {
        type: 'value',
        nameTextStyle: {
          width: 20,
        },
        axisTick: {
          length: 2,
        },
        axisLabel: {
          margin: 1,
          fontSize: 10,
          formatter: value => {
            let vl = ''
            if (value >= 1000000000) {
              vl = `${value / 1000000000}B`
            } else if (value >= 1000000) {
              vl = `${value / 1000000}M`
            } else if (value >= 1000) {
              vl = `${value / 1000}K`
            } else {
              vl = `${value}`
            }
            return vl
          },
        },
      },
      series: data.sourceData.map(item => (
        {
          ...item,
          type: 'line',
        }
      )),
    }
    if (data.yAxisData && data.yAxisData.length > 0) { // 双轴折线图
      option.yAxis = data.yAxisData.map((item, index) => ({
        ...option.yAxis,
        name: item,
        nameTextStyle: {
          color: index === 0 ? '#ff6700' : '#fcce10',
        },
      }))
      // option.series[1].yAxisIndex = 1
    }
    myChart.setOption(option, true)
    this.myChart = myChart
    window.addEventListener('resize', this.handleResize)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
    this.myChart.dispose()
    this.myChart = null
  }
  handleResize = () => {
    this.myChart.resize()
  }
  render() {
    return <div styleName="container" ref={el => { this.chart = el }} />
  }
}

export default CSSModules(LineChart, styles)
