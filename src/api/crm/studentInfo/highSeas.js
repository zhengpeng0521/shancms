import request from '@/utils/request'

// 东书房二级来源
export function subSecondChannelQuery(data) {
  return request({
    url: `${window.SYS_URL}/sysBase/dict/subSecondChannelQuery`,
    method: 'post',
    data
  })
}

// 查询公海池学员记录
export function queryClueStuList(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/clue/queryClueStuList`,
    method: 'post',
    data
  })
}
// 一级来源/跟进状态
export function dictGetByKey(data) {
  return request({
    url: `${window.SYS_URL}/sysBase/dict/dictGetByKey`,
    method: 'post',
    data
  })
}
// 放入回收站/彻底删除/返回公海池
export function recycle(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/clue/recycle`,
    method: 'post',
    data
  })
}
// 退回总部
export function recyle2Home(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/clue/recyle2Home`,
    method: 'post',
    data
  })
}
// 学员查询分配界面数据
export function queryAllotData(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/clue/queryAllotData`,
    method: 'post',
    data
  })
}
// 名单分配(转给他人，捞取)
export function changeLeadsSeller(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/clue/changeLeadsSeller`,
    method: 'post',
    data
  })
}
// 员工摘要查询
export function tenantUserSummaryQuery(data) {
  return request({
    url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`,
    method: 'post',
    data
  })
}
// 角色查询
export function tenantRoleQuery(data) {
  return request({
    url: `${window.SYS_URL}/sysBase/role/tenantRoleQuery`,
    method: 'post',
    data
  })
}
// 名单分配（批量分配）
export function allotLeads(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/clue/allotLeads`,
    method: 'post',
    data
  })
}
// 在读学员id获取家长列表
export function parentSummary(data) {
  return request({
    url: `${window.SS_CRM}/stu/parent/parentSummary`,
    method: 'post',
    data
  })
}
// 添加，编辑名单
export function addClueStu(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/clue/addClueStu`,
    method: 'post',
    data
  })
}
// 姓名查重
export function excistForName(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/stu/excistForName`,
    method: 'post',
    data
  })
}
// 父母手机号查重
export function parentDupCheck(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/clue/parentDupCheck`,
    method: 'post',
    data
  })
}
