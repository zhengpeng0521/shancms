import request from '@/utils/request'

// 查询班级列表
export function queryClassGradeList(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cls/queryClassGradeList`,
    method: 'post',
    data
  })
}
// 新增班级
export function addClassGrade(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cls/addClassGrade`,
    method: 'post',
    data
  })
}
// 编辑班级
export function updateClassGrade(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cls/updateClassGrade`,
    method: 'post',
    data
  })
}
// 删除班级
export function deleteClassGrade(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cls/deleteClassGrade`,
    method: 'post',
    data
  })
}
// 结业班级
export function closeGrade(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cls/close`,
    method: 'post',
    data
  })
}
// 班级详情
export function getClassGradeDetail(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cls/getClassGradeDetail`,
    method: 'post',
    data
  })
}
// 查询班级学员
export function queryClassStuList(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cls/queryClassStuList`,
    method: 'post',
    data
  })
}
// 新增班级学员
export function addClassStu(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cls/addClassStu`,
    method: 'post',
    data
  })
}
// 移除班级学员
export function removeClassStu(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cls/removeClassStu`,
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
// 查询班级排课记录
export function queryArrageCourseList(data) {
  return request({
    url: `${window.SS_CRM}/cerp/clscpbook/query`,
    method: 'post',
    data
  })
}
// 查询班级排课的学员
export function queryCpStuOfCls(data) {
  return request({
    url: `${window.SS_CRM}/cerp/clscpbook/queryCpStuOfCls`,
    method: 'post',
    data
  })
}
// 修改班级排课的学员信息
export function updateArrangeInfo(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cp/update`,
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
// 删除排课
export function deleteArrangeCourse(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cp/delete`,
    method: 'post',
    data
  })
}
// 创建班级排课
export function classCoursePlan(data) {
  return request({
    url: `${window.SS_CRM}/crm/cerp/classCoursePlan`,
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
// 课程主题摘要查询
export function courseThemeQuery(data) {
  return request({
    url: `${window.SS_CRM}/cerp/coursetheme/summayQuery`,
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
// 员工摘要查询
export function tenantUserSummaryQuery(data) {
  return request({
    url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`,
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

// 检验班级学员课时
export function checkStuPeriod(data) {
  return request({
    url: `${window.SS_CRM}/crm/cerp/checkStuPeriod`,
    method: 'post',
    data
  })
}
