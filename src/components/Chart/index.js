import React from "react";
import {getChartData} from "../../model";
import OriginChartComponent from "../OriginChartComponent";

export default class Chart extends React.PureComponent {
  
  constructor(props){
    super(props)
    this.state = {
      chart: props.chart || {},
      xColumn: props.xColumn,
      yColumn: props.yColumn,
      DimColumns: props.DimColumns,
    }
  }
  
  componentWillReceiveProps(changes){
    this.setState({
      chart: changes.chart,
      xColumn: changes.xColumn,
      yColumn: changes.yColumn,
      DimColumns: changes.DimColumns,
    })
  }
  
  render(){
    const { chart, xColumn, yColumn, DimColumns } = this.state
    const { chartType } = chart
    const chartData = getChartData(chart, xColumn, yColumn, DimColumns)
    
    return <OriginChartComponent
      type={chartType}
      chartData={chartData}
    />
  }
}
