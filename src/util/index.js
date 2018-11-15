
const isArray = target => Reflect.apply(Object.prototype.toString, target, []) === '[object Array]'
const isObject = target => Reflect.apply(Object.prototype.toString, target, []) === '[object Object]'
const isNormalValue = target => !isArray(target) && !isObject(target)

/**
 * 深度克隆，针对chartoption，数组的情况下进行合并
 * @param origin
 * @param current
 */
export function deepCloneForChartOption (origin, current) {
  if (!origin) return current
  if (!current) return origin

  if (isNormalValue(current)) return current
  if (isArray(current) && !isArray(origin)) return [...current]
  if (isArray(current) && isArray(origin)) return [...origin, ...current]
  if (isObject(current) && !isObject(origin)) return { ...current }
  if (isObject(current) && isObject(origin)) {
    Object.keys(current).forEach(key => {
      origin[key] = deepCloneForChartOption(origin[key], current[key])
    })
    return origin
  }

  return current
}

