import request from '@/utils/request'
// 微活动，微游戏nav
export function queryAllLabel(data) {
  return request({
    url: '/ss-mic-provider/mic/ProductLabelQueryService/queryAllLabel',
    method: 'post',
    data
  })
}
// 微活动获取实例
export function saveTenantMicroActivity(data) {
  return request({
    url: '/ss-mic-provider/mic/MicroActivityService/saveTenantMicroActivity',
    method: 'post',
    data
  })
}
// iframe方法
window.micActivityRequest = function(url, params) {
  // const data = {
  //   data: params
  // }
  return request({
    url: 'ss-mic-provider' + url,
    method: 'post',
    data: params
  })
}
window.sysHostRequest = function(url, params) {
  // const data = {
  //   data: params
  // }
  return request({
    url: 'ss-sys-provider' + url,
    method: 'post',
    data: params
  })
}

// 创建微活动
export function getActivityList(data) {
  return request({
    url: '/ss-mic-provider/mic/QueryMicActivityService/getActivitysList',
    method: 'post',
    data
  })
}
// 我的活动
// 我的活动搜索
export function myMarketingActivity(data) {
  return request({
    url: '/ss-mic-provider/mic/MicroActivityService/myMarketingActivity',
    method: 'post',
    data
  })
}
// 查看详情
export function findDetail(data) {
  return request({
    url: '/ss-mic-provider/mic/QueryMicActivityService/findDetail',
    method: 'post',
    data
  })
}

// 我的-退款
export function activityRefound(data) {
  return request({
    url: '/ss-mic-provider/mic/payRefund',
    method: 'post',
    data
  })
}

// 更新状态
export function updateStatus(data) {
  return request({
    url: '/ss-mic-provider/mic/MicroActivityService/updateStatus',
    method: 'post',
    data
  })
}
// 导出
export function zsbexportXsml(data) {
  return request({
    url: '/ss-mic-provider/mic/MicroActivityService/zsbexportXsml',
    method: 'post',
    data
  })
}
