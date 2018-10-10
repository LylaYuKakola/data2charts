import React from 'react'
import CSSModules from 'react-css-modules'
import { Icon } from 'antd'
import 'antd/lib/icon/style/css'
import 'antd/lib/drawer/style/css'
import styles from './Chart.css'
import { getChartData } from '../../model'
import OriginChartComponent from '../OriginChartComponent'
import { DraggableAreasGroup } from 'react-draggable-tags'

const group = new DraggableAreasGroup()
const DraggableArea1 = group.addArea()
const DraggableArea2 = group.addArea()
const DraggableArea3 = group.addArea()
const DraggableArea4 = group.addArea()

const tagStyle = {
  margin: '3px',
  fontSize: '13px',
  border: '1px dashed #cccccc',
  borderRadius: '4px',
  padding: '0 8px',
  lineHeight: '30px',
  color: '#666666',
  background: 'rgba(255, 255, 255, 0.7)',
}

/**
 * 2018/10/10 yurt
 * 当前主要问题为阻止了props的更新，所以暂时只能通过组件内部去更改图表和配置
 * 1. 是否需要从外部修改
 * 2. 从外部修改是否只提供一个api方法方便组件状态管理（影响组件扩展性）
 */
class Chart extends React.PureComponent {
  constructor(props) {
    super(props)

    let { xColumn, yColumn, dimColumns, xOrY } = props
    const { chart } = props

    const xTags = []
    const yTags = []
    const dimTags = []

    // 初始化 xOrY，xColumn，yColumn，dimColumns，xTags，yTags，dimTags
    if (chart || chart.data) {
      const length = props.chart.data[0].length
      xOrY = xOrY || 'x'
      if (!xColumn && xColumn !== 0) {
        xColumn = xOrY === 'x' ? 0 : length - 1
      }
      if (!yColumn && yColumn !== 0) {
        yColumn = xOrY !== 'x' ? 0 : length - 1
      }
      dimColumns = (!dimColumns || !(dimColumns instanceof Array)) ? [] : dimColumns

      for (let i = 0; i < length; i++) {
        const _obj = { id: i, column: i + 1 }
        if (xColumn === i) {
          xTags.push(_obj)
        } else if (yColumn === i) {
          yTags.push(_obj)
        } else if (dimColumns.includes(i)) {
          dimTags.push(_obj)
        }
      }
    }

    // 计算'所有列'中的tag（因为配置的时dragGroup的initialTags，所以只在初始化时起作用）
    const allTags = []
    chart.data[0].forEach((val, index) => {
      if (index !== xColumn &&
        index !== yColumn &&
        !(dimColumns.includes(index))) {
        allTags.push({ id: index, column: index + 1 })
      }
    })
    // 初始化使用，不放在state中管理
    this.allTags = allTags

    this.state = {
      drawerVisible: false,
      chartType: props.chartType,
      chart: props.chart || {},
      xColumn,
      yColumn,
      dimColumns,
      xOrY: props.xOrY,
      xTags,
      yTags,
      dimTags,
    }
  }

  onXColumnChange = tags => {
    let xColumn
    let xTags
    if (tags.length > 1) {
      // 当存在两个tag时，选取新拖入的tag
      xColumn = tags[1].id
      xTags = [tags[1]]
    } else if (tags.length < 1) {
      xColumn = null
      xTags = []
    } else {
      xColumn = tags[0].id
      xTags = [tags[0]]
    }
    this.setState({ xColumn, xTags }, () => {
      // 当存在两个tag时，把原来存在的tag放回'所有'框中
      if (tags.length > 1) this.addTagToAllTagCell(tags[0])
      tags = null
    })
  }

  onYColumnChange = tags => {
    let yColumn
    let yTags
    if (tags.length > 1) {
      // 当存在两个tag时，选取新拖入的tag
      yColumn = tags[1].id
      yTags = [tags[1]]
    } else if (tags.length < 1) {
      yColumn = null
      yTags = []
    } else {
      yColumn = tags[0].id
      yTags = [tags[0]]
    }
    this.setState({ yColumn, yTags }, () => {
      // 当存在两个tag时，把原来存在的tag放回'所有'框中
      if (tags.length > 1) this.addTagToAllTagCell(tags[0])
      tags = null
    })
  }

  onDimColumnsChange = tags => {
    const dimColumns = []
    tags.forEach(element => {
      dimColumns.push(element.id)
    })
    this.setState({ dimColumns, dimTags: tags })
  }

  closeDrawer = () => {
    this.settingDrawer.removeAttribute('style')
    this.settingMask.removeAttribute('style')
  }

  showDrawer = () => {
    this.settingDrawer.setAttribute('style', 'transform:translate(0)')
    this.settingMask.setAttribute('style', 'display:block')
  };

  render() {
    const {
      chart,
      chartType,
      xOrY,
      xColumn,
      yColumn,
      dimColumns,
      xTags,
      yTags,
      dimTags,
    } = this.state

    // 计算图表数据
    const chartData = getChartData(chart, chartType, xOrY, xColumn, yColumn, dimColumns)

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
          <div styleName="chart-setting-panel">
            <div styleName="chart-setting-panel-left">
              所有列
              <div styleName="chart-setting-panel-box-large">
                <DraggableArea1
                  initialTags={this.allTags}
                  render={({ tag }) => (
                    <div style={tagStyle}>
                      第{tag.column}列
                    </div>
                  )}
                  getAddTagFunc={addTagToAllTagCell => this.addTagToAllTagCell = addTagToAllTagCell}
                />
              </div>
            </div>
            <div styleName="chart-setting-panel-right">
              X轴
              <div styleName="chart-setting-panel-box-small">
                <DraggableArea2
                  tags={xTags}
                  render={({ tag }) => (
                    <div style={tagStyle}>
                      第{tag.column}列
                    </div>
                  )}
                  onChange={this.onXColumnChange}
                />
              </div>
              y轴
              <div styleName="chart-setting-panel-box-small">
                <DraggableArea3
                  tags={yTags}
                  render={({ tag }) => (
                    <div style={tagStyle}>
                      第{tag.column}列
                    </div>
                  )}
                  onChange={this.onYColumnChange}
                />
              </div>
              合并列
              <div styleName="chart-setting-panel-box-median">
                <DraggableArea4
                  tags={dimTags}
                  render={({ tag }) => (
                    <div style={tagStyle}>
                      第{tag.column}列
                    </div>
                  )}
                  onChange={this.onDimColumnsChange}
                />
              </div>
            </div>
          </div>
          <div>
            <div styleName="chart-setting-close-btn" onClick={this.closeDrawer}>
              <Icon type="right" theme="outlined" />
            </div>
          </div>
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

