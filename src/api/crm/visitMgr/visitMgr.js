import request from '@/utils/request'

// 查询到访记录
export function queryVisitRecord(data) {
  return request({
    url: `${window.SS_CRM}/crm/visit/queryVisitRecord`,
    method: 'post',
    data
  })
}
// 更新到访记录
export function updateVisitStatus(data) {
  return request({
    url: `${window.SS_CRM}/crm/visit/updateVisitStatus`,
    method: 'post',
    data
  })
}
// 新增到访记录
export function addVisitRecord(data) {
  return request({
    url: `${window.SS_CRM}/crm/visit/addVisitRecord`,
    method: 'post',
    data
  })
}
// 查询到访记录详情
export function getVisitRecord(data) {
  return request({
    url: `${window.SS_CRM}/crm/visit/getVisitRecord`,
    method: 'post',
    data
  })
}
// 编辑到访记录
export function updateVisitRecord(data) {
  return request({
    url: `${window.SS_CRM}/crm/visit/updateVisitRecord`,
    method: 'post',
    data
  })
}
// 名单列表
export function leadsSummary(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/clue/leadsSummary`,
    method: 'post',
    data
  })
}
// 学员列表
export function stusOfUser(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/stu/stusOfUser`,
    method: 'post',
    data
  })
}
// 根据ID查询名单学员的详细信息
export function getSingleClueStu(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/clue/getSingleClueStu`,
    method: 'post',
    data
  })
}
// 在读学员详情
export function getStuMsg(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/stu/getStuMsg`,
    method: 'post',
    data
  })
}
