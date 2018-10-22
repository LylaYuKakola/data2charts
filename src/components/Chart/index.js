import React from 'react'
import CSSModules from 'react-css-modules'
import { Icon } from 'antd'
import 'antd/lib/icon/style/css'
import 'antd/lib/drawer/style/css'
import styles from './Chart.css'
import { getChartData } from '../../model'
import OriginChartComponent from '../OriginChartComponent'
import SettingPanel from './SettingPanel'

/**
 * 2018/10/10 yurt
 * 当前主要问题为阻止了props的更新，所以暂时只能通过组件内部去更改图表和配置
 * 1. 是否需要从外部修改
 * 2. 从外部修改是否只提供一个api方法方便组件状态管理（影响组件扩展性）
 */
class Chart extends React.PureComponent {
  constructor(props) {
    super(props)
    const { chartType, chart, xColumn, yColumn, dimColumns, xOrY } = props

    // 计算配置面板中所需要的标签
    const npmOfDataColumn = (chart && chart.data && chart.data[0].length) ? chart.data[0].length : 0
    const allTags = Array(npmOfDataColumn).fill(0).map((val, index) => ({
      id: index,
      column: index + 1,
    }))
    const isFullScreen = false
    this.state = { chartType, chart, xColumn, yColumn, dimColumns, xOrY, allTags, isFullScreen }
  }

  openSettingPanel = () => {
    const { xOrY, xColumn, yColumn, dimColumns, allTags, chartType } = this.state
    this.settingPanel.openSettingPanel({
      xOrY,
      xColumn,
      yColumn,
      dimColumns,
      allTags,
      chartType,
    })
  }

  closeSettingPanelHandler = option => {
    this.setState(option)
  }

  openFullScreenHandler = () => {
    this.setState({
      isFullScreen: true,
    })
  }

  closeFullScreenHandler = () => {
    this.setState({
      isFullScreen: false,
    })
  }

  renderChartPanel(chartData, isFullScreen) {
    const { chartType, xOrY, xColumn, yColumn, dimColumns, allTags } = this.state
    const needSettingPanel = !(['numeric', 'heatMap'].includes(chartType))

    return (
      <div styleName={!isFullScreen ? 'chart-container' : 'chart-container-full-screen'} style={{ zIndex: 999999999 }}>
        <OriginChartComponent
          type={chartType}
          chartData={chartData}
          isFullScreen={isFullScreen}
        />
        {
          needSettingPanel && <div styleName="chart-setting-btn" onClick={this.openSettingPanel}>
            <Icon type="setting" />
          </div>
        }
        {
          !isFullScreen && <div styleName="fullscreen-btn">
            <Icon type="fullscreen" theme="outlined" onClick={this.openFullScreenHandler} />
          </div>
        }
        {
          isFullScreen && <div styleName="fullscreen-btn">
            <Icon type="fullscreen-exit" theme="outlined" onClick={this.closeFullScreenHandler} />
          </div>
        }
        {
          needSettingPanel && <SettingPanel
            allTags={allTags}
            ref={settingPanel => this.settingPanel = settingPanel}
            chartType={chartType}
            xOrY={xOrY}
            xColumn={xColumn}
            yColumn={yColumn}
            dimColumns={dimColumns}
            onClose={this.closeSettingPanelHandler}
          />
        }
      </div>
    )
  }

  render() {
    const { chart, chartType, xOrY, xColumn, yColumn, dimColumns, isFullScreen } = this.state

    // 计算图表数据
    const chartData = getChartData(chart, chartType, xOrY, xColumn, yColumn, dimColumns)
    return (
      <div>
        { this.renderChartPanel(chartData, false) }
        {isFullScreen && this.renderChartPanel(chartData, true) }
      </div>
    )
  }
}
export default CSSModules(Chart, styles)

