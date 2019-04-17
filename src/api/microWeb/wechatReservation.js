import request from '@/utils/request'
// 微信预约列表查询
export function queryList(data) {
  return request({
    url: '/ss-mic-provider/mic/reservation/queryList',
    method: 'post',
    data
  })
}
// 微信预约确认处理
export function batchDeal(data) {
  return request({
    url: '/ss-mic-provider/mic/reservation/batchDeal',
    method: 'post',
    data
  })
}

// 微信预约列表查询
export function updateRemark(data) {
  return request({
    url: '/ss-mic-provider/mic/reservation/updateRemark',
    method: 'post',
    data
  })
}
// 微官网设置（预约链接二维码）
export function queryConfig(data) {
  return request({
    url: '/ss-mic-provider/mic/OrgConfigQueryService/queryConfig',
    method: 'post',
    data
  })
} // 预约设置初始数据
export function get(data) {
  return request({
    url: '/ss-mic-provider/mic/MicReservationConfigService/get',
    method: 'post',
    data
  })
}
// 预约设置提交数据
export function save(data) {
  return request({
    url: '/ss-mic-provider/mic/MicReservationConfigService/save',
    method: 'post',
    data
  })
}
