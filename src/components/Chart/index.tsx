import * as React from 'react'
import './index.scss'
import { Icon } from 'antd'
import 'antd/lib/icon/style/css'
import SettingPanel from './SettingPanel'
import OriginChartComponent from './OriginChartComponent'
import { getChartData } from '../../model'
import { objectFilter } from '../../util'

interface ChartProps {

  // chart 数据展示的配置
  chartType: string, // 图表类型，包含：line、bar、pie、heatMap
  data: any[][], // 原始数据
  xOrY?: string, // x轴为基轴还是y轴为基轴（针对bar和line）['x'|'y']，默认为 'x'
  xColumn?: number, // x轴对应的列数，xOrY为 'x' 时默认第一列，'y' 时默认最后一列
  yColumn?: number, // y轴对应的列数，xOrY为 'y' 时默认第一列，'x' 时默认最后一列
  dimColumns?: number[], // 做分组合并的列数集合，默认为中间几列
  columnNames?: string[], // 数据每列的名称

  // chart 样式
  theme?: any, // 样式主题的扩展
  componentStyle?: any, // 组件扩展的样式

  // chart 相关配置
  title?: any, // ReactDom，显示为chart面板的title，作用在图表容器上（originChartComponent的配置项）
  description?: string, // 标题的tooltip显示内容，用来丰富chart的描述
  toolbars?: any, // toolbar内容，作用在图表容器上（originChartComponent的配置项

  // ECharts 原声配置扩展
  extraChartOption?: any,

  // 是否需要配置面板，默认为false
  needSettingPanel?: boolean,

  // 针对不同类型的不同配置
  location?: string, // 针对 heatMap 的特殊字段，当前map的城市名称
  canDrillDown?: boolean, // 针对 heatMap 的特殊字段，是否可以下钻
  specialAxis?: any[], // 针对 直角坐标系 的特殊字段，特殊的基轴的数据，为了补全因数据补全导致的基轴坐标获取不足
  specialScaleArr?: any[], // 针对 直角坐标系 的特殊字段，双轴时描述第二个数据轴的数组
  defaultDimName?: string, // 针对 直角坐标系 的特殊字段，默认的维度名（当二维数组中只有两列的时候使用）
}

export default class Chart extends React.PureComponent <ChartProps, {}> {

  state: any
  settingPanel: any

  constructor(props: ChartProps) {
    super(props)
    let {
      chartType,
      data,
      columnNames,
      xOrY,
      xColumn,
      yColumn,
      dimColumns,
      theme,
      componentStyle,
      extraChartOption,
      title,
    } = {
      xOrY: 'x',
      ...props,
    }

    // 计算配置面板中所需要的标签
    const npmOfDataColumn = (data && data.length && data[0].length) ? data[0].length : 0
    const allTags = Array(npmOfDataColumn).fill(0).map((val, index) => ({
      id: index,
      column: (columnNames || [])[index] || `第${(index + 1)}列`,
    }))

    // 初始化 xColumn、yColumn、dimColumns
    if (xOrY === 'x') {
      xColumn = xColumn || 0
      yColumn = yColumn || npmOfDataColumn - 1
    } else {
      yColumn = yColumn || 0
      xColumn = xColumn || npmOfDataColumn - 1
    }

    if (npmOfDataColumn > 2) {
      dimColumns = dimColumns || Array(npmOfDataColumn - 2).fill(0).map((val, index) => index + 1)
    }

    const isFullScreen = false
    this.state = {
      chartType,
      data,
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

  componentWillReceiveProps(changes: ChartProps) {
    this.setState(objectFilter(
      [
        'chartType',
        'data',
        'xColumn',
        'yColumn',
        'dimColumns',
        'xOrY',
        'extraChartOption',
        'componentStyle',
        'title',
      ],
      changes,
    ))
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

  updateChartData = (data: any[][]) => {
    this.setState({
      data,
    })
  }

  closeSettingPanelHandler = (option: any) => {
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

  renderChartPanel(chartData: any, isFullScreen: boolean) {
    const {
      chartType, xOrY, xColumn, yColumn, componentStyle,
      dimColumns, allTags, theme, extraChartOption, title,
    } = this.state
    const needSettingPanel = !(['numeric', 'heatMap'].includes(chartType)) && this.props.needSettingPanel

    return (
      <div className={!isFullScreen ? 'chart-container' : 'chart-container-full-screen'}
           style={{ zIndex: isFullScreen ? 999999999 : 1 }}>
        <OriginChartComponent
          type={chartType}
          chartData={chartData}
          isFullScreen={isFullScreen}
          componentStyle={componentStyle}
          extraChartOption={extraChartOption}
          theme={theme}
          title={title}
        />
        <div className="chart-toolbar">
          {
            !isFullScreen && <div className="fullscreen-btn">
              <Icon type="fullscreen" theme="outlined" onClick={this.openFullScreenHandler}/>
            </div>
          }
          {
            isFullScreen && <div className="fullscreen-btn">
              <Icon type="fullscreen-exit" theme="outlined" onClick={this.closeFullScreenHandler}/>
            </div>
          }
          {
            needSettingPanel && <div className="chart-setting-btn" onClick={this.openSettingPanel}>
              <Icon type="setting"/>
            </div>
          }
          {
            this.props.toolbars && (
              <div className="chart-toolbar-extra">{this.props.toolbars}</div>
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
    const {
      chartType,
      data,
      xOrY,
      xColumn,
      yColumn,
      dimColumns,
      isFullScreen,
    } = this.state

    const {
      location,
      specialAxis,
      description,
      specialScaleArr,
      defaultDimName,
      canDrillDown,
    } = this.props

    // 计算图表数据
    const chartData = getChartData({
      data,
      location,
      specialAxis,
      description,
      defaultDimName,
      specialScaleArr,
      chartType,
      xOrY,
      xColumn,
      yColumn,
      dimColumns,
      canDrillDown,
    })
    return (
      <div>
        {this.renderChartPanel(chartData, false)}
        {isFullScreen && this.renderChartPanel(chartData, true)}
      </div>
    )
  }
}
