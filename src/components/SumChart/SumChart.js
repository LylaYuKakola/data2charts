import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './SumChart.css'
import 'antd/lib/popover/style/css'
import 'antd/lib/icon/style/css'

class SumChart extends React.PureComponent {
  render() {
    const { data } = this.props
    return (
      <div styleName="container">
        <div styleName="content">{data.value}</div>
      </div>
    )
  }
}

export default CSSModules(SumChart, styles)
