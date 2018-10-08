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
  ['2015', '型号001', '渠道1', Math.random()*10],
  ['2016', '型号001', '渠道1', Math.random()*10],
  ['2017', '型号001', '渠道1', Math.random()*10],
  ['2018', '型号001', '渠道1', Math.random()*10],
  ['2019', '型号001', '渠道1', 0],
  ['2020', '型号001', '渠道1', 0],
  ['2012', '型号002', '渠道1', Math.random()*10],
  ['2013', '型号002', '渠道1', Math.random()*10],
  ['2014', '型号002', '渠道1', Math.random()*10],
  ['2015', '型号002', '渠道1', Math.random()*10],
  ['2016', '型号002', '渠道1', Math.random()*10],
  ['2017', '型号002', '渠道1', Math.random()*10],
  ['2018', '型号002', '渠道1', Math.random()*10],
  ['2019', '型号002', '渠道1', 0],
  ['2020', '型号002', '渠道1', 0],
  ['2012', '型号001', '渠道2', Math.random()*10],
  ['2013', '型号001', '渠道2', Math.random()*10],
  ['2014', '型号001', '渠道2', Math.random()*10],
  ['2015', '型号001', '渠道2', Math.random()*10],
  ['2016', '型号001', '渠道2', Math.random()*10],
  ['2017', '型号001', '渠道2', Math.random()*10],
  ['2018', '型号001', '渠道2', Math.random()*10],
  ['2019', '型号001', '渠道2', 0],
  ['2020', '型号001', '渠道2', 0],
  ['2012', '型号002', '渠道2', Math.random()*10],
  ['2013', '型号002', '渠道2', Math.random()*10],
  ['2014', '型号002', '渠道2', Math.random()*10],
  ['2015', '型号002', '渠道2', Math.random()*10],
  ['2016', '型号002', '渠道2', Math.random()*10],
  ['2017', '型号002', '渠道2', Math.random()*10],
  ['2018', '型号002', '渠道2', Math.random()*10],
  ['2019', '型号002', '渠道2', 0],
  ['2020', '型号002', '渠道2', 0],
]

const testChart = {
  data,
  chartType: 'bar',
  title: '123'
}

ReactDOM.render(<div>
  <OriginChartComponent
    type={'line'}
    chartData={testData}
  />
  <Chart
    chart={testChart}
  />
  <Chart
    chart={testChart}
    xColumn={0}
    yColumn={3}
    DimColumns={[1,2]}
  />
</div>, document.getElementById('app'));
