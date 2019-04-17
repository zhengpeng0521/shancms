import request from '@/utils/request'

// 查询排课列表
export function queryArrangeList(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cp/query`,
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
// 教室列表
export function queryClassroomList(data) {
  return request({
    url: `${window.SS_CRM}/sysBase/cerp/classroom/summaryQuery`,
    method: 'post',
    data
  })
}
// 课程主题摘要查询
export function courseThemeQuery(data) {
  return request({
    url: `${window.SS_CRM}/cerp/coursetheme/summayQuery`,
    method: 'post',
    data
  })
}
// 创建排课
export function createArrange(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cp/create`,
    method: 'post',
    data
  })
}
// 删除排课
export function deleteArrange(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cp/delete`,
    method: 'post',
    data
  })
}
// 编辑排课信息
export function mainQueryBack(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cp/mainQueryBack`,
    method: 'post',
    data
  })
}
// 修改排课保存
export function updateArrange(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cp/update`,
    method: 'post',
    data
  })
}
// 课程明细摘要查询
export function queryCourseById(data) {
  return request({
    url: `${window.SS_CRM}/cerp/course/queryById`,
    method: 'post',
    data
  })
}
// 根据日期获取节假日
export function listByTime(data) {
  return request({
    url: `${window.SYS_URL}/sysBase/holiday/listByTime`,
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
// 获取学员精确列表
export function queryCRMStuList(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/stu/queryCRMStuList`,
    method: 'post',
    data
  })
}
// 学员名单查询
export function queryClueStuList(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/clue/queryClueStuList`,
    method: 'post',
    data
  })
}
// 创建约课
export function stuCreateOrMul(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cpbook/stuCreateOrMul`,
    method: 'post',
    data
  })
}
// 获取班级摘要列表
export function classGradeSummary(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cls/classGradeSummary`,
    method: 'post',
    data
  })
}
// 查询排课批量复制列表
export function batchCopyQuery(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cp/batchCopyQuery`,
    method: 'post',
    data
  })
}
// 批量复制排课
export function batchCopyCoursePlan(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cp/batchCopyCoursePlan`,
    method: 'post',
    data
  })
}
// 学员名单摘要查询
export function clueStuSummaryQuery(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/clue/ClueStuSummaryQuery`,
    method: 'post',
    data
  })
}
// 是否是节假日
export function excistHoliday(data) {
  return request({
    url: `${window.SYS_URL}/sysBase/holiday/excistHoliday`,
    method: 'post',
    data
  })
}
