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

/**
 * 带有配置面板的图表组件（扩展自originChartComponent）
 *
 * @param chart {Object} 图表对象 包含以下（参考 ./model/index ）
 *   |----- chartType       {String}  图表类型，包含：line、bar、pie、numeric、heatMap
 *   |----- data            {Array}   数据，二维数组
 *   |----- description     {String}  标题的tooltip显示内容，用来丰富chart的描述
 *   |----- location        {String}  针对 heatMap 的特殊字段，当前map的城市名称
 *   |----- specialAxis     {Array}   针对 直角坐标系 的特殊字段，特殊的基轴的数据，为了补全因数据补全导致的基轴坐标获取不足
 *   |----- defaultDimName  {String}  针对 直角坐标系 的特殊字段，默认的维度名（当二维数组中只有两列的时候使用）
 *   |----- specialScaleArr {Array}   针对 直角坐标系 的特殊字段，双轴时描述第二个数据轴的数组
 *
 * @param xOrY              {String}  x轴为基轴还是y轴为基轴（针对bar和line）'x' / 'y'
 * @param xColumn           {Number}  x轴对应的列数，xOrY为 'x' 时默认第一列，'y' 时默认最后一列
 * @param yColumn           {Number}  y轴对应的列数，xOrY为 'y' 时默认第一列，'x' 时默认最后一列
 * @param dimColumns        {Array}   做分组合并的列数集合，默认为中间几列
 * @param theme             {Object}  样式主题的扩展
 * @param componentStyle    {Object}  组件的样式，作用在图表容器上（originChartComponent的配置项）
 * @param extraChartOption  {Object}  组件的样式，作用在图表容器上（originChartComponent的配置项）
 * @param children          {Object}  toolbar内容，作用在图表容器上（originChartComponent的配置项）
 * @param title             {Object}  ReactDom，显示为chart面板的title，作用在图表容器上（originChartComponent的配置项）
 */
class Chart extends React.PureComponent {
  constructor(props) {
    super(props)
    const {
      chart, xColumn, yColumn, dimColumns, title,
      xOrY, theme, extraChartOption, componentStyle,
    } = props
    const columnNames =
      (chart && chart.columnNames && (chart.columnNames instanceof Array)) ? chart.columnNames : []

    // 计算配置面板中所需要的标签
    const npmOfDataColumn = (chart && chart.data && chart.data[0].length) ? chart.data[0].length : 0
    const allTags = Array(npmOfDataColumn).fill(0).map((val, index) => ({
      id: index,
      column: columnNames[index] || `第${(index + 1)}列`,
    }))
    const isFullScreen = false
    this.state = {
      chartType: chart.chartType,
      chart,
      xColumn,
      yColumn,
      dimColumns,
      xOrY,
      allTags,
      isFullScreen,
      theme,
      extraChartOption,
      componentStyle,
      title,
    }
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

  updateChartData = data => {
    this.setState({
      chart: { ...this.state.chart, data },
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
    const {
      chartType, xOrY, xColumn, yColumn, componentStyle,
      dimColumns, allTags, theme, extraChartOption, title,
    } = this.state
    const needSettingPanel = !(['numeric', 'heatMap'].includes(chartType)) && this.props.needSettingPanel

    return (
      <div styleName={!isFullScreen ? 'chart-container' : 'chart-container-full-screen'} style={{ zIndex: isFullScreen ? 999999999 : 1 }}>
        <OriginChartComponent
          type={chartType}
          chartData={chartData}
          isFullScreen={isFullScreen}
          componentStyle={componentStyle}
          extraChartOption={extraChartOption}
          theme={theme}
          title={title}
        />
        <div styleName="chart-toolbar">
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
            needSettingPanel && <div styleName="chart-setting-btn" onClick={this.openSettingPanel}>
              <Icon type="setting" />
            </div>
          }
          {
            this.props.children && (
              <div styleName="chart-toolbar-extra">{ this.props.children }</div>
            )
          }
        </div>
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

