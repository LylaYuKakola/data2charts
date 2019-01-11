import * as React from 'react'
import * as echarts from 'echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/legendScroll'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import * as chartCss from '../../files/chartCss.json'
import { deepCloneForChartOption } from '../../util'

import { CommonChartProps } from '../common-chart-type'

class PieChart extends React.PureComponent<CommonChartProps, {}>  {

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
    const { data, extraChartOption } = this.state
    const { theme } = this.props
    if (theme) {
      echarts.registerTheme('data2charts', theme)
    } else {
      echarts.registerTheme('data2charts', chartCss)
    }
    let myChart = echarts.init(dom,'data2charts') // eslint-disable-line
    const option = {
      title: {
        text: data.title || '',
        padding: [4, 0],
        textStyle: {
          fontWeight: 'normal',
          fontSize: 15,
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
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        type: 'scroll',
        top: '10%',
        animation: true,
        pageIconSize: [20, 20],
        data: data.legendData || [],
      },
      series: data.sourceData.map(item => ({
        ...item,
        type: 'pie',
        radius: '50%',
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0,0,0,0.5)',
          },
        },
      })),
    }
    myChart.setOption(deepCloneForChartOption(option, extraChartOption), true)
    this.chartInstance = myChart
    window.addEventListener('resize', this.handleResize)
  }

  render() {
    return <div className="container" ref={el => { this.chartContainer = el }} />
  }
}

export default PieChart
