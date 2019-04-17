import request from '@/utils/request'

// 用户设置自定义可见表头
export function saveTableColumn(data) {
  return request({
    url: `${window.SYS_URL}/sysBase/column/saveTableColumn`,
    method: 'post',
    data
    // headers: { 'x-rule': '1#gaohan' }
  })
}
// 查询课程列表
export function queryCourseList(data) {
  return request({
    url: `${window.SS_CRM}/cerp/course/query`,
    method: 'post',
    data
    // headers: { 'x-rule': '1#gaohan' }
  })
}
// 课程新增
export function createCourse(data) {
  return request({
    url: `${window.SS_CRM}/cerp/course/create`,
    method: 'post',
    data
  })
}
// 课程编辑
export function updateCourse(data) {
  return request({
    url: `${window.SS_CRM}/cerp/course/update`,
    method: 'post',
    data
  })
}
// 课程删除/启用
export function statusUpdateCourse(data) {
  return request({
    url: `${window.SS_CRM}/cerp/course/statusUpdate`,
    method: 'post',
    data
  })
}
// 课系查询
export function queryCoursegroup(data) {
  return request({
    url: `${window.SS_CRM}/cerp/coursegroup/query`,
    method: 'post',
    data
  })
}
// 课系创建
export function createCoursegroup(data) {
  return request({
    url: `${window.SS_CRM}/cerp/coursegroup/create`,
    method: 'post',
    data
  })
}
// 课系修改
export function updateCoursegroup(data) {
  return request({
    url: `${window.SS_CRM}/cerp/coursegroup/update`,
    method: 'post',
    data
  })
}
// 课系删除
export function deleteCoursegroup(data) {
  return request({
    url: `${window.SS_CRM}/cerp/coursegroup/delete`,
    method: 'post',
    data
  })
}
// 课程主题查询
export function queryCourseTheme(data) {
  return request({
    url: `${window.SS_CRM}/cerp/coursetheme/query`,
    method: 'post',
    data
  })
}
// 课程主题编辑
export function updateCourseTheme(data) {
  return request({
    url: `${window.SS_CRM}/cerp/coursetheme/update`,
    method: 'post',
    data
  })
}
// 课程主题新增
export function createCourseTheme(data) {
  return request({
    url: `${window.SS_CRM}/cerp/coursetheme/create`,
    method: 'post',
    data
  })
}
// 课程主题状态修改
export function updateStatusCourseTheme(data) {
  return request({
    url: `${window.SS_CRM}/cerp/coursetheme/updateStatus`,
    method: 'post',
    data
  })
}
// 编辑信息
export function getEditInfo(data) {
  return request({
    url: `${window.SS_CRM}/cerp/course/queryById`,
    method: 'post',
    data
  })
}
