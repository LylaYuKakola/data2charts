import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './TreeChart.css'
import echarts from 'echarts/lib/echarts'
import chartCss from '../../files/chartCss.json'

class TreeChart extends React.PureComponent {
  componentDidMount() {
    const dom = this.chart
    echarts.registerTheme('chongming', chartCss)
    const myChart = echarts.init(dom, 'chongming')
    const data = this.props.data
    const option = {
      title: {
        text: data.title || '全渠道销量',
        padding: [4, 0],
        textStyle: {
          fontWeight: 'normal',
          fontSize: 15,
        },
      },
      tooltip: {
        trigger: 'item',
        position: ['25%', '-6px'],
      },
      series: [
        {
          name: data.root || '全渠道',
          type: 'treemap',
          visibleMin: 300,
          roam: false,
          data: data.sourceData,
          leafDepth: 1,
          zoomToNodeRatio: 0.5 * 0.5,
          levels: [
            {
              itemStyle: {
                normal: {
                  borderColor: '#fff',
                  borderWidth: 1,
                  gapWidth: 1,
                },
              },
            },
            {
              colorSaturation: [0.3, 0.6],
              itemStyle: {
                normal: {
                  borderColorSaturation: 0.7,
                  gapWidth: 1,
                  borderWidth: 1,
                },
              },
            },
            {
              colorSaturation: [0.3, 0.5],
              itemStyle: {
                normal: {
                  borderColorSaturation: 0.6,
                  gapWidth: 1,
                },
              },
            },
            {
              colorSaturation: [0.3, 0.5],
            },
          ],
        },
      ],
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

export default CSSModules(TreeChart, styles)
