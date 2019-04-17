import request from '@/utils/request'

//  查询授权信息
export function queryWeChatAuth(query) {
  return request({
    url: '/ss-sys-provider/sysServer/wechat/queryWeChatAuth',
    method: 'post',
    params: query
  })
}

//  查询授权二维码
export function queryQrCode(query) {
  return request({
    url: '/ss-sys-provider//sysServer/wechat/queryQrCode',
    method: 'post',
    params: query
  })
}
