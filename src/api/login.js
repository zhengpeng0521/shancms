import request from '@/utils/request'

export function loginByUsername(data = {}) {
  return request({
    url: '/ss-sys-provider/sysPermission/auth/login',
    method: 'post',
    data
  })
}

export function queryOrgListByUserName(data = {}) {
  return request({
    url: '/ss-sys-provider/sysPermission/auth/session',
    method: 'post',
    data
  })
}

export function querySessionContent(data = {}) {
  return request({
    url: '/ss-sys-provider/sysPermission/auth/session',
    method: 'post',
    data
  })
}

export function logout(data = {}) {
  return request({
    url: '/ss-sys-provider/sysPermission/auth/logout',
    method: 'post',
    data
  })
}

export function queryOrgListByUsername(data = {}) {
  return request({
    url: '/ss-sys-provider/sysBase/org/queryOrgListByMobile',
    method: 'post',
    data
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

