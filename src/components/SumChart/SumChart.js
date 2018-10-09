import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './SumChart.css'
import { Popover, Icon } from 'antd'

class SumChart extends React.PureComponent {
  render() {
    const { data } = this.props
    return (
      <div styleName="container">
        <div styleName="title">
          {data.title}
          <Popover
            overlay={
              <Popover.Item>{data.explation || ''}</Popover.Item>
            }
            placement="topLeft"
          >
            <span>
              <i className="iconfont icon-duliangjieshi" />
            </span>
          </Popover>
        </div>
        <div styleName="content">{data.value}</div>
      </div>
    )
  }
}

export default CSSModules(SumChart, styles)
