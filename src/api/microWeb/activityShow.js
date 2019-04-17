import request from '@/utils/request'
// 活动展示  列表
export function getActivityList(data) {
  return request({
    url: '/ss-mic-provider/mic/activity/getActivityList',
    method: 'post',
    data
  })
}
// 二维码
export function getActivityAddress(data) {
  return request({
    url: '/ss-mic-provider/mic/activity/getActivityAddress',
    method: 'post',
    data
  })
}

// 活动状态
export function updateStatus(data) {
  return request({
    url: '/ss-mic-provider/mic/activity/updateStatus',
    method: 'post',
    data
  })
}
// 报名等位表格接口
export function getJoinerList(data) {
  return request({
    url: '/ss-mic-provider/mic/activity/apply/getJoinerList',
    method: 'post',
    data
  })
}
// 取消报名
export function cancelJoin(data) {
  return request({
    url: '/ss-mic-provider/mic/activity/cancelJoin',
    method: 'post',
    data
  })
}
// 优先等位
export function precedenceWait(data) {
  return request({
    url: '/ss-mic-provider/mic/activity/precedenceWait',
    method: 'post',
    data
  })
}
// 修改备注
export function addRemark(data) {
  return request({
    url: '/ss-mic-provider/mic/activity/addRemark',
    method: 'post',
    data
  })
}

// 创建活动
export function createActivity(data) {
  return request({
    url: '/ss-mic-provider/mic/activity/createActivity',
    method: 'post',
    data
  })
}

// 创建活动
export function getActivityMsg(data) {
  return request({
    url: '/ss-mic-provider/mic/activity/getActivityMsg',
    method: 'post',
    data
  })
}
