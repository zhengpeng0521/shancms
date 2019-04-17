import request from '@/utils/request'

// 获取机构列表
export function queryOrganList(query) {
  return request({
    url: '/ss-sys-provider/sysBase/org/queryOrganList',
    method: 'post',
    params: query
  })
}

// 机构详情查询
export function getOrgan(query) {
  return request({
    url: '/ss-sys-provider/sysBase/org/getOrgan',
    method: 'post',
    params: query
  })
}

// 租户查询
export function getTenant(query) {
  return request({
    url: '/ss-sys-provider/sysBase/org/getTenant',
    method: 'post',
    params: query
  })
}

// 总部校区查询
export function getHqOrgan(query) {
  return request({
    url: '/ss-sys-provider/sysBase/org/getHqOrgan',
    method: 'post',
    params: query
  })
}

// 新建校区
export function addOrgan(query) {
  return request({
    url: '/ss-sys-provider/sysBase/org/addOrgan',
    method: 'post',
    params: query
  })
}

// 校区编辑
export function updateOrgan(query) {
  return request({
    url: '/ss-sys-provider/sysBase/org/updateOrgan',
    method: 'post',
    data: query
  })
}

// 更改校区状态
export function updateOrganStatus(query) {
  return request({
    url: '/ss-sys-provider/sysBase/org/updateOrganStatus',
    method: 'post',
    params: query
  })
}

// 租户图片保存
export function saveTenantImg(query) {
  return request({
    url: '/ss-sys-provider/sysBase/org/saveTenantImg',
    method: 'post',
    params: query
  })
}

// 根据手机号查询相应的校区信息
export function queryOrgInfoByMobile(query) {
  return request({
    url: '/ss-sys-provider/sysBase/org/queryOrgInfoByMobile',
    method: 'post',
    params: query
  })
}

// 校区摘要查询（树形结构
export function summaryQuery(query) {
  return request({
    url: '/ss-sys-provider/sysBase/org/summaryQuery',
    method: 'post',
    params: query
  })
}

// 校区详情查询
export function singleOrgQuery(query) {
  return request({
    url: '/ss-sys-provider/sysBase/org/singleOrgQuery',
    method: 'post',
    params: query
  })
}

// 校区列表查询
export function queryOrgList(query) {
  return request({
    url: '/ss-sys-provider/sysBase/org/queryOrgList',
    method: 'post',
    params: query
  })
}

// 校区摘要查询（树形）
export function userPermOrgs(query) {
  return request({
    url: '/ss-sys-provider/sysBase/org/userPermOrgs',
    method: 'post',
    params: query
  })
}

// 校区更新查询
export function upOrgsNoPatch(query) {
  return request({
    url: '/ss-sys-provider/sysBase/org/upOrgsNoPatch',
    method: 'post',
    params: query
  })
}

// 查询用户登录校区
export function userLoginOrg(query) {
  return request({
    url: '/ss-sys-provider/sysBase/org/userLoginOrg',
    method: 'post',
    params: query
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
