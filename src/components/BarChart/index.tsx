import * as React from 'react'
import * as echarts from 'echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/grid'
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

  componentWillReceiveProps(changes: CommonChartProps) {
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
    const dom:any = this.chartContainer
    const { theme } = this.props
    const { extraChartOption, data } = this.state
    if (theme) {
      echarts.registerTheme('data2charts', theme)
    } else {
      echarts.registerTheme('data2charts', chartCss)
    }
    let chartInstance = echarts.init(dom, 'data2charts') // eslint-disable-line

    const {
      title,
      legendData,
      baseAxisData,
      sourceData,
      subTitle,
      xOrY,
      tooltip,
      grid,
    } = data

    const baseAxis = {
      type: 'category',
      data: baseAxisData,
      axisLabel: {
        margin: 4,
        textStyle: {
          color(value: string) {
            return value === '总量' ? '#ff6700' : '#9B9B9B'
          },
        },
      },
    }
    const valueAxis = {
      type: 'value',
      axisLabel: {
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

    let xAxis; let
      yAxis
    if (xOrY === 'x') {
      xAxis = baseAxis
      yAxis = valueAxis
    } else {
      yAxis = baseAxis
      xAxis = valueAxis
    }

    const option:any = {
      grid,
      xAxis,
      yAxis,
      title: {
        text: title,
        subtext: subTitle || '',
        padding: [4, 0],
        textStyle: {
          fontWeight: 'normal',
          fontSize: 15,
          lineHeight: 20,
          rich: {
            hl: {
              color: '#1890ff',
              fontSize: 15,
            },
            lt: {
              color: '#9d9d9d',
              fontSize: 13,
            },
          },
        },
        subtextStyle: {
          width: dom.offsetWidth,
          lineHeight: 20,
          verticalAlign: 'center',
          rich: {
            cn: {
              align: 'center',
              color: '#ff6700',
            },
          },
        },
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
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: tooltip && tooltip.formatter === 'multi'
          ? (thisData:any[]) => sourceData[thisData[0].dataIndex][3]
          : (params:any[]) => {
            let sum = 0
            params.forEach(param => {
              sum += (Number(param.value) || 0)
            })
            return params.map(param => {
              const msgArr = []
              msgArr.push(param.name)
              if (param.seriesName[1] !== '-') msgArr.push(param.seriesName)
              msgArr.push(param.value)
              if (params.length > 1) {
                const percent = `${String(((Number(param.value) || 0) * 100) / sum).substr(0, 5)}%`
                msgArr.push(percent)
              }
              const msg = msgArr.join(' | ')
              return `${param.marker} ${msg}`
            }).join('<br/>')
          },
      },
      series: Array(),
    }
    if (legendData && legendData.length > 0) {
      option.legend = {
        type: 'scroll',
        top: '20',
        animation: true,
        pageIconSize: [20, 20],
        data: legendData,
      }
      option.series = sourceData.map(item => (
        {
          ...item,
          type: 'bar',
          barMaxWidth: 50,
        }
      ))
    } else { // 兼容旧的格式
      option.series = sourceData[0] instanceof Array
        ? [{
          type: 'bar',
          barMaxWidth: 40,
          data: sourceData.map(item => item[0]),
          itemStyle: {
            normal: {
              color(param:any) {
                return param.data < 0 ? '#2288DD' : '#ff6700'
              },
            },
          },
          label: {
            normal: {
              show: true,
              position: 'right',
              formatter: (thisData:any) => sourceData[thisData.dataIndex][2],
            },
          },
        }]
        : option.series = [{
          type: 'bar',
          itemStyle: {
            normal: {
              color(param:any) {
                return param.data < 0 ? '#2288DD' : '#ff6700'
              },
            },
          },
          barMaxWidth: 40,
          data: sourceData,
        }]
    }
    chartInstance.setOption(deepCloneForChartOption(option, extraChartOption), true)
    this.chartInstance = chartInstance
    window.addEventListener('resize', this.handleResize)
  }

  render() {
    return <div className="container" ref={(el:any) => { this.chartContainer = el }}/>
  }
}

export default Index

/**
 * 2018/10/9 Changed By yurt
 * 1. 去掉之前的xAxis和yAxis的配置，方便切换横纵坐标轴
 * 2. 增加baseAxis和xOry的配置
 */
