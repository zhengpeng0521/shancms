import request from '@/utils/request'
// 轮播图列表
export function queryOrgBanner(data) {
  return request({
    url: '/ss-mic-provider/mic/OrgBannerQueryService/queryOrgBanner',
    method: 'post',
    data
  })
}
// 轮播图上下架，删除列表
export function changeBanner(data) {
  return request({
    url: '/ss-mic-provider/mic/OrgConfigService/changeBanner',
    method: 'post',
    data
  })
}
// 新增轮播图课程下拉框
export function queryCourseList(data) {
  return request({
    url: '/ss-mic-provider/mic/OrgCourseQueryService/queryCourseList',
    method: 'post',
    data
  })
}
// 新增轮播图活动下拉框
export function getActivityList(data) {
  return request({
    url: '/ss-mic-provider/mic/activity/getActivityList',
    method: 'post',
    data
  })
}
// 新增轮播图
export function createBanner(data) {
  return request({
    url: '/ss-mic-provider/mic/OrgConfigService/createBanner',
    method: 'post',
    data
  })
}
