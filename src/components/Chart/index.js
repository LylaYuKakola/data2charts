import React from "react";
import CSSModules from 'react-css-modules'
import { Icon } from 'antd'
import 'antd/lib/icon/style/css'
import styles from './Chart.css'
import { getChartData } from "../../model";
import OriginChartComponent from "../OriginChartComponent";
import { DraggableAreasGroup } from 'react-draggable-tags';
import { DraggableArea } from 'react-draggable-tags';
import './Chart.css'

const initialTags = [
  { id: 1, name: 'apple' }, { id: 2, name: 'watermelon' }, { id: 3, name: 'banana' },
  { id: 4, name: 'lemon' }, { id: 5, name: 'orange' }, { id: 6, name: 'grape' },
  { id: 7, name: 'strawberry' }, { id: 8, name: 'cherry' }, { id: 9, name: 'peach' }];


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

  onXColumnChange = (value) => {
    console.log(value)
  }

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
          <div styleName="chart-setting-panel">
            <div styleName="chart-setting-panel-left">
              所有列
              <div styleName="chart-setting-panel-box-large">
                hi
              </div>
            </div>
            <div styleName="chart-setting-panel-right">
              X轴
              <div styleName="chart-setting-panel-box-small">
                hi
              </div>
              y轴
              <div styleName="chart-setting-panel-box-small">
                hi
              </div>
              合并列
              <div styleName="chart-setting-panel-box-median">
                hi
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
        {/* <div styleName="Simple">
          <DraggableArea
            initialTags={initialTags}
            render={({ tag }) => (
              <div style={tagStyle}>
                {tag.name}
              </div>
            )}
            onChange={(tags) => console.log(tags)}
          />
        </div> */}
      </div>
    )
  }
}
export default CSSModules(Chart, styles)

