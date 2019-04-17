import request from '@/utils/request'

// 班级管理列表
export function getGradeList(data) {
  return request({
    url: `${window.SS_CRM}/crm/nur/cerpClass/query`,
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
// 托班类型
export function getClassType(data) {
  return request({
    url: `${window.SYS_URL}/sysBase/dict/dictGetByKey`,
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
// 托班添加班级
export function createClass(data) {
  return request({
    url: `${window.SS_CRM}/crm/nur/cerpClass/create`,
    method: 'post',
    data
  })
}
// 托班修改班级
export function updateClass(data) {
  return request({
    url: `${window.SS_CRM}/crm/nur/cerpClass/update`,
    method: 'post',
    data
  })
}
// 班级信息编辑
export function getStuEditInfo(data) {
  return request({
    url: `${window.SS_CRM}/crm/nur/cerpClass/detail`,
    method: 'post',
    data
  })
}
// 班级信息详情
export function clsDetailStuInfo(data) {
  return request({
    url: `${window.SS_CRM}/crm/nur/cerpClass/clsDetailStuInfo`,
    method: 'post',
    data
  })
}
// 班级是否存在学员
export function excistStu(data) {
  return request({
    url: `${window.SS_CRM}/crm/nur/cerpClass/excistStu`,
    method: 'post',
    data
  })
}
// 班级删除
export function deleteClass(data) {
  return request({
    url: `${window.SS_CRM}/crm/nur/cerpClass/delete`,
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
// 删除/添加学员
export function addStudent(data) {
  return request({
    url: `${window.SS_CRM}/crm/nur/cerpClass/addStudent`,
    method: 'post',
    data
  })
}
// 考勤管理
export function getStuAttendanceList(data) {
  return request({
    url: `${window.SS_CRM}/crm/nur/cerpClass/stuInfo`,
    method: 'post',
    data
  })
}
// 批量考勤
export function batchCreate(data) {
  return request({
    url: `${window.SS_CRM}/crm/nur/sign/batchCreate`,
    method: 'post',
    data
  })
}
// 考勤操作
export function createSign(data) {
  return request({
    url: `${window.SS_CRM}/crm/nur/sign/createSign`,
    method: 'post',
    data
  })
}
