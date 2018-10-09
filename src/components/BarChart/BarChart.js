import React from 'react'
import echarts from 'echarts'
import CSSModules from 'react-css-modules'
import styles from './BarChart.css'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/title'
import chartCss from '../../files/chartCss.json'

class BarChart extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      data: props.data,
    }
  }

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
    echarts.registerTheme('chongming', chartCss)
    let myChart = echarts.init(dom, 'chongming') // eslint-disable-line
    const data = this.state.data
    const unit = '(B:十亿 M:百万 K:千)'

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
          color(value) {
            return value === '总量' ? '#ff6700' : '#9B9B9B'
          },
        },
      },
    }
    const valueAxis = {
      type: 'value',
      axisLabel: {
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

    let xAxis; let
      yAxis
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
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: tooltip && tooltip.formatter === 'multi'
          ? thisData => sourceData[thisData[0].dataIndex][3]
          : params => {
            let sum = 0
            params.forEach(param => {
              sum += Number(param.value)
            })
            return params.map(param => {
              const msgArr = []
              msgArr.push(param.name)
              if (param.seriesName[1] !== '-') msgArr.push(param.seriesName)
              msgArr.push(param.value)
              if (params.length > 1) {
                const percent = `${String((param.value * 100) / sum).substr(0, 5)}%`
                msgArr.push(percent)
              }
              const msg = msgArr.join(' - ')
              return `${param.marker} ${msg}`
            }).join('<br/>')
          },
      },
      grid,
      xAxis,
      yAxis,
      series: [],
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
              color(param) {
                return param.data < 0 ? '#2288DD' : '#ff6700'
              },
            },
          },
          label: {
            normal: {
              show: true,
              position: 'right',
              formatter: thisData => sourceData[thisData.dataIndex][2],
            },
          },
        }]
        : option.series = [{
          type: 'bar',
          itemStyle: {
            normal: {
              color(param) {
                return param.data < 0 ? '#2288DD' : '#ff6700'
              },
            },
          },
          barMaxWidth: 40,
          data: sourceData,
        }]
    }
    myChart.setOption(option, true)
    this.myChart = myChart
    window.addEventListener('resize', this.handleResize)
  }

  render() {
    return <div styleName="container" ref={el => { this.chart = el }} />
  }
}

export default CSSModules(BarChart, styles)

/**
 * 2018/10/9 Changed By yurt
 * 1. 去掉之前的xAxis和yAxis的配置，方便切换横纵坐标轴
 * 2. 增加baseAxis和xOry的配置
 */
