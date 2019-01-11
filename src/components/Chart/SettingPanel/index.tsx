import * as React from 'react'
import './index.scss'
// @ts-ignore
import { DraggableAreasGroup } from 'react-draggable-tags'
import { Icon, Select } from 'antd'
import 'antd/lib/select/style/css'
import {any} from 'prop-types'

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
  lineHeight: '20px',
  color: '#666666',
  background: 'rgba(255, 255, 255, 0.7)',
}

interface SettingPanelProps {
  chartType: string, // 图表类型
  xOrY: string,
  allTags: any[],
  xColumn: number,
  yColumn: number,
  dimColumns: number[],
  onClose: (result:any)=>void,
}

class SettingPanel extends React.PureComponent<SettingPanelProps, {}> {
  constructor(props:SettingPanelProps) {
    super(props)
    this.constructTagsForDragArea()
  }

  result: any
  addTagToOtherTagCell: (tag:any)=>{}
  settingMask: any

  state = {
    visible: false,
    chartType: this.props.chartType,
    xOrY: this.props.xOrY,
    xTags: Array(),
    yTags: Array(),
    dimColumnsTags: Array(),
    otherTags: Array(),
  }

  onXColumnChange = (tags:any[]) => {
    let xTags
    if (tags.length > 1) {
      // 当存在两个tag时，选取新拖入的tag
      xTags = [tags[1]]
    } else if (tags.length < 1) {
      xTags = []
    } else {
      xTags = [tags[0]]
    }
    this.result.xColumn = xTags[0] ? xTags[0].id : null
    this.setState({ xTags }, () => {
      // 当存在两个tag时，把原来存在的tag放回'所有'框中
      if (tags.length > 1) this.addTagToOtherTagCell(tags[0])
      tags = null
    })
  }

  onYColumnChange = (tags:any[]) => {
    let yTags
    if (tags.length > 1) {
      // 当存在两个tag时，选取新拖入的tag
      yTags = [tags[1]]
    } else if (tags.length < 1) {
      yTags = []
    } else {
      yTags = [tags[0]]
    }
    this.result.yColumn = yTags[0] ? yTags[0].id : null
    this.setState({ yTags }, () => {
      // 当存在两个tag时，把原来存在的tag放回'所有'框中
      if (tags.length > 1) this.addTagToOtherTagCell(tags[0])
      tags = null
    })
  }

  onDimColumnsChange = (tags:any[]) => {
    this.result.dimColumns = tags.map(tag => tag.id)
    this.setState({ dimColumnsTags: tags })
  }

  onChangeChartType = (val:string) => {
    const chartType = val
    let dimColumnsTags = this.state.dimColumnsTags
    this.result.chartType = chartType
    const hasDimColumnsArea = (['line', 'bar', 'stackedBar'].includes(chartType))
    if (!hasDimColumnsArea) {
      this.result.dimColumns = []
      dimColumnsTags.forEach(tag => {
        setTimeout(() => {
          this.addTagToOtherTagCell(tag)
          tag = null
        })
      })
      dimColumnsTags = []
    }
    this.setState({
      chartType,
      dimColumnsTags,
    })
  }

  onChangeXOrY = (val:string) => {
    this.result.xOrY = val
    this.setState({
      xOrY: val,
    })
  }

  constructTagsForDragArea(newProps = this.props) {
    const { allTags, chartType } = newProps
    let { xOrY, xColumn, yColumn, dimColumns } = newProps || this.props
    const [xTags, yTags, dimColumnsTags, otherTags] = [
      Array(), Array(), Array(), Array()
    ]

    xOrY = xOrY || 'x'
    if (!allTags.length) {
      xColumn = null
      yColumn = null
      dimColumns = []
    } else if (allTags.length === 1) {
      if (xColumn === 0) yColumn = null
      else if (yColumn === 0) xColumn = null
      else {
        yColumn = 0
        xColumn = null
      }
      dimColumns = []
    } else {
      if (!xColumn && xColumn !== 0) {
        xColumn = xOrY === 'x' ? 0 : allTags.length - 1
      }
      if (!yColumn && yColumn !== 0) {
        yColumn = xOrY !== 'x' ? 0 : allTags.length - 1
      }
      dimColumns = (!dimColumns || !(dimColumns instanceof Array)) ? [] : dimColumns
    }

    allTags.forEach(tag => {
      const { id } = tag
      if (id === xColumn) {
        xTags.push(tag)
      } else if (id === yColumn) {
        yTags.push(tag)
      } else if (dimColumns.includes(id)) {
        dimColumnsTags.push(tag)
      } else {
        otherTags.push(tag)
      }
    })

    this.setState({ chartType, xOrY, xTags, yTags, dimColumnsTags, otherTags })

    // onClose的时候返回值，配置面板change时同步
    this.result = { chartType, xOrY, xColumn, yColumn, dimColumns }
  }

  openSettingPanel = (newProps:SettingPanelProps) => {
    this.constructTagsForDragArea(newProps)
    this.setState({ visible: true })
  }

  closeSettingPanel = () => {
    this.setState({ visible: false }, () => {
      if (this.props.onClose) {
        this.props.onClose(this.result)
      }
    })
  }

  render() {
    const {
      visible,
      chartType,
      xTags,
      yTags,
      dimColumnsTags,
      otherTags,
      xOrY,
    } = this.state

    return visible &&
      <div>
        <div
          className="setting-mask"
          onClick={this.closeSettingPanel}
          ref={settingMask => this.settingMask = settingMask}
        />
        <div className="setting-panel">
          <div className="setting-panel-close-btn" onClick={this.closeSettingPanel}>
            <Icon type="down" theme="outlined" />
          </div>
          <div className="setting-panel-left">
            <div className="setting-panel-left-cell">
              <span>chartType : </span>
              <Select
                defaultValue={chartType}
                style={{ width: '75%' }}
                onChange={this.onChangeChartType}
              >
                <Select.Option value="line">line</Select.Option>
                <Select.Option value="bar">bar</Select.Option>
                <Select.Option value="pie">pie</Select.Option>
              </Select>
            </div>
            {['line', 'bar', 'stackedBar'].includes(chartType) && (
              <div className="setting-panel-left-cell">
                <span>xOrY : </span>
                <Select
                  defaultValue={xOrY || 'x'}
                  style={{ width: '75%' }}
                  onChange={this.onChangeXOrY}
                >
                  <Select.Option value="x">x</Select.Option>
                  <Select.Option value="y">y</Select.Option>
                </Select>
              </div>
            )}
          </div>
          <div className="setting-panel-right">
            <div className="setting-panel-right-left">
              所有列
              <div className="setting-panel-right-box-large">
                <DraggableArea1
                  initialTags={otherTags}
                  getAddTagFunc={(fn:any) => this.addTagToOtherTagCell = fn}
                  render={({ tag }:any) => (
                    <div style={tagStyle}>
                      {tag.column}
                    </div>
                  )}
                />
              </div>
            </div>
            <div className="setting-panel-right-right">
              { chartType === 'pie' ? '指标列(单选)' : 'X轴列(单选)' }
              <div className="setting-panel-right-box-small">
                <DraggableArea2
                  tags={xTags}
                  render={({ tag }:any) => (
                    <div style={tagStyle}>
                      {tag.column}
                    </div>
                  )}
                  onChange={this.onXColumnChange}
                />
              </div>
              { chartType === 'pie' ? '数值列(单选)' : 'Y轴列(单选)' }
              <div className="setting-panel-right-box-small">
                <DraggableArea3
                  tags={yTags}
                  render={({ tag }:any) => (
                    <div style={tagStyle}>
                      {tag.column}
                    </div>
                  )}
                  onChange={this.onYColumnChange}
                />
              </div>
              {['line', 'bar', 'stackedBar'].includes(chartType) && '合并列' }
              {['line', 'bar', 'stackedBar'].includes(chartType) &&
                <div className="setting-panel-right-box-median">
                  <DraggableArea4
                    tags={dimColumnsTags}
                    render={({ tag }:any) => (
                      <div style={tagStyle}>
                        {tag.column}
                      </div>
                    )}
                    onChange={this.onDimColumnsChange}
                  />
                </div>
              }
            </div>
          </div>
        </div>
      </div>
  }
}

export default SettingPanel

