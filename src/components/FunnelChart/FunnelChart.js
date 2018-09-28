import React from 'react'
import echarts from 'echarts'
import CSSModules from 'react-css-modules'
import styles from './FunnelChart.css'
import chartCss from '../../files/chartCss.json'

class FunnelChart extends React.PureComponent {
  componentDidMount() {
    const dom = this.chart
    echarts.registerTheme('chongming', chartCss)
    let myChart = echarts.init(dom, 'chongming') // eslint-disable-line
    // const data = this.props.data
    // const unit = '(B:十亿 M:百万 K:千)'

    const option = {
      title: {
        text: '漏斗图',
        padding: [4, 0],
        textStyle: {
          fontWeight: 'normal',
          fontSize: 15,
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        type: 'scroll',
        top: '20',
        animation: true,
        pageIconSize: [20, 20],
        data: ['展现', '点击', '访问', '咨询', '订单'],
      },
      series: [
        {
          name: '漏斗图',
          type: 'funnel',
          left: '5%',
          top: 60,
          width: '90%',
          height: '80%',
          sort: 'descending',
          gap: 2,
          label: {
            normal: {
              show: true,
              position: 'inside',
            },
            emphasis: {
              textStyle: {
                fontSize: 20,
              },
            },
          },
          data: [
            { value: 60, name: '访问' },
            { value: 40, name: '咨询' },
            { value: 20, name: '订单' },
            { value: 80, name: '点击' },
            { value: 100, name: '展现' },
          ],
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

export default CSSModules(FunnelChart, styles)
