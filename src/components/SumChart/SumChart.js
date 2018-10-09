import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './SumChart.css'
import { Popover, Icon } from 'antd'
import 'antd/lib/popover/style/css'
import 'antd/lib/icon/style/css'

class SumChart extends React.PureComponent {
  render() {
    const { data } = this.props
    return (
      <div styleName="container">
        <div styleName="title">
          {data.title}
          <Popover placement="rightTop" content={data.description || ''} trigger="click">
            <span>
              <Icon type="question-circle" theme="outlined" />
            </span>
          </Popover>
        </div>
        <div styleName="content">{data.value}</div>
      </div>
    )
  }
}

export default CSSModules(SumChart, styles)
