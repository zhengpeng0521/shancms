import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/course/list',
    method: 'get',
    params: query
  })
}
// 课程主题列表
export function getCourseThemeList(query) {
  return request({
    url: '/course/getCourseThemeList',
    method: 'get',
    params: query
  })
}

export function gradeList(query) {
  return request({
    url: '/grade/list',
    method: 'get',
    params: query
  })
}

export function getStuList(query) {
  return request({
    url: '/grade/getStuList',
    method: 'get',
    params: query
  })
}

export function getCourseList(query) {
  return request({
    url: '/grade/getCourseList',
    method: 'get',
    params: query
  })
}

export function getStuChooseList(query) {
  return request({
    url: '/grade/getStuChooseList',
    method: 'get',
    params: query
  })
}

export function getScheduleList(query) {
  return request({
    url: '/grade/getScheduleList',
    method: 'get',
    params: query
  })
}

export function getListChooseList(query) {
  return request({
    url: '/grade/getListChooseList',
    method: 'get',
    params: query
  })
}

export function getRoomList(query) {
  return request({
    url: '/grade/getRoomList',
    method: 'get',
    params: query
  })
}
// 约课
export function getList(query) {
  return request({
    url: '/orderCourse/getList',
    method: 'get',
    params: query
  })
}
// 请假审核
export function getLeaveList(query) {
  return request({
    url: '/leaveAudit/getList',
    method: 'get',
    params: query
  })
}
// 签到记录
export function getSignList(query) {
  return request({
    url: '/leaveAudit/getSignList',
    method: 'get',
    params: query
  })
}
