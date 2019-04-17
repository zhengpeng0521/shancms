import request from '@/utils/request'

// 查询域名是否可用
export function checkUsable(query) {
  return request({
    url: '/ss-sys-provider/sysServer/hostOrg/checkUsable',
    method: 'post',
    params: query
  })
}

//  租户域名申请
export function applyHost(query) {
  return request({
    url: '/ss-sys-provider/sysServer/hostOrg/applyHost',
    method: 'post',
    params: query
  })
}

//   租户域名申请进度查询
export function queryStatus(query) {
  return request({
    url: '/ss-sys-provider/sysServer/hostOrg/queryStatus',
    method: 'post',
    params: query
  })
}

//   域名配置
export function loginPageSet(query) {
  return request({
    url: '/ss-sys-provider/sysServer/hostOrg/loginPageSet',
    method: 'post',
    params: query
  })
}

//   查询租户的登录页设置信息
export function queryLoginPage(query) {
  return request({
    url: '/ss-sys-provider//sysServer/hostOrg/queryLoginPage',
    method: 'post',
    params: query
  })
}
