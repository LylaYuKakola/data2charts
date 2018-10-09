// 是项目的JS打包入口文件
import React from 'react'
import ReactDOM from 'react-dom'

// 导入项目的根组件
import { OriginChartComponent, Chart } from '../src/index.js'
const testData = {
  legendData: ['渠道1'],
  sourceData: [{
    name: '渠道1',
    data: [1,2,3,4],
    title: '渠道1趋势',
    xAxisData: [1,2,3,4]
  }]
}

const data = [
  ['2012', '型号001', '渠道1', Math.random()*10],
  ['2013', '型号001', '渠道1', Math.random()*10],
  ['2014', '型号001', '渠道1', Math.random()*10],
  ['2015', '型号001', '渠道1', -Math.random()*10],
  ['2016', '型号001', '渠道1', Math.random()*10],
  ['2017', '型号001', '渠道1', Math.random()*10],
  ['2018', '型号001', '渠道1', Math.random()*10],
  ['2019', '型号001', '渠道1', 0],
  ['2020', '型号001', '渠道1', 0],
  ['2012', '型号002', '渠道1', Math.random()*10],
  ['2013', '型号002', '渠道1', Math.random()*10],
  ['2014', '型号002', '渠道1', -Math.random()*10],
  ['2015', '型号002', '渠道1', Math.random()*10],
  ['2016', '型号002', '渠道1', Math.random()*10],
  ['2017', '型号002', '渠道1', Math.random()*10],
  ['2018', '型号002', '渠道1', Math.random()*10],
  ['2019', '型号002', '渠道1', 0],
  ['2020', '型号002', '渠道1', 0],
  ['2012', '型号001', '渠道2', -Math.random()*10],
  ['2013', '型号001', '渠道2', Math.random()*10],
  ['2014', '型号001', '渠道2', Math.random()*10],
  ['2015', '型号001', '渠道2', Math.random()*10],
  ['2016', '型号001', '渠道2', Math.random()*10],
  ['2017', '型号001', '渠道2', Math.random()*10],
  ['2018', '型号001', '渠道2', -Math.random()*10],
  ['2019', '型号001', '渠道2', 0],
  ['2020', '型号001', '渠道2', 0],
  ['2012', '型号002', '渠道2', Math.random()*10],
  ['2013', '型号002', '渠道2', Math.random()*10],
  ['2014', '型号002', '渠道2', -Math.random()*10],
  ['2015', '型号002', '渠道2', Math.random()*10],
  ['2016', '型号002', '渠道2', Math.random()*10],
  ['2017', '型号002', '渠道2', Math.random()*10],
  ['2018', '型号002', '渠道2', Math.random()*10],
  ['2019', '型号002', '渠道2', 0],
  ['2020', '型号002', '渠道2', 0],
]

const testChart1 = {
  data,
  chartType: 'line',
  xOrY: 'x'
}

const testChart2 = {
  data,
  chartType: 'line',
  title: 'line图',
  xOrY: 'y'
}

const testChart3 = {
  data,
  chartType: 'bar',
  title: 'bar默认',
  xOrY: 'x'
}

const testChart4 = {
  data,
  chartType: 'bar',
  title: 'bar分组',
  xOrY: 'y'
}

ReactDOM.render(<div>
  <p>原始配置</p>
  <OriginChartComponent
    type={'line'}
    chartData={testData}
  />
  <p>x轴为基准line默认配置</p>
  <Chart
    chart={testChart1}
  />
  <p>x轴为基准line增加DimColumns配置</p>
  <Chart
    chart={testChart1}
    xColumn={0}
    yColumn={3}
    DimColumns={[1,2]}
  />
  <p>y轴为基准line增加DimColumns配置</p>
  <Chart
    chart={testChart2}
  />
  <p>y轴为基准line增加DimColumns配置</p>
  <Chart
    chart={testChart2}
    xColumn={3}
    yColumn={0}
    DimColumns={[1,2]}
  />
  <p>x轴为基准bar默认配置(默认排序)</p>
  <Chart
    chart={testChart3}
  />
  <p>y轴为基准line增加DimColumns配置</p>
  <Chart
    chart={testChart4}
    xColumn={3}
    yColumn={0}
    DimColumns={[1,2]}
  />
</div>, document.getElementById('app'));
