import request from '@/utils/request'

// 查询短信记录
export function getSendHistory(query) {
  return request({
    url: '/ss-sys-provider/sysServer/sms/getSendHistory',
    method: 'post',
    params: query
  })
}
