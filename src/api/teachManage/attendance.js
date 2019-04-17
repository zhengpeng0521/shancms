import request from '@/utils/request'

// 查询考勤列表
export function checkQuery(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cpbook/checkQuery`,
    method: 'post',
    data
  })
}
// 查询考勤对应明细
export function signQuery(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cpbook/signQuery`,
    method: 'post',
    data
  })
}
// 员工摘要查询
export function tenantUserSummaryQuery(data) {
  return request({
    url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`,
    method: 'post',
    data
  })
}
// 查询排课打印内容
export function printQuery(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cp/printQuery`,
    method: 'post',
    data
  })
}
// 查询请假列表
export function queryVacationList(data) {
  return request({
    url: `${window.SS_CRM}/cerp/vacation/queryVacationList`,
    method: 'post',
    data
  })
}
// 请假审核
export function vacationAudit(data) {
  return request({
    url: `${window.SS_CRM}/cerp/vacation/vacationAudit`,
    method: 'post',
    data
  })
}
// 查询约课列表
export function queryArrageCourseList(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cp/query`,
    method: 'post',
    data
  })
}
// 批量考勤
export function batchStuSign(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cpbook/batchStuSign`,
    method: 'post',
    data
  })
}
// 查询签到记录
export function querySignList(data) {
  return request({
    url: `${window.SS_CRM}/crm/sign/query`,
    method: 'post',
    data
  })
}
// 签到记录撤销
export function updateStatus(data) {
  return request({
    url: `${window.SS_CRM}/crm/sign/updateStatus`,
    method: 'post',
    data
  })
}
