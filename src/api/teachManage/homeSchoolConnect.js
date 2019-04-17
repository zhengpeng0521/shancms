import request from '@/utils/request'

// 学员作品列表
export function queryStuWork(data) {
  return request({
    url: `${window.SS_CRM}/cerp/stuWork/query`,
    method: 'post',
    data
  })
}
// 获取在读学员列表
export function stuSummaryQuery(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/stu/summaryQuery`,
    method: 'post',
    data
  })
}
// 删除学员作品
export function deleteStuWork(data) {
  return request({
    url: `${window.SS_CRM}/cerp/stuWork/delete`,
    method: 'post',
    data
  })
}
// 修改学员作品
export function updateStuWork(data) {
  return request({
    url: `${window.SS_CRM}/cerp/stuWork/update`,
    method: 'post',
    data
  })
}
// 创建学员作品
export function createStuWork(data) {
  return request({
    url: `${window.SS_CRM}/cerp/stuWork/create`,
    method: 'post',
    data
  })
}
// 作品详情
export function stuWorkDetail(data) {
  return request({
    url: `${window.SS_CRM}/cerp/stuWork/detail`,
    method: 'post',
    data
  })
}
// 作品标签列表
export function getWorkTagList(data) {
  return request({
    url: `${window.SS_CRM}/cerp/stuwork/getWorkTagList`,
    method: 'post',
    data
  })
}
// 作品标签的新建/修改
export function creatWorkTag(data) {
  return request({
    url: `${window.SS_CRM}/cerp/stuwork/creatWorkTag`,
    method: 'post',
    data
  })
}
// 作品标签的删除
export function deleWorkTag(data) {
  return request({
    url: `${window.SS_CRM}/cerp/stuwork/deleWorkTag`,
    method: 'post',
    data
  })
}
// 课程摘要查询
export function courseSummaryQuery(data) {
  return request({
    url: `${window.SS_CRM}/cerp/course/summaryQuery`,
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
// 家校互评列表
export function getElvationList(data) {
  return request({
    url: `${window.SS_CRM}/cerp/homeschool/cpQuery`,
    method: 'post',
    data
  })
}
// 查询排课对应的教师评价和家长评价
export function commAllQuery(data) {
  return request({
    url: `${window.SS_CRM}/cerp/homeschool/commAllQuery`,
    method: 'post',
    data
  })
}
// 老师评价修改
export function tcrCommUpdate(data) {
  return request({
    url: `${window.SS_CRM}/cerp/homeschool/tcrCommUpdate`,
    method: 'post',
    data
  })
}
// 上课内容修改
export function cpContentUpdate(data) {
  return request({
    url: `${window.SS_CRM}/cerp/homeschool/cpContentUpdate`,
    method: 'post',
    data
  })
}
