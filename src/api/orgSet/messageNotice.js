import request from '@/utils/request'

// 消息通知 ~ 消息设置信息
export function queryTemp(query) {
  return request({
    url: '/ss-sys-provider/sysServer/message/queryTemp',
    method: 'post',
    data: query
  })
}

// 消息 ~ 接收人~ 添加接收人
export function addReceiver(query) {
  return request({
    url: '/ss-sys-provider/sysServer/message/addReceiver',
    method: 'post',
    data: query
  })
}

// 消息 ~ 接收人~ 移除接收人
export function removeReceiver(query) {
  return request({
    url: '/ss-sys-provider/sysServer/message/removeReceiver',
    method: 'post',
    data: query
  })
}

// 消息 ~ 推送配置-开启关闭
export function updateMsgTemp(query) {
  return request({
    url: '/ss-sys-provider/sysServer/message/updateMsgTemp',
    method: 'post',
    data: query
  })
}

// 获取关注二维码
export function getQrCode(query) {
  return request({
    url: '/ss-sys-provider/sysServer/message/getQrCode',
    method: 'post',
    data: query
  })
}
// 员工摘要查询
export function tenantUserSummaryQuery(data) {
  return request({
    url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`,
    method: 'post',
    data
  })
}
