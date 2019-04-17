import request from '@/utils/request'
export function fetchSet(data) {
  return request({
    url: '/webPreview/getList',
    method: 'get',
    data
  })
}

export function fetchActivityList(data) {
  return request({
    url: '/webPreview/ActivityList',
    method: 'get',
    data
  })
}
