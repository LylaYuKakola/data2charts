import * as React from 'react'
import * as echarts from 'echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/toolbox'
import * as chartCss from '../../files/chartCss.json'
import { deepCloneForChartOption } from '../../util'

import { CommonChartProps } from '../common-chart-type'

class Index extends React.PureComponent<CommonChartProps, {}> {

  chartInstance: any
  chartContainer: any
  state = {
    data: this.props.data,
    extraChartOption: this.props.extraChartOption,
  }

  constructor(props: CommonChartProps) {
    super(props)
  }

  componentDidMount() {
    this.renderChart()
  }

  componentWillReceiveProps(changes:CommonChartProps) {
    this.setState({
      data: changes.data,
      extraChartOption: changes.extraChartOption,
    })
  }

  componentDidUpdate() {
    this.renderChart()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
    this.chartInstance.dispose()
    this.chartInstance = null
  }
  handleResize = () => {
    this.chartInstance.resize()
  }
  renderChart() {
    const dom = this.chartContainer
    const { extraChartOption, data } = this.state
    const { theme } = this.props
    if (theme) {
      echarts.registerTheme('data2charts', theme)
    } else {
      echarts.registerTheme('data2charts', chartCss)
    }
    let chartInstance = echarts.init(dom, 'data2charts') // eslint-disable-line
    const notSelected = {}

    const {
      title,
      legendData,
      baseAxisData,
      valueAxisData,
      sourceData,
      xOrY,
    } = data

    // 根据data构造坐标轴配置
    const baseAxis:any = {
      type: 'category',
      data: baseAxisData,
    }
    let valueAxis:any = {
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
        formatter: (value:number) => {
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
    chartInstance.setOption(deepCloneForChartOption(option, extraChartOption), true)
    this.chartInstance = chartInstance
    window.addEventListener('resize', this.handleResize)
  }

  render() {
    return <div className="container" ref={el => { this.chartContainer = el }} />
  }
}

export default Index

/**
 * 2018/10/9 Changed By yurt
 * 1. 去掉之前的xAxis和yAxis的配置，方便切换横纵坐标轴
 * 2. 增加baseAxis和xOry的配置
 */
