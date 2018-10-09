import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './StoreTarget.css'
import { Popover, Icon } from 'antd'
import explation from './explation.json'

class StoreTarget extends React.PureComponent {
  render() {
    const { data } = this.props
    return (
      <div>
        <div styleName="title">{data.title}</div>
        <div styleName="content">
          <ul className="clearfix">
            {
              data.sourceData.map(item => (
                <li key={item.key}>
                  <div styleName="content-list-d1">
                    {item.displayName}
                    {
                      item.displayName && explation[item.displayName] &&
                      <Popover
                        overlay={
                          <Popover.Item>{explation[item.displayName]}</Popover.Item>
                        }
                        placement="topLeft"
                      >
                        <span>
                          <i className="iconfont icon-duliangjieshi" />
                        </span>
                      </Popover>
                    }
                  </div>
                  <div styleName="content-list-d2">{item.value}</div>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    )
  }
}

export default CSSModules(StoreTarget, styles)
