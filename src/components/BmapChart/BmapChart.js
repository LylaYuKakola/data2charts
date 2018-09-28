import React from 'react'
import echarts from 'echarts'
import CSSModules from 'react-css-modules'
import styles from './BmapChart.css'
import chartCss from '../../files/chartCss.json'
import bmap from 'echarts/extension/bmap/bmap'

class MapChart extends React.PureComponent {
  componentDidMount() {
    const dom = this.chart
    echarts.registerTheme('chongming', chartCss)
    let myChart = echarts.init(dom, 'chongming') // eslint-disable-line
    const data = this.props.data
    const option = {
      title: {
        text: data.title,
        padding: [4, 0],
        textStyle: {
          fontWeight: 'normal',
          fontSize: 14,
        },
      },
      tooltip: {
        trigger: 'item',
      },
      bmap: {
        center: [104.114129, 37.550339],
        zoom: 5,
        roam: true,
      },
      series: data.sourceData.map(item => {
        return {
          name: item.name,
          type: 'scatter',
          data: item.data,
          coordinateSystem: 'bmap',
          symbolSize: val => {
            return val[2] / 10;
          },
          label: {
            normal: {
              formatter: '{b}',
              position: 'right',
              show: false,
            },
            emphasis: {
              show: true,
            },
          },
          itemStyle: {
            normal: {
              color: 'purple',
            },
          },
        }
      }),
    }
    myChart.setOption(option, true)
    this.myChart = myChart
    window.addEventListener('resize', () => this.handleResize())
  }
  componentWillUnmount() {
    window.removeEventListener('resize', () => this.handleResize())
    this.myChart.dispose()
    this.myChart = null
  }
  handleResize() {
    this.myChart.resize()
  }
  render() {
    return <div styleName="container" ref={el => { this.chart = el }} />
  }
}

export default CSSModules(MapChart, styles)
