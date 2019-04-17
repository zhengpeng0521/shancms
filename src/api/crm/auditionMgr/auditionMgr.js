import request from '@/utils/request'

// 预约试听列表
export async function qureyList(params) {
  return request({
    url: `${window.SS_CRM}/crm/subscribeAudition/qureyList`,
    method: 'post',
    data: params
  })
}

// 修改试听状态
export async function updateStatus(params) {
  return request({
    url: `${window.SS_CRM}/crm/subscribeAudition/updateStatus`,
    method: 'post',
    data: params
  })
}

// 潜在学员名单下拉框
export async function leadsSummary(params) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/clue/leadsSummary`,
    method: 'post',
    data: params
  })
}

// 在读学员名单下拉框
export async function summaryQueryRead(params) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/stu/stusOfUser`,
    method: 'post',
    data: params
  })
}

// 可试听排课日期
export async function tryDayQuery(params) {
  return request({
    url: `${window.SS_CRM}/cerp/cp/tryDayQuery`,
    method: 'post',
    data: params
  })
}

// 可试听排课课程
export async function tryCourseQuery(params) {
  return request({
    url: `${window.SS_CRM}/cerp/cp/tryCourseQuery`,
    method: 'post',
    data: params
  })
}

// 查询排课列表
export async function queryCpClass(params) {
  return request({
    url: `${window.SS_CRM}/cerp/cp/query`,
    method: 'post',
    data: params
  })
}

// 确定创建预约试听
export async function createSubscribeAudition(params) {
  return request({
    url: `${window.SS_CRM}/crm/subscribeAudition/create`,
    method: 'post',
    data: params
  })
}

// 根据id查询名单学员的详细信息
export async function getSingleClueStu(params) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/clue/getSingleClueStu`,
    method: 'post',
    data: params
  })
}

// 根据id查询学员的学员详细信息
export async function getStuMsg(params) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/stu/getStuMsg`,
    method: 'post',
    data: params
  })
}
