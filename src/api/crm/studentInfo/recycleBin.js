import request from '@/utils/request'

// 查询回收站学员记录
export function queryClueStuList(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/clue/queryClueStuList`,
    method: 'post',
    data
  })
}
// 一级来源/跟进状态/二级来源
export function dictGetByKey(data) {
  return request({
    url: `${window.SYS_URL}/sysBase/dict/dictGetByKey`,
    method: 'post',
    data
  })
}
// 放入回收站/彻底删除/返回公海池
export function recycle(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/clue/recycle`,
    method: 'post',
    data
  })
}
