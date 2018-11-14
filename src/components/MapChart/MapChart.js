import React from 'react'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/map'
import 'echarts/lib/component/geo'
import 'echarts/lib/component/visualMap'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/graphic'
import CSSModules from 'react-css-modules'
import styles from './MapChart.css'
import chartCss from '../../files/chartCss.json'

/**
 * 2018/10/17 重写renderChart
 * 把geoJSON用高德的api获取
 */

// {adcode}  // option缺少 lengend series visualMap.max


const KEY = 'key=7f9bb5546562740fa4f1ca832126218e'
const AMAPURL = `http://webapi.amap.com/maps?v=1.4.6&key=${KEY}`
const AMAPUIURL = 'http://webapi.amap.com/ui/1.0/main.js?v=1.0.11'
const CONSTQUERY = 's=rsv3&output=json&subdistrict=0&extensions=base'
const AMAPAPIURL = 'https://restapi.amap.com/v3/config/district'

class MapChart extends React.PureComponent {
  componentDidMount() {
    this.renderChart()
    window.addEventListener('resize', () => this.handleResize())
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () => this.handleResize())
    this.chart.dispose()
    this.chart = null
  }

  handleResize() {
    if (this.chart) this.chart.resize()
  }

  fetchPolyline = (area = '中国') => {
    if (area === '全国') area = '中国'
    const requestURL = `${AMAPAPIURL}?${KEY}&${CONSTQUERY}&keywords=${encodeURIComponent(area)}`
    return fetch(requestURL).then(res => res.json())
  }

  initChartOption() {
    if (this.chartOption) return this
    const { title, legendData } = this.props.data
    this.chartOption = {
      title: {
        text: title,
        padding: [4, 0],
        textStyle: {
          fontWeight: 'normal',
          fontSize: 14,
        },
      },
      geo: {},
      tooltip: {
        trigger: 'item',
      },
      legend: {
        type: 'scroll',
        selectedMode: 'single',
        top: '22px',
        animation: true,
        data: legendData,
      },
      label: {
        show: true,
      },
      visualMap: {
        min: 0,
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
      series: [],
    }
    return this
  }

  initDistrictExplorer() {
    return new Promise(resolve => {
      if (this.districtExplorer) return resolve()
      window.AMapUI.loadUI(['geo/DistrictExplorer'], DistrictExplorer => {
        this.districtExplorer = new DistrictExplorer()
        resolve()
      })
    })
  }

  buildDataMap() {
    const { originDataTree } = this.props.data
    const { breadcrumbData } = this
    const currentDepth = breadcrumbData.length
    let currentObject = originDataTree
    const dataMqp = Object.create(null)

    for (let i = 1; i < currentDepth; i++) {
      if (breadcrumbData[i]) {
        currentObject = currentObject[breadcrumbData[i].name] || Object.create(null)
      }
    }

    Object.keys(currentObject).forEach(childKey => {
      const objectStr = JSON.stringify(currentObject[childKey])
      const reg = /\*\*\|(\S+?)\|\*\*/g
      let sum = 0
      objectStr.match(reg).forEach(val => sum += (Number(val.slice(3, val.length - 3)) || 0))
      dataMqp[childKey] = sum
    })

    this.dataMqp = dataMqp
    return this
  }

  makeDataToChartOption() {
    const { legendData } = this.props.data
    const { dataMqp, adcode } = this
    const { features } = this.geoData
    let max = 0
    const data = features.map(feature => {
      const { properties } = feature
      const value = dataMqp[properties.name] || '0'
      if (max < value) max = value
      return {
        name: properties.name,
        adcode: properties.adcode,
        childrenNum: properties.childrenNum,
        value,
      }
    })
    const serie = {
      name: legendData[0],
      type: 'map',
      roam: 'scale',
      map: adcode,
      label: {
        show: false,
      },
      itemStyle: {
        normal: {
          borderColor: 'grey',
          areaColor: '#2678b2',
          label: {
            show: false,
          },
        },
        emphasis: {
          areaColor: 'lightsteelblue',
          label: {
            show: false,
          },
        },
      },
      scaleLimit: {
        min: 0.8,
        max: 2,
      },
      zoom: 1,
      showLegendSymbol: false,
      data,
    }
    this.chartOption.series = [serie]
    this.chartOption.visualMap.max = max || 100
  }

  loadChart() {
    this.chart.showLoading()
    this.initChartOption().initDistrictExplorer().then(() => {
      this.districtExplorer.loadAreaNode(this.adcode, (error, areaNode) => {
        this.geoData.features = areaNode.getSubFeatures()
        echarts.registerMap(this.adcode, this.geoData)

        this.renderBreadcrumb(areaNode)
          .buildDataMap()
          .makeDataToChartOption()
        this.chart.hideLoading()
        this.chart.clear()
        console.log(this.chartOption)
        this.chart.setOption(this.chartOption)
      })
    })
  }

  loadScript = src => {
    return new Promise(resolve => {
      let scriptDom = document.createElement('script')
      scriptDom.charset = 'utf-8'
      scriptDom.src = src
      scriptDom.onload = () => {
        resolve()
      }
      document.head.appendChild(scriptDom)
      scriptDom = null
    })
  }

  renderBreadcrumb(areaNode) {
    const areaProps = areaNode.getProps()

    // 重新构造面包屑组件的数据
    const newBreadcrumbData = []
    const isAreaNodeExist = this.breadcrumbData.some(crumb => {
      newBreadcrumbData.push(crumb)
      return crumb.adcode === areaProps.adcode
    })
    if (!isAreaNodeExist) {
      newBreadcrumbData.push({
        name: areaProps.name,
        adcode: areaProps.adcode,
      })
    }
    this.breadcrumbData = newBreadcrumbData

    const graphicForMapChart = []
    const graphicPosition = {
      leftCur: 20,
      top: 60,
      separationSpace: 11,
      separatorWidth: 5,
      wordWidth: 13,
    }
    let concatString = ''
    this.breadcrumbData.forEach((crumb, index) => {
      const style = {
        font: '14px "Microsoft YaHei", sans-serif',
        textColor: '#6194cf',
      }

      // 构造 >
      if (index !== 0) {
        const line = [
          [0, 0],
          [graphicPosition.separatorWidth - 1, graphicPosition.separatorWidth],
          [0, graphicPosition.separatorWidth * 2],
        ]
        const polylineLeft = (graphicPosition.leftCur +
          (((2 * index) - 1) * graphicPosition.separationSpace)) +
          (concatString.length * graphicPosition.wordWidth) +
          ((index - 1) * graphicPosition.separatorWidth)
        graphicForMapChart.push({
          type: 'polyline',
          left: polylineLeft,
          top: graphicPosition.top,
          shape: {
            points: line,
          },
          silent: true,
          bounding: 'all',
        })
      }
      // 构造名称text对象
      const textLeft = (graphicPosition.leftCur +
        (index * ((2 * graphicPosition.separationSpace) + graphicPosition.separatorWidth))) +
        (concatString.length * graphicPosition.wordWidth)
      graphicForMapChart.push({
        type: 'text',
        left: textLeft,
        top: graphicPosition.top,
        style: {
          text: crumb.name,
          textAlign: 'center',
          fill: style.textColor,
          font: style.font,
        },
        onclick: () => {
          if (this.adcode !== crumb.adcode) {
            this.adcode = crumb.adcode
            this.loadChart()
          }
        },
      })
      concatString += (crumb.name || '-无名称地址-')
    })
    this.chartOption.graphic = graphicForMapChart
    return this
  }

  renderChart() {
    const { area, canDrillDown } = this.props.data

    this.fetchPolyline(area).then(res => {
      let adcode = 100000
      let name = '全国'
      if (res && res.districts && res.districts[0]) {
        adcode = Number(res.districts[0].adcode) || 100000
        name = (!res.districts[0].name || res.districts[0].name === '中华人民共和国') ? '全国' : res.districts[0].name
      }
      return { name, adcode }
    }).then(res => {
      const adcode = res.adcode || 100000
      const name = res.name || '全国'
      // const res = { name, adcode }

      const container = this.container
      const { theme } = this.props
      if (theme) {
        echarts.registerTheme('data2charts', theme)
      } else {
        echarts.registerTheme('data2charts', chartCss)
      }
      this.chart = echarts.init(container, 'data2charts')

      // 点击下钻
      if (canDrillDown) {
        this.chart.on('click', event => {
          const { componentType } = event
          let childrenNum = 0

          // 根据目标类型获取adocde和下级区域数量
          if (componentType === 'series') {
            this.adcode = event.data.adcode
            childrenNum = event.data.childrenNum
          }

          if (childrenNum > 0) {
            this.loadChart()
          } else {
            console.log('无下级区域！')
          }
        })
      }

      this.currentLevel = 0
      this.adcode = adcode
      this.geoData = { type: 'FeatureCollection', features: [] }
      this.breadcrumbData = [{ name, adcode }]
      this.districtExplorer = null
      this.chartOption = null

      // 引入AMap和AMapUI
      if (!window.AMapUI || !window.AMap) {
        this.loadScript(AMAPURL).then(() => {
          return this.loadScript(AMAPUIURL)
        }).then(() => {
          this.loadChart()
        })
      } else {
        this.loadChart()
      }
    })
  }

  render() {
    return (<div
      styleName="container"
      ref={el => {
        this.container = el
      }}
    />)
  }
}

export default CSSModules(MapChart, styles)
