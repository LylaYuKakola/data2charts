/**
 * 按照二维数据的逻辑进行数据封装
 *
 * 1. 二维数组第一列为默认的指标维度
 * 2. 二维数组的最后一列为具体反映到图表上的值
 * 3. 中间几列为分组，进行条件选择
 *
 * 条件选择分为两种
 * 1. 按照某列分组
 * 2. 某几列进行排列组合，顺序按照选项中的选择顺序
 *
 * 问题：
 * 1. 日期的补0操作
 * 2. 直角坐标系和饼图的切换
 * 3. 数据类型的控制（主要为最后一列）
 */

import provinces from '../files/provinces.json'

export function getChartData(chart, xColumn, yColumn, dimColumns) {
  
  /********************* chart对象需要满足以下几个属性 *******************/
  /* 1. data（必要）二维数组 table数据格式 包含chart所需要的数据           */
  /* 2. chartType（必要）图表类型                                       */
  /* 3. title（非必要）图表标题 @TODO 暂时无法处理复杂的title展示          */
  /* 4. location（非必要）地图类型时指示显示的省份地址                     */
  /* 5. specialAxis（非必要）直角坐标系图表时修复不完整的坐标值，一般为日期  */
  /* 6. description（非必要）numeric时描述当前的描述详情                  */
  /* 7. defaultDimName（非必要）当只有一条折线或者一组柱状图时描述默认维度值 */
  /* 8. specialScaleArr（非必要）多轴时的第二条数据轴的值的集合            */
  /* 9. xOrY（非必要）x/y轴为基轴 默认为x                                */
  /********************************************************************/
  const {
    data,
    chartType,
    title,
    location,
    specialAxis,
    description,
    defaultDimName,
    specialScaleArr,
    xOrY,
  } = {...chart, title: '', description: '', defaultDimName: '', xOrY: 'x'}
  
  // numeric 只显示值
  if (chartType === 'numeric') {
    const explation = description || ''
    let value
    if (!data || !data[0] || !data[0][0]) {
      value = '--'
    } else {
      value = data[0][0].indexOf('%') > -1 ? data[0][0] : formatNumber(Number(data[0][0]))
    }
    return { title, value, explation }
  }
  
  // 热力图特殊处理
  if (chartType === 'heatMap') {
    const area = provinces[location || '全国']
    const legendData = [defaultDimName]
    let maxData = 0
    const sourceData = [{
      name: defaultDimName,
      data: data.map(row => {
        const [name, value] = row
        if (maxData < value) maxData = value
        return { name, value }
      }),
    }]
    return { title, maxData, area, legendData, sourceData }
  }
  
  // 判断data为空，则直接显示空数据
  if (!data || !data.length || !data[0].length) {
    return { sourceData: [] }
  }
  
  // 构建data的索引
  if (data[0].length === 1) {
    if (xColumn === 0) yColumn = -1
    else if (yColumn === 0) xColumn = -1
    else {
      yColumn = 0
      xColumn = -1
    }
    dimColumns = []
  } else {
    xColumn = xColumn || 0
    yColumn = yColumn || data[0].length - 1
    dimColumns = (!dimColumns || !(dimColumns instanceof Array)) ? [] : dimColumns
  }
  
  let dimValues = Array(dimColumns.length)
  let baseLineArr = new Set()
  
  const dataMap = new Map()
  data.forEach((row, index) => {
    let xColumnValue = ''
    let yColumnValue = ''
    if (xColumn === -1) {
      xColumnValue = index
      yColumnValue = row[0]
    } else if (yColumn === -1) {
      xColumnValue = row[0]
      yColumnValue = -1
    } else {
      xColumnValue = row[xColumn]
      yColumnValue = row[yColumn]
    }
    
    // 构造 key-value 的数据map
    let keyInRow = ''
    let valueInRow
    if (xOrY === 'x') {
      keyInRow = xColumnValue + dimColumns.map(_val => row[_val] || '').join('')
      valueInRow = Number(yColumnValue) || 0
      dataMap.set(keyInRow, valueInRow + (dataMap.get(keyInRow) || 0))
      baseLineArr.add(xColumnValue)
    } else {
      keyInRow = yColumnValue + dimColumns.map(_val => row[_val] || '').join('')
      valueInRow = Number(xColumnValue) || 0
      dataMap.set(keyInRow, valueInRow + (dataMap.get(keyInRow) || 0))
      baseLineArr.add(yColumnValue)
    }
    
    // 顺便构造维度数组
    dimColumns.forEach((_val, _index) => {
      if (!dimValues[_index]) dimValues[_index] = new Set()
      dimValues[_index].add(row[_val])
    })
  })
  
  baseLineArr = specialAxis || [...baseLineArr]
  const dims = []
  const sourceData = []
  if (!dimValues.length) {
    // 单个维度
    dims.push(defaultDimName)
    sourceData.push({
      name: defaultDimName,
      data: baseLineArr.map(bLineData => {
        return dataMap.get(bLineData) || 0
      }),
    })
  } else {
    // 组合维度
    dimValues = dimValues.map(val => [...val])
    const combineArr = (baseTowDimsArr, currentStr = '', currentIndex = 0) => {
      const currentOneDimArr = baseTowDimsArr[currentIndex]
      if (!currentOneDimArr || !currentOneDimArr.length) {
        dims.push(currentStr)
      } else {
        currentOneDimArr.forEach(val => {
          combineArr(baseTowDimsArr, currentStr + String(val), currentIndex + 1)
        })
      }
    }
    combineArr(dimValues)
    dims.forEach(dim => {
      sourceData.push({
        name: dim,
        data: baseLineArr.map(bLineData => {
          return dataMap.get(bLineData + dim) || 0
        }),
      })
    })
  }
  
  if (chartType === 'line') {
    const legendData = dims
    const xAxisData = baseLineArr
    
    // 是否为特殊的y轴
    if (specialScaleArr) {
      const yAxisData = specialScaleArr
      const [yAxisData0] = specialScaleArr
      sourceData.forEach(source => {
        if (source.name.includes(yAxisData0)) source.yAxisIndex = 0
        else source.yAxisIndex = 1
      })
      return { title, legendData, xAxisData, yAxisData, sourceData }
    }
    
    return { title, legendData, xAxisData, sourceData }
  }
  
  if (['bar', 'stackedBar'].includes(chartType)) {
    const legendData = dims
    let yAxisData = baseLineArr
    // 为了应付所谓的前端排序 又得把之前的逻辑毁了
    if (sourceData.length === 1 && legendData.length === 1) {
      yAxisData = []
      const mapForSort = []
      sourceData[0].data.forEach((val, index) => {
        mapForSort.push([baseLineArr[index], val])
      })
      sourceData[0].data = []
      mapForSort.sort((prev, current) => {
        return prev[1] > current[1] ? -1 : 1
      }).forEach(val => {
        yAxisData.push(val[0])
        sourceData[0].data.push(val[1])
      })
    }
    
    return { title, legendData, yAxisData, sourceData }
  }
  
  return {}
}
