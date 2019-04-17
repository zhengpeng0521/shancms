import request from '@/utils/request'
// 游戏内容列表
export function queryGameInfosWithTenant(data) {
  return request({
    url: '/ss-mic-provider/mic/GameQueryService/queryGameInfosWithTenant',
    method: 'post',
    data
  })
}
// 我的游戏表格数据
export function queryGameInsts(data) {
  return request({
    url: '/ss-mic-provider/mic/GameQueryService/queryGameInsts',
    method: 'post',
    data
  })
}
// 校区
export function getOrgName(data) {
  return request({
    url: '/ss-mic-provider/mic/OmpMicroGameService/getOrgName',
    method: 'post',
    data
  })
}

// 游戏下拉列表
export function queryGameInfos(data) {
  return request({
    url: '/ss-mic-provider/mic/GameQueryService/queryGameInfos',
    method: 'post',
    data
  })
}

// 游戏上下架
export function updateStatus(data) {
  return request({
    url: '/web-node-server/thinknode/game/transpond/action',
    method: 'post',
    data
  })
}
// 创建游戏
export function gameChoose(data) {
  return request({
    url: '/ss-mic-provider/mic/GameQueryService/gameChoose',
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
