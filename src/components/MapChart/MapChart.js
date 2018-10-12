import React from 'react'
import echarts from 'echarts'
import CSSModules from 'react-css-modules'
import styles from './MapChart.css'
import chartCss from '../../files/chartCss.json'
import chinaCity from '../../files/chinaCity/chinaCity.json'

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
    if (this.myChart) this.myChart.resize() // 屏幕resize会出现mychart对象丢失的现象，在此增加判断
  }
  renderChart() {
    const dom = this.chart
    echarts.registerTheme('data2charts', chartCss)
    let myChart = echarts.init(dom, 'data2charts') // eslint-disable-line
    const data = this.props.data
    let area = data.area || 'china'
    let mapJson = null
    if (data.level && data.level === 1) {
      mapJson = require('echarts/map/json/china.json')
    } else if (data.level && data.level === 2) {
      mapJson = require(`echarts/map/json/province/${area}.json`)
    } else if (data.level && data.level === 3) {
      const cityCode = chinaCity[area]
      if (!cityCode) {
        // 查不到地级市的编码时显示全国地图
        area = 'china'
        mapJson = require('echarts/map/json/china.json')
      } else {
        mapJson = require(`../../files/chinaCity/${cityCode}.json`)
      }
    } else {
      mapJson = (area === 'china' ? require('echarts/map/json/china.json') : require(`echarts/map/json/province/${area}.json`))
    }
    const echartsMapNames = mapJson.features.map(item => item.properties.name)
    const sourceData = data.sourceData.map(item => ({
      name: item.name,
      data: item.data.map(pro => {
        let name = pro.name
        echartsMapNames.forEach(ename => {
          if (ename.indexOf(name) > -1) {
            name = ename
          }
        })
        return {
          name,
          value: pro.value,
        }
      }),
    }))
    echarts.registerMap(area, mapJson)
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
      series: sourceData.map(item => {
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
  }
  render() {
    return <div styleName="container" ref={el => { this.chart = el }} />
  }
}

export default CSSModules(MapChart, styles)
