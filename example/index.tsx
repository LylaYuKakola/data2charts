// 是项目的JS打包入口文件
import * as React from 'react'
import * as ReactDOM from 'react-dom'

// 导入项目的根组件
import Chart from '../src/index'

class Main extends React.PureComponent{

  constructor(props: any) {
    super(props)
  }

  static getRandomData() {
    return [
      ['2012', '型号001', '渠道1', String(Math.random() * 10)],
      ['2013', '型号001', '渠道1', '-'],
      ['2014', '型号001', '渠道1', Math.random() * 10],
      ['2015', '型号001', '渠道1', -Math.random() * 10],
      ['2016', '型号001', '渠道1', Math.random() * 10],
      ['2017', '型号001', '渠道1', Math.random() * 10],
      ['2018', '型号001', '渠道1', Math.random() * 10],
      ['2019', '型号001', '渠道1', '-'],
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
  }

  static dataForHeatMap = [
    ['北京市', '昌平区', 1000],
    ['北京市', '海淀区', 1600],
    ['天津市', '南开区', 3000],
    ['河北省', '保定市', 1200],
    ['河北省', '沧州市', 500],
    ['重庆市', '永川区', 1200],
    ['重庆市', '北碚区', 2000],
    ['湖北省', '武汉市', 2500],
  ]

  static dataForBar = [
    ['北京市', 1000],
    ['天津市', 3000],
    ['河北省', '沧州市', 500],
  ]

  render() {
    return (
      <div>
        <Chart
          chartType="line"
          data={Main.getRandomData()}
          needSettingPanel={true}
        />
        <Chart
          chartType="heatMap"
          data={Main.dataForHeatMap}
          canDrillDown={true}
        />
        <Chart
          chartType="bar"
          data={Main.getRandomData()}
          needSettingPanel={true}
          xOrY="y"
        />
      </div>
    )
  }
}

ReactDOM.render(<Main />, document.getElementById('root'))
