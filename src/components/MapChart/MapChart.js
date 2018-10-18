import React from 'react'
import echarts from 'echarts'
import CSSModules from 'react-css-modules'
import styles from './MapChart.css'
import chartCss from '../../files/chartCss.json'
import { geoJSONFactory } from './geoJSON'

/**
 * 2018/10/17 重写renderChart
 * 把geoJSON用高德的api获取
 */

const KEY = 'key=7f9bb5546562740fa4f1ca832126218e'
const CONSTQUERY = 's=rsv3&output=json'
const AMAPAPIURL = 'https://restapi.amap.com/v3/config/district'

class MapChart extends React.PureComponent {
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
    window.removeEventListener('resize', () => this.handleResize())
    this.myChart.dispose()
    this.myChart = null
  }
  handleResize() {
    // 屏幕resize会出现mychart对象丢失的现象，在此增加判断
    if (this.myChart) this.myChart.resize()
  }
  fetchPolyline = (area = '中国', subdistrict = 0, extensions = 'base') => {
    const requestURL = `${AMAPAPIURL}?${KEY}&${CONSTQUERY}&keywords=${encodeURIComponent(area)}&subdistrict=${subdistrict}&extensions=${extensions}`
    return fetch(requestURL).then(res => res.json())
  }
  renderChart() {
    const dom = this.chart
    echarts.registerTheme('data2charts', chartCss)
    let myChart = echarts.init(dom, 'data2charts') // eslint-disable-line
    const data = this.props.data
    const area = data.area || '中国'
    const geoJSONOriginMap = new Map()

    // 获取当前area下的行政单位的轮廓图的geoJSON
    this.fetchPolyline(area, 1).then(res => {
      const { districts } = res
      if (!districts || !districts[0]) return []
      return districts[0].districts || []
    }).then(children => {
      return Promise.all(children.map(child => {
        return this.fetchPolyline(child.adcode, 0, 'all').then(res => {
          const { districts } = res
          if (!districts || !districts[0]) return
          const currentCityMsg = districts[0]
          const { polyline } = currentCityMsg
          geoJSONOriginMap.add(currentCityMsg.name, polyline.split('|').map(str => str.split(';')))
        })
      }))
    }).then(() => {
      const geoJSON = geoJSONFactory(geoJSONOriginMap)
      echarts.registerMap(area, geoJSON)
      
      for()
      
      const option = {
        title: {
          text: data.title,
          padding: [4, 0],
          textStyle: {
            fontWeight: 'normal',
            fontSize: 14,
          },
        },
        geo: {
          top: 100,
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          type: 'scroll',
          selectedMode: 'single',
          top: '22px',
          animation: true,
          data: data.legendData,
        },
        visualMap: {
          // orient: 'horizontal',
          // inverse: 'true',
          min: 0,
          max: data.maxData,
          padding: [0, 18, 0, 0],
          itemWidth: 10,
          left: 'left',
          top: 'bottom',
          text: ['高', '低'], // 文本，默认为数值文本
          calculable: false,
          inRange: {
            color: ['#f5f5f5', '#ffa800', '#ff4d00'],
          },
        },
        series: data.sourceData.map(item => {
          return {
            name: item.name,
            type: 'map',
            mapType: area,
            roam: 'scale',
            scaleLimit: {
              min: 0.8,
              max: 2,
            },
            zoom: area === 'china' ? 1 : 0.8,
            showLegendSymbol: false,
            data: item.data,
          }
        }),
      }
      myChart.setOption(option, true)
      this.myChart = myChart
      window.addEventListener('resize', () => this.handleResize())
    })
  }
  
  // 加载地图
  loadMap(){
  
  }
  render() {
    return <div styleName="container" ref={el => { this.chart = el }} />
  }
}

export default CSSModules(MapChart, styles)
