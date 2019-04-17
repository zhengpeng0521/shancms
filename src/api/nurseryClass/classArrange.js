import request from '@/utils/request'

// 班级排课 班级名称列表
export function getClassNameList(data) {
  return request({
    url: `${window.SS_CRM}/crm/nur/cerpClass/summeryQuery`,
    method: 'post',
    data
  })
}

// 班级排课列表
export function getScheduleList(data) {
  return request({
    url: `${window.SS_CRM}/crm/nur/cerpCoursePlan/query`,
    method: 'post',
    data
  })
}
// 添加排课
export function createCourse(data) {
  return request({
    url: `${window.SS_CRM}/crm/nur/cerpCoursePlan/create`,
    method: 'post',
    data
  })
}
// 循环排课
export function batchCreate(data) {
  return request({
    url: `${window.SS_CRM}/crm/nur/cerpCoursePlan/batchCreate`,
    method: 'post',
    data
  })
}
// 托班排课详情
export function courseDetail(data) {
  return request({
    url: `${window.SS_CRM}/crm/nur/cerpCoursePlan/detail`,
    method: 'post',
    data
  })
}
// 托班排课修改
export function courseUpdate(data) {
  return request({
    url: `${window.SS_CRM}/crm/nur/cerpCoursePlan/update`,
    method: 'post',
    data
  })
}
// 托班排课删除
export function courseDelete(data) {
  return request({
    url: `${window.SS_CRM}/crm/nur/cerpCoursePlan/delete`,
    method: 'post',
    data
  })
}
// 排课复制
export function copyCourse(data) {
  return request({
    url: `${window.SS_CRM}/crm/nur/cerpCoursePlan/copyCourse`,
    method: 'post',
    data
  })
}
