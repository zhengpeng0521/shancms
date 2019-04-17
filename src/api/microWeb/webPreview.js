import request from '@/utils/request'
// 微信预约列表查询
export function queryOrgBanner(data) {
  return request({
    url: '/ss-mic-provider/mic/OrgBannerQueryService/queryOrgBanner',
    method: 'post',
    data
  })
}

// 菜单设置信息
export function queryConfig(data) {
  return request({
    url: '/ss-mic-provider/mic/OrgConfigQueryService/queryConfig',
    method: 'post',
    data
  })
}
// 菜单是否隐藏
export function changeConfig(data) {
  return request({
    url: '/ss-mic-provider/mic/OrgConfigService/changeConfig',
    method: 'post',
    data
  })
}

// 菜单编辑
export function updateConfig(data) {
  return request({
    url: '/ss-mic-provider/mic/OrgConfigService/updateConfig',
    method: 'post',
    data
  })
}

// 初始首页设置信息
export function getOrgan(query) {
  return request({
    url: '/ss-sys-provider/sysBase/org/getOrgan',
    method: 'post',
    params: query
  })
}
// 编辑首页设置信息
export function updateOrgan(query) {
  return request({
    url: '/ss-sys-provider/sysBase/org/updateOrgan',
    method: 'post',
    data: query
  })
}
// 机构的字典数据
export function dictOrgan(query) {
  return request({
    url: '/ss-sys-provider/sysBase/dict/dictOrgan',
    method: 'post',
    params: query
  })
}
