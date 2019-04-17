import request from '@/utils/request'

// 查询跟进记录
export function recordQuery(data) {
  return request({
    url: `${window.SS_CRM}/crm/commRecord/recordQuery`,
    method: 'post',
    data
  })
}
// 查询下属
export async function querySubName(params) {
  return request({
    url: `${window.SYS_URL}/sysBase/tenantUser/summaryQueryByIds`,
    method: 'post',
    data: params
  })
}
// 跟进方式/跟进状态
export function dictGetByKey(data) {
  return request({
    url: `${window.SYS_URL}/sysBase/dict/dictGetByKey`,
    method: 'post',
    data
  })
}
// 获取信息
export function getMsg(data) {
  return request({
    url: `${window.SS_CRM}/crm/commRecord/getMsg`,
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
// 潜在学员id获取家长列表
export function getParentByStu(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/clue/getParentByStu`,
    method: 'post',
    data
  })
}
// 在读学员id获取家长列表
export function parentSummary(data) {
  return request({
    url: `${window.SS_CRM}/stu/parent/parentSummary`,
    method: 'post',
    data
  })
}
// 新建
export function create(data) {
  return request({
    url: `${window.SS_CRM}/crm/commRecord/create`,
    method: 'post',
    data
  })
}
// 修改
export function update(data) {
  return request({
    url: `${window.SS_CRM}/crm/commRecord/update`,
    method: 'post',
    data
  })
}
// 删除
export function Delete(data) {
  return request({
    url: `${window.SS_CRM}/crm/commRecord/delete`,
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
// 员工详情查询
export function detailById(data) {
  return request({
    url: `${window.SYS_URL}/sysBase/tenantUser/detailById`,
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
