import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './StoreDetail.css'

class StoreDetail extends React.PureComponent {
  render() {
    const { data } = this.props
    return (
      <div styleName="container">
        <div styleName="title">{data.title}</div>
        <div styleName="content">
          <ul>
            <li><span><i className="iconfont icon-CombinedShape3" /></span>{data.name} : {data.type} ({data.id})</li>
            <li><span><i className="iconfont icon-Shape1" /></span>{data.phone}</li>
            {/* <li><span>i</span>{data.addresss || ''}</li> */}
          </ul>
        </div>
      </div>
    )
  }
}

export default CSSModules(StoreDetail, styles)
