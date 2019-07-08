import request from '@/utils/request'

// 查询约课列表
export function queryArrageCourseList(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cp/query`,
    method: 'post',
    data
  })
}
// 查询学员约课记录
export function queryOrderCourseList(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cpbook/query`,
    method: 'post',
    data
  })
}
// 修改考勤状态
export function updateSignType(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cpbook/updateSignType`,
    method: 'post',
    data
  })
}
// 取消约课
export function stuSignCancel(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cpbook/stuSignCancel`,
    method: 'post',
    data
  })
}
// 批量修改固定位
export function updateFix(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cpbook/updateFix`,
    method: 'post',
    data
  })
}
// 教室列表
export function queryClassroomList(data) {
  return request({
    url: `${window.SS_CRM}/sysBase/cerp/classroom/summaryQuery`,
    method: 'post',
    data
  })
}
// 课程摘要查询
export function courseSummaryQuery(data) {
  return request({
    url: `${window.SS_CRM}/cerp/course/summaryQuery`,
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
// 班级列表摘要查询
export function classGradeSummary(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cls/classGradeSummary`,
    method: 'post',
    data
  })
}
// 获取在读学员列表
export function stuSummaryQuery(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/stu/summaryQueryAll`,
    method: 'post',
    data
  })
}
// 查询班级学员
export function queryClassStuList(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cls/queryClassStuList`,
    method: 'post',
    data
  })
}
// 查询排课明细
export function detailQuery(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cp/detailQuery`,
    method: 'post',
    data
  })
}
// 上课约课（单次约课）
export function stuCreate(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cpbook/stuCreate`,
    method: 'post',
    data
  })
}
// 学员约课校验年龄（单次约课）
export function stuCheckBirthday(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cpbook/stuCheckBirthday`,
    method: 'post',
    data
  })
}
// 班级约课（单次约课）
export function gradeCreate(data) {
  return request({
    url: `${window.SS_CRM}/cerp/clscpbook/create`,
    method: 'post',
    data
  })
}
// 根据会员卡查询课时信息摘要
export function cardSummaryPeriodByStuId(data) {
  return request({
    url: `${window.SS_CRM}/crm/stucard/cardSummaryPeriodByStuId`,
    method: 'post',
    data
  })
}
// 班级批量约课
export function gradeBatchCreate(data) {
  return request({
    url: `${window.SS_CRM}/cerp/clscpbook/batchCreate`,
    method: 'post',
    data
  })
}
// 学员补课约课
export function stuMulCreate(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cpbook/mulCreate`,
    method: 'post',
    data
  })
}
// 学员名单查询
export function queryClueStuList(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/clue/queryClueStuList`,
    method: 'post',
    data
  })
}
// 学员名单摘要查询
export function clueStuSummaryQuery(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/clue/ClueStuSummaryQuery`,
    method: 'post',
    data
  })
}
// 回访确认
export function isCheckUpdate(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cpbook/isCheckUpdate`,
    method: 'post',
    data
  })
}
// 考勤
export function stuSign(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cpbook/stuSign`,
    method: 'post',
    data
  })
}
// 试听预约人数校验
export function getAvailableStatus(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cpbook/getAvailableStatus`,
    method: 'post',
    data
  })
}
// 试听预约
export function tryCreate(data) {
  return request({
    url: `${window.SS_CRM}/crm/subscribeAudition/create`,
    method: 'post',
    data
  })
}
// 排队学员转为上课学员
export function inlineChange(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cpbook/inlineChange`,
    method: 'post',
    data
  })
}
// 修改预约试听状态
export function tryUpdateStatus(data) {
  return request({
    url: `${window.SS_CRM}/crm/subscribeAudition/updateStatus`,
    method: 'post',
    data
  })
}
// 打印列表
export function getPrintList(query) {
  return request({
    url: '/orderCourse/getPrintList',
    method: 'get',
    params: query
  })
}
