// 是项目的JS打包入口文件
import React from 'react'
import ReactDOM from 'react-dom'

// 导入项目的根组件
import Chart from '../src/index.js'
const testData = {
  legendData: ['出货量'],
  sourceData: [{
    name: '出货量',
    data: [1,2,3,4],
    title: '出货量趋势',
    xAxisData: [1,2,3,4]
  }]
}
ReactDOM.render(<Chart
  type={'line'}
  chartData={testData}
/>, document.getElementById('app'));
