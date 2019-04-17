import request from '@/utils/request'
// 查询课程列表
export function queryCourseList(data) {
  return request({
    url: '/ss-mic-provider/mic/OrgCourseQueryService/queryCourseList',
    method: 'post',
    data
  })
}
// 上下架，删除
export function changeCourse(data) {
  return request({
    url: '/ss-mic-provider/mic/OrgCourseService/changeCourse',
    method: 'post',
    data
  })
}
// 二维码
export function queryCourseUrl(data) {
  return request({
    url: '/ss-mic-provider/mic/OrgCourseQueryService/queryCourseUrl',
    method: 'post',
    data
  })
}

// 新建课程
export function createCourse(data) {
  return request({
    url: '/ss-mic-provider/mic/OrgCourseService/createCourse',
    method: 'post',
    data
  })
}
// 编辑课程接口
export function queryCourseDetail(data) {
  return request({
    url: '/ss-mic-provider/mic/OrgCourseQueryService/queryCourseDetail',
    method: 'post',
    data
  })
}
