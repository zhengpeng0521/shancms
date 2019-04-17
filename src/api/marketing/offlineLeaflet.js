import request from '@/utils/request'
// 传单内容
export function orgLeafletModelList(params) {
  return request({
    url: '/ss-mic-provider/mic/OfflineLeafletQueryService/orgLeafletModelList',
    method: 'post',
    data: params
  })
}
// 我的传单
export function orgInstList(params) {
  return request({
    url: '/ss-mic-provider/mic/OfflineLeafletQueryService/orgInstList',
    method: 'post',
    data: params
  })
}
// 关联活动
export function markList(params) {
  return request({
    url: '/ss-mic-provider/mic/OfflineLeafletQueryService/markList',
    method: 'post',
    data: params
  })
}
// 删除
export function instUpdateStatus(params) {
  return request({
    url: '/ss-mic-provider/mic/OfflineLeafletService/instUpdateStatus',
    method: 'post',
    data: params
  })
}
// 下载
export function getInstMsg(params) {
  return request({
    url: '/ss-mic-provider/mic/OfflineLeafletQueryService/getInstMsg',
    method: 'post',
    data: params
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
