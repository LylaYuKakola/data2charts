// 是项目的JS打包入口文件
import React from 'react'
import ReactDOM from 'react-dom'

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
  ['2018', '型号001', '渠道2', -Math.random() * 10],
  ['2019', '型号001', '渠道2', 0],
  ['2020', '型号001', '渠道2', 0],
  ['2012', '型号002', '渠道2', Math.random() * 10],
  ['2013', '型号002', '渠道2', Math.random() * 10],
  ['2014', '型号002', '渠道2', -Math.random() * 10],
  ['2015', '型号002', '渠道2', Math.random() * 10],
  ['2016', '型号002', '渠道2', Math.random() * 10],
  ['2017', '型号002', '渠道2', Math.random() * 10],
  ['2018', '型号002', '渠道2', Math.random() * 10],
  ['2019', '型号002', '渠道2', 0],
  ['2020', '型号002', '渠道2', 0],
]

const dataForHeatMap = [
  ['北京市', '昌平区', 2.3],
  ['北京市', '海淀区', 2.8],
  ['天津市', '南开区', 2.1],
  ['河北省', '保定市', 1.9],
  ['河北省', '沧州市', 1.1],
  ['重庆市', '永川区', 1.3],
  ['重庆市', '北碚区', 2.1],
  ['湖北省', '武汉市', 3.3],
]

const testChart1 = {
  data,
  chartType: 'line',
}

const testChart2 = {
  data,
  columnNames,
  title: 'line图',
}

const testChart3 = {
  data,
  columnNames,
  title: 'bar默认',
}

const testChart4 = {
  data,
  columnNames,
  title: 'bar分组',
}

const testChartForPie = {
  data,
  columnNames,
  chartType: 'pie',
  title: 'pie',
}

const testChartForHeatMap = {
  data: dataForHeatMap,
  chartType: 'heatMap',
  title: 'heatMap',
}

const testChartForSum = {
  data: [[100000]],
  title: 'numeric',
  description: '描述一下子',
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
    chartType="line"
    chart={testChart1}
  />
  <hr />
  <p>x轴为基准line增加DimColumns配置</p>
  <Chart
    chartType="line"
    chart={testChart1}
    xColumn={0}
    yColumn={3}
    dimColumns={[1, 2]}
  />
  <hr />
  <p>y轴为基准line增加DimColumns配置</p>
  <Chart
    chartType="line"
    xOrY="y"
    chart={testChart2}
  />
  <hr />
  <p>y轴为基准line增加DimColumns配置</p>
  <Chart
    chartType="line"
    xOrY="y"
    chart={testChart2}
    xColumn={3}
    yColumn={0}
    dimColumns={[1, 2]}
  />
  <hr />
  <p>x轴为基准bar默认配置(默认排序)</p>
  <Chart
    chartType="bar"
    chart={testChart3}
  />
  <hr />
  <p>y轴为基准line增加DimColumns配置</p>
  <Chart
    chartType="bar"
    xOrY="y"
    chart={testChart4}
    xColumn={3}
    yColumn={0}
    dimColumns={[1, 2]}
  />
  <hr />
  <p>饼图</p>
  <Chart
    chartType="pie"
    chart={testChartForPie}
    xColumn={0}
    yColumn={3}
  />
  <hr />
  <p>numreic</p>
  <Chart
    chartType="numeric"
    chart={testChartForSum}
  />
  <Chart
    chartType="heatMap"
    chart={testChartForHeatMap}
  />
</div>, document.getElementById('app'))
