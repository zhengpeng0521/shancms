import moment from 'moment'
/*
 * 对象数组按某一属性排序(数据内容是时间)
 */
export function objListSortOfTime(arr, sortField, format) {
  if (arr && arr.length > 0) {
    const new_arr = arr.sort(function(obj1, obj2) {
      const str1 = obj1[sortField]
      const str2 = obj2[sortField]
      const time1 = moment(str1, format)
      const time2 = moment(str2, format)
      return time1 - time2
    })
    return new_arr
  } else {
    return arr
  }
}

export function contains(arr, obj) {
  let i = arr.length
  while (i--) {
    if (arr[i] === obj) {
      return true
    }
  }
  return false
}

/*
 * 深拷贝数组和对象
 */
export function deepCopy(obj) {
  let newObj
  if (typeof obj === 'object') {
    // 判断对象或数组
    newObj = obj.constructor === Array ? [] : {}
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        newObj[key] = deepCopy(obj[key])
      } else {
        newObj[key] = obj[key]
      }
    }
  } else {
    newObj = obj
  }
  return newObj
}

/*
 * 对象数组按某一属性排序(数据内容是int)
 */
export function sortByObj(arr, sortField) {
  const new_arr = arr.sort(function(obj1, obj2) {
    const num1 = obj1[sortField] || 0
    const num2 = obj2[sortField] || 0
    return parseInt(num1 + '') - parseInt(num2 + '')
  })
  return new_arr
}
