/*
 * 导出文件
 * path    服务地址
 * params  参数
 */
export function exportFile(path, params) {
  let payload = ''
  let first = true
  for (const key in params) {
    if (first) {
      payload = `${key}=${params[key]}`
      first = false
    } else {
      payload += `&${key}=${params[key]}`
    }
  }
  window.open(`${process.env.BASE_API}${path}?${payload}`)
}
