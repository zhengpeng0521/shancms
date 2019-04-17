import request from '@/utils/request'
export function fetchList(data) {
  return request({
    url: '/marketing/list',
    method: 'get',
    data
  })
}

export function fetchItem(data) {
  return request({
    url: '/webPreview/list',
    method: 'get',
    data
  })
}

export function getActivityList(data) {
  return request({
    url: '/ss-mic-provider/mic/activity/getActivityList',
    method: 'post',
    data
  })
}
