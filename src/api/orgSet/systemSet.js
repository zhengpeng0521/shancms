import request from '@/utils/request'

// 合同规则查询
export function queryPurchaseConf(query) {
  return request({
    url: '/ss-sys-provider/sysBase/purchase/queryPurchaseConf',
    method: 'post',
    params: query
  })
}

// 合同规则设置
export function setPurchaseConf(query) {
  return request({
    url: '/ss-sys-provider/sysBase/purchase/setPurchaseConf',
    method: 'post',
    params: query
  })
}

// 系统设置查询
export function queryByKey(query) {
  return request({
    url: '/ss-sys-provider/sysBase/sysConf/queryByKey',
    method: 'post',
    params: query
  })
}

// 设置保存
export function saveConf(query) {
  return request({
    url: '/ss-sys-provider/sys/conf/saveConf',
    method: 'post',
    data: query
  })
}

// 积分规则列表查询
export function queryRules(query) {
  return request({
    url: '/ss-sys-provider/sysBase/integral/queryRules',
    method: 'post',
    data: query
  })
}

// 积分规则-修改
export function updateRules(query) {
  return request({
    url: '/ss-sys-provider/sysBase/integral/updateRules',
    method: 'post',
    data: query
  })
}

// 积分规则-新增
export function addRules(query) {
  return request({
    url: '/ss-sys-provider/sysBase/integral/addRules',
    method: 'post',
    data: query
  })
}

// 积分规则-删除
export function deleteRules(query) {
  return request({
    url: '/ss-sys-provider/sysBase/integral/deleteRules',
    method: 'post',
    data: query
  })
}

// 学员查重初始信息
export function stuDupCheckInfo(query) {
  return request({
    url: '/ss-sys-provider/sysBase/duplicate/stuDupCheckInfo',
    method: 'post',
    data: query
  })
}

// 查重初始信息
export function clueDupCheckInfo(query) {
  return request({
    url: '/ss-sys-provider/sysBase/duplicate/clueDupCheckInfo',
    method: 'post',
    data: query
  })
}
// 查重修改信息
export function saveDupCheckInfo(query) {
  return request({
    url: '/ss-sys-provider/sys/conf/saveDupCheckInfo',
    method: 'post',
    data: query
  })
}
