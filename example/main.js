// 是项目的JS打包入口文件
import React from 'react'
import ReactDOM from 'react-dom'
import theme from './walden.json'

// 导入项目的根组件
import { OriginChartComponent, Chart } from '../src'

const testData = {
  legendData: ['渠道1'],
  sourceData: [{
    name: '渠道1',
    data: [1, 2, 3, 4],
    title: '渠道1趋势',
    xAxisData: [1, 2, 3, 4],
  }],
}

const columnNames = ['year', '型号', '渠道', '数值']

const data = [
  ['2012', '型号001', '渠道1', Math.random() * 10],
  ['2013', '型号001', '渠道1', Math.random() * 10],
  ['2014', '型号001', '渠道1', Math.random() * 10],
  ['2015', '型号001', '渠道1', -Math.random() * 10],
  ['2016', '型号001', '渠道1', Math.random() * 10],
  ['2017', '型号001', '渠道1', Math.random() * 10],
  ['2018', '型号001', '渠道1', Math.random() * 10],
  ['2019', '型号001', '渠道1', 0],
  ['2020', '型号001', '渠道1', 0],
  ['2012', '型号002', '渠道1', Math.random() * 10],
  ['2013', '型号002', '渠道1', Math.random() * 10],
  ['2014', '型号002', '渠道1', -Math.random() * 10],
  ['2015', '型号002', '渠道1', Math.random() * 10],
  ['2016', '型号002', '渠道1', Math.random() * 10],
  ['2017', '型号002', '渠道1', Math.random() * 10],
  ['2018', '型号002', '渠道1', Math.random() * 10],
  ['2019', '型号002', '渠道1', 0],
  ['2020', '型号002', '渠道1', 0],
  ['2012', '型号001', '渠道2', -Math.random() * 10],
  ['2013', '型号001', '渠道2', Math.random() * 10],
  ['2014', '型号001', '渠道2', Math.random() * 10],
  ['2015', '型号001', '渠道2', Math.random() * 10],
  ['2016', '型号001', '渠道2', Math.random() * 10],
  ['2017', '型号001', '渠道2', Math.random() * 10],
  ['2018', '型号001', '渠道2', String(-Math.random() * 10)],
  ['2019', '型号001', '渠道2', '0'],
  ['2020', '型号001', '渠道2', 0],
  ['2012', '型号002', '渠道2', Math.random() * 10],
  ['2013', '型号002', '渠道2', Math.random() * 10],
  ['2015', '型号002', '渠道2', Math.random() * 10],
  ['2016', '型号002', '渠道2', Math.random() * 10],
  ['2017', '型号002', '渠道2', Math.random() * 10],
  ['2018', '型号002', '渠道2', Math.random() * 10],
  ['2019', '型号002', '渠道2', 0],
  ['2020', '型号002', '渠道2', 0],
]

const dataForHeatMap = [
  ['北京市', '昌平区', 1],
  ['北京市', '海淀区', 1],
  ['天津市', '南开区', 3],
  ['河北省', '保定市', 0.5],
  ['河北省', '沧州市', 0.5],
  ['重庆市', '永川区', 0.2],
  ['重庆市', '北碚区', 0.1],
  ['湖北省', '武汉市', 0.1],
]

const testChart1 = {
  data,
  chartType: 'line',
}

const testChart4 = {
  data,
  chartType: 'bar',
  title: 'bar分组',
}

const testChartForPie = {
  data,
  columnNames,
  chartType: 'pie',
  title: 'pie+columnNames的演示',
}

const testChartForHeatMap = {
  data: dataForHeatMap,
  chartType: 'heatMap',
  title: 'heatMap',
  canDrillDown: false,
}

const testChartForSum = {
  data: [[100000]],
  title: 'numeric',
  description: '单指标的描述',
}

ReactDOM.render(<div>
  <p>原始配置</p>
  <OriginChartComponent
    type={'line'}
    chartData={testData}
  />
  <hr />
  <p>x轴为基准line默认配置</p>
  <Chart
    chart={testChart1}
  />
  <hr />
  <p>x轴为基准line增加DimColumns配置</p>
  <Chart
    chart={testChart1}
    xColumn={0}
    yColumn={3}
    dimColumns={[1, 2]}
    needSettingPanel
  />
  <hr />
  <p>y轴为基准line增加DimColumns配置</p>
  <Chart
    xOrY="y"
    chart={testChart4}
    xColumn={3}
    yColumn={0}
    dimColumns={[1, 2]}
    needSettingPanel
    title={<div style={{ height: 100, padding: '1em' }}>123123123123</div>}
  >
    <div>123123</div>
  </Chart>
  <hr />
  <p>饼图</p>
  <Chart
    chart={testChartForPie}
    xColumn={0}
    yColumn={3}
    needSettingPanel
  />
  <hr />
  <Chart
    chartType="heatMap"
    chart={testChartForHeatMap}
  />
</div>, document.getElementById('app'))
