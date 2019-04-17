import request from '@/utils/request'
// 市场活动
export function queryList(params) {
  return request({
    url: '/ss-mic-provider/mic/MarketActivityQueryService/queryList',
    method: 'post',
    data: params
  })
}
// 表格菜单人员
export function queryMembers(params) {
  return request({
    url: '/ss-mic-provider/mic/MarketActivityQueryService/queryMembers',
    method: 'post',
    data: params
  })
}

// 新增市场活动
export function createOrUpdate(params) {
  delete params.stuInfo
  return request({
    url: '/ss-mic-provider/mic/MarketActivityHandleService/createOrUpdate',
    method: 'post',
    data: params
  })
}
// 修改市场活动
export function queryDetail(params) {
  return request({
    url: '/ss-mic-provider/mic/MarketActivityQueryService/queryDetail',
    method: 'post',
    data: params
  })
}
// 删除市场活动
export function updateStatus(params) {
  return request({
    url: '/ss-mic-provider/mic/MarketActivityHandleService/updateStatus',
    method: 'post',
    data: params
  })
}
// 新增修改市场活动初始信息
export function queryFormConfig(params) {
  return request({
    url: '/ss-mic-provider/mic/FormConfigQueryService/queryFormConfig',
    method: 'post',
    data: params
  })
}

// 高级搜索
// 采集地点
export function dictGetByKey(params) {
  return request({
    url: '/ss-sys-provider/sysBase/dict/dictGetByKey',
    method: 'post',
    data: params
  })
}

// 菜单人员
export function summaryQuery(params) {
  return request({
    url: '/ss-mic-provider/mic/permission/user/summaryQuery',
    method: 'post',
    data: params
  })
}

// 数据分析，用户数据接口
export function formDataQuery(params) {
  return request({
    url: '/ss-mic-provider/mic/MarketActivityQueryService/formDataQuery',
    method: 'post',
    data: params
  })
}
// 数据分析 导出
export function exportFormData(params) {
  return request({
    url: '/ss-mic-provider/mic/MarketActivityQueryService/exportFormData',
    method: 'post',
    data: params
  })
}

// 数据分析  扫描次数，天数折线图
export function viewDataByDaysQuery(params) {
  return request({
    url: '/ss-mic-provider/mic/MarketActivityQueryService/viewDataByDaysQuery',
    method: 'post',
    data: params
  })
}
// 数据分析  有效用户折线图
export function countDataByDaysQuery(params) {
  return request({
    url: '/ss-mic-provider/mic/MarketActivityQueryService/countDataByDaysQuery',
    method: 'post',
    data: params
  })
}
// 数据分析  菜单人员折线图
export function countDataByDaysOnMemberQuery(params) {
  return request({
    url: '/ss-mic-provider/mic/MarketActivityQueryService/countDataByDaysOnMemberQuery',
    method: 'post',
    data: params
  })
}

// 采单人员二维码打包下载
export function zip(params) {
  return request({
    url: '/ss-mic-provider/mic/market/img/zip',
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
