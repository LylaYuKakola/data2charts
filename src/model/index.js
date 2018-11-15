/**
 * 按照二维数据的逻辑进行数据封装
 * 1. 二维数组第一列为默认的指标维度
 * 2. 二维数组的最后一列为具体反映到图表上的值
 * 3. 中间几列为分组，进行条件选择
 */

/**
 * 计算图表数据
 * @param chart 图表配置对象
 * @param chartType 图表类型
 * @param xOrY x/y轴为基轴，针对直角坐标系图表
 * @param xColumn x轴对应的列
 * @param yColumn y轴对应的列
 * @param dimColumns 分组对应的列
 * @return {*}
 */
export function getChartData(chart, chartType, xOrY, xColumn, yColumn, dimColumns) {
  /** ******************* chart对象需要满足以下几个属性 ****************** */
  /*  1. data（必要）二维数组 table数据格式 包含chart所需要的数据            */
  /*  3. location（非必要）地图类型时指示显示的省份地址                      */
  /*  4. specialAxis（非必要）直角坐标系图表时修复不完整的坐标值，一般为日期   */
  /*  5. description（非必要）numeric时描述当前的描述详情                   */
  /*  6. defaultDimName（非必要）当只有一条折线或者一组柱状图时描述默认维度值  */
  /*  7. specialScaleArr（非必要）多轴时的第二条数据轴的值的集合             */
  /** ***************************************************************** */
  const {
    data,
    location,
    specialAxis,
    description,
    defaultDimName,
    specialScaleArr,
  } = { description: '', defaultDimName: '', ...chart }

  xOrY = xOrY || 'x'

  // numeric 只显示值
  if (chartType === 'numeric') {
    let value
    if (!data || !data[0] || (!data[0][0] && Number(data[0][0]) !== 0)) {
      value = '--'
    } else {
      value = String(data[0][0]).includes('%') > -1 ? data[0][0] : Number(data[0][0])
    }
    return { value, description }
  }

  // 热力图特殊处理
  if (chartType === 'heatMap') {
    const area = location
    const legendData = [defaultDimName]

    const originDataTree = Object.create(null)

    data.forEach(row => {
      let currentObject = originDataTree
      const rowLenth = row.length
      row.forEach((val, index) => {
        if (rowLenth === (index + 1)) {
          currentObject.value = `**|${val}|**`
          return
        }
        currentObject[val] = currentObject[val] || Object.create(null)
        currentObject = currentObject[val]
      })
    })

    return { area, legendData, originDataTree, canDrillDown: chart.canDrillDown }
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
    if (!xColumn && xColumn !== 0) {
      xColumn = xOrY === 'x' ? 0 : data[0].length - 1
    }
    if (!yColumn && yColumn !== 0) {
      yColumn = xOrY !== 'x' ? 0 : data[0].length - 1
    }
    if (!dimColumns || !(dimColumns instanceof Array)) {
      dimColumns = []
      for (let i = 1; i < data[0].length - 1; i++) {
        dimColumns.push(i)
      }
    }
  }

  // 饼图，只需要配置xColumn和yColumn，xColumn为饼图数据的键，yColumn为饼图数据的值
  // 需要将dimColumns置空
  if (chartType === 'pie') {
    dimColumns = []
    if (xOrY !== 'x') [xColumn, yColumn] = [yColumn, xColumn]
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
      data: baseLineArr.map(name => {
        let value = dataMap.get(name)
        value = (!value && value !== 0) ? '-' : value
        if (chartType === 'pie') {
          return { name, value }
        }
        return value
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
          let value = dataMap.get(bLineData + dim)
          value = (!value && value !== 0) ? '-' : value
          return value
        }),
      })
    })
  }

  if (chartType === 'pie') {
    return { legendData: baseLineArr, sourceData }
  }

  if (chartType === 'line') {
    const legendData = dims
    const baseAxisData = baseLineArr

    // 是否为特殊的y轴
    if (specialScaleArr) {
      const valueAxisData = specialScaleArr
      const [valueAxisData0] = specialScaleArr
      sourceData.forEach(source => {
        if (source.name.includes(valueAxisData0)) source.yAxisIndex = 0
        else source.yAxisIndex = 1
      })
      return { legendData, baseAxisData, valueAxisData, sourceData, xOrY }
    }

    return { legendData, baseAxisData, sourceData, xOrY }
  }

  if (['bar', 'stackedBar'].includes(chartType)) {
    const legendData = dims
    let baseAxisData = baseLineArr
    // 为了应付所谓的前端排序 又得把之前的逻辑毁了
    if (sourceData.length === 1 && legendData.length === 1) {
      baseAxisData = []
      const mapForSort = []
      sourceData[0].data.forEach((val, index) => {
        mapForSort.push([baseLineArr[index], val])
      })
      sourceData[0].data = []
      mapForSort.sort((prev, current) => {
        return prev[1] > current[1] ? -1 : 1
      }).forEach(val => {
        baseAxisData.push(val[0])
        sourceData[0].data.push(val[1])
      })
    }

    return { legendData, baseAxisData, sourceData, xOrY }
  }

  return {}
}
