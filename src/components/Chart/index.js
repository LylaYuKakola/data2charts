import React from 'react'
import CSSModules from 'react-css-modules'
import { Icon } from 'antd'
import 'antd/lib/icon/style/css'
import 'antd/lib/drawer/style/css'
import styles from './Chart.css'
import { getChartData } from '../../model'
import OriginChartComponent from '../OriginChartComponent'

class Chart extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      drawerVisible: false,
      chart: props.chart || {},
      xColumn: props.xColumn,
      yColumn: props.yColumn,
      DimColumns: props.DimColumns,
    }
  }

  componentWillReceiveProps(changes) {
    this.setState({
      chart: changes.chart,
      xColumn: changes.xColumn,
      yColumn: changes.yColumn,
      DimColumns: changes.DimColumns,
    })
  }

  showDrawer = () => {
    this.settingDrawer.setAttribute('style', 'transform:translate(0)')
    this.settingMask.setAttribute('style', 'display:block')
  };

  closeDrawer = () => {
    this.settingDrawer.removeAttribute('style')
    this.settingMask.removeAttribute('style')
  };

  render() {
    const { chart, xColumn, yColumn, DimColumns } = this.state
    const { chartType } = chart
    const chartData = getChartData(chart, xColumn, yColumn, DimColumns)

    const id = `chart-container-${(Math.random() * 1000).toFixed()}`

    return (
      <div styleName="chart-container" id={id}>
        <OriginChartComponent
          type={chartType}
          chartData={chartData}
        />
        <div styleName="chart-setting-btn" onClick={this.showDrawer}>
          <Icon type="setting" />
        </div>
        <div styleName="chart-setting-drawer" ref={settingDrawer => this.settingDrawer = settingDrawer}>
          <div styleName="chart-setting-close-btn" onClick={this.closeDrawer}>
            <Icon type="right" theme="outlined" />
          </div>
          <div styleName="chart-setting-panel" />
        </div>
        <div
          styleName="chart-setting-mask"
          ref={settingMask => this.settingMask = settingMask}
        />
      </div>
    )
  }
}
export default CSSModules(Chart, styles)

