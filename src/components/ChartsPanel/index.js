import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './ChartsPanel.css'
import Chart from '../Chart'
import { DraggableAreasGroup } from 'react-draggable-tags'

const group = new DraggableAreasGroup()
const DraggableArea1 = group.addArea()

/**
 * chart组合面板
 */
class ChartsPanel extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return null
  }
}

export default CSSModules(ChartsPanel, styles)
