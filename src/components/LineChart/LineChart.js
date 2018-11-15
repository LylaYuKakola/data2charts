import React from 'react'
import echarts from 'echarts/lib/echarts'
import CSSModules from 'react-css-modules'
import styles from './LineChart.css'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/toolbox'
import chartCss from '../../files/chartCss.json'
import { lengendNotSelected } from './option'
import { deepCloneForChartOption } from '../../util'

class LineChart extends React.PureComponent {
  componentDidMount() {
    this.renderChart()
  }

  componentWillReceiveProps(changes) {
    this.setState({
      data: changes.data,
    })
  }

  componentDidUpdate() {
    this.renderChart()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
    this.myChart.dispose()
    this.myChart = null
  }
  handleResize = () => {
    this.myChart.resize()
  }
  renderChart() {
    const dom = this.chart
    const { theme, extraChartOption } = this.props
    if (theme) {
      echarts.registerTheme('data2charts', theme)
    } else {
      echarts.registerTheme('data2charts', chartCss)
    }
    let myChart = echarts.init(dom, 'data2charts') // eslint-disable-line
    const data = this.props.data
    const notSelected = {}
    lengendNotSelected.forEach(item => {
      notSelected[item] = false
    })

    const {
      title,
      legendData,
      baseAxisData,
      valueAxisData,
      sourceData,
      xOrY,
    } = data

    // 根据data构造坐标轴配置
    const baseAxis = {
      type: 'category',
      data: baseAxisData,
    }
    let valueAxis = {
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
    }
    if (valueAxisData && valueAxisData.length) {
      valueAxis = valueAxisData.map((item, index) => ({
        ...valueAxis,
        name: item,
        nameTextStyle: {
          color: index === 0 ? '#ff6700' : '#fcce10',
        },
      }))
      // option.series[1].yAxisIndex = 1
    }

    let xAxis
    let yAxis
    if (xOrY === 'x') {
      xAxis = baseAxis
      yAxis = valueAxis
    } else {
      yAxis = baseAxis
      xAxis = valueAxis
    }

    const option = {
      title: {
        text: title,
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
        data: legendData,
        selected: notSelected,
      },
      toolbox: {
        feature: {
          saveAsImage: {
            name: `chart${new Date().getTime()}`,
            backgroundColor: 'rgb(255,255,255)',
            iconStyle: {
              borderColor: 'rgb(36,154,210)',
              textPosition: 'left',
            },
            pixelRatio: 2,
          },
        },
        top: 'bottom',
      },
      xAxis,
      yAxis,
      series: sourceData.map(item => (
        {
          ...item,
          type: 'line',
        }
      )),
    }
    myChart.setOption(deepCloneForChartOption(option, extraChartOption), true)
    this.myChart = myChart
    window.addEventListener('resize', this.handleResize)
  }

  render() {
    return <div styleName="container" ref={el => { this.chart = el }} />
  }
}

export default CSSModules(LineChart, styles)

/**
 * 2018/10/9 Changed By yurt
 * 1. 去掉之前的xAxis和yAxis的配置，方便切换横纵坐标轴
 * 2. 增加baseAxis和xOry的配置
 */
