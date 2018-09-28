import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './PieChart.css'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/legendScroll'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import chartCss from '../../files/chartCss.json'

class PieChart extends React.PureComponent {
  componentDidMount() {
    const dom = this.chart
    echarts.registerTheme('chongming', chartCss)
    let myChart = echarts.init(dom,'chongming') // eslint-disable-line
    const data = this.props.data
    const option = {
      title: {
        text: '销售额占比',
        padding: [4, 0],
        textStyle: {
          fontWeight: 'normal',
          fontSize: 15,
        },
      },
      tooltip: {
        trigger: 'item',
        position: [0, '80%'],
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        type: 'scroll',
        top: '10%',
        animation: true,
        pageIconSize: [20, 20],
        data: data.legendData || [],
      },
      series: [
        {
          name: data.dimention,
          type: 'pie',
          radius: '50%',
          data: data.sourceData || [],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0,0,0,0.5)',
            },
          },
        },
      ],
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

export default CSSModules(PieChart, styles)
