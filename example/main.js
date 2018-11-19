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

const data2 = [
  ['2012', '1'],
  ['2013', '2'],
  ['2014', '3'],
]

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

const extra = {
  title: {
    text: '{hl|20181114}->{hl|20181113}的{hl|出货量}降低原因重要性排序\n{lt|＊橙色代表子群变化趋势为增长，蓝色代表子群变化趋势为下降}',
    subtext: '{cn|}',
    padding: [4, 0],
    textStyle: {
      fontWeight: 'normal',
      fontSize: 15,
      lineHeight: 20,
      rich: {
        hl: {
          color: '#1890ff',
          fontSize: 15,
        },
        lt: {
          color: '#9d9d9d',
          fontSize: 13,
        },
      },
    },
    subtextStyle: {
      lineHeight: 20,
      verticalAlign: 'center',
      rich: {
        cn: {
          align: 'center',
          color: '#ff6700',
        },
      },
    },
  },
  grid: {
    left: '16%',
  },
  yAxis: {
    data: ['分销 广东 小米8', '县级授权店 小米MIX3', '分销 广东', '小米商城 广东 小米MIX3', '县级授权店', '电商渠道 福建 小米8青春', '电商渠道', '分销', '电商渠道 广东 小米8', '电商渠道 山东 红米6A', '小米商城', '运营商', '电商渠道 广东 小米8青春', '线下KA', '电商渠道 福建', '电商渠道 山东', '电商渠道 广东', '总量'],
    axisLabel: {
      margin: 4,
      textStyle: {},
    },
  },
  xAxis: {
    type: 'value',
    axisLabel: {},
  },
  series: [{
    type: 'bar',
    barMaxWidth: 40,
    data: ['-0.2004', '-0.2055', '-0.2452', '0.2806', '-0.3253', '-0.3731', '0.3948', '-0.4138', '0.4665', '0.5160', '0.6103', '-0.6182', '0.6701', '-0.7094', '-0.8005', '0.8391', '1.9495', '-1'],
    itemStyle: {
      normal: {},
    },
    label: {
      normal: {
        show: true,
        position: 'right',
      },
    },
  }],
}

let a = null

ReactDOM.render(<div>
  <p>原始配置</p>
  <OriginChartComponent
    type={'line'}
    chartData={testData}
  />
  <hr />
  <p>x轴为基准line默认配置</p>
  <Chart
    chart={{
      chartType: 'line',
      data: data2,
      defaultDimName: '测试',
    }}
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
  <Chart
    chartType="heatMap"
    chart={testChartForHeatMap}
  />
  <Chart
    chartType="heatMap"
    chart={testChartForHeatMap}
  />
  <Chart
    chart={{
      chartType: 'bar',
    }}
    ref={e => a = e}
    extraChartOption={extra}
  />
  <div onClick={event => a.setState({ extraChartOption: { ...extra, title: { text: 'asd' } } })}>
    12312312
  </div>
</div>, document.getElementById('app'))
