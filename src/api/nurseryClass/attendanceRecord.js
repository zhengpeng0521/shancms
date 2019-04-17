import request from '@/utils/request'

// 考勤记录
export function getAttendanceList(data) {
  return request({
    url: `${window.SS_CRM}/crm/nur/sign/query`,
    method: 'post',
    data
  })
}
// 托班班级 班级摘要
export function classSummeryQuery(data) {
  return request({
    url: `${window.SS_CRM}/crm/nur/cerpClass/summeryQuery`,
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
