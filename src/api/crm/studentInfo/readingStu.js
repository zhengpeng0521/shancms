import request from '@/utils/request'

// 在读学员列表
export function getZjlCRMStuList(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/stu/getZjlCRMStuList`,
    method: 'post',
    data
  })
}

// 查询一级来源下拉数据
export function dictGetByKeyChannel(data) {
  return request({
    url: `${window.SYS_URL}/sysBase/dict/dictGetByKey`,
    method: 'post',
    data
  })
}
// 查询下属
export async function querySubName(params) {
  return request({
    url: `${window.SYS_URL}/sysBase/tenantUser/summaryQueryByIds`,
    method: 'post',
    data: params
  })
}
// 分配对象下拉数据
export function summaryQueryUsers(data) {
  return request({
    url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`,
    method: 'post',
    data
  })
}

// 确定分配对象给学员
export function moveStu(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/clue/moveStu`,
    method: 'post',
    data
  })
}
// 给教师分配学员
export function allotTeacher2Stu(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/stu/allotTeacher2Stu`,
    method: 'post',
    data
  })
}
// 学员详情
export function getStuMsg(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/stu/getStuMsg`,
    method: 'post',
    data
  })
}

// 获取家长关注二维码
export function parentBindQrCode(data) {
  return request({
    url: `${window.SYS_URL}/sysServer/message/parentBindQrCode`,
    method: 'post',
    data
  })
}

/** 确定编辑在读学员信息 */
export function createStu(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/stu/createStu`,
    method: 'post',
    data
  })
}

/** 确定编辑在读学员信息时更新家长信息 */
export function updateStuParent(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/parent/updateStuParent`,
    method: 'post',
    data
  })
}

/** 判断上传的文件是否为模板文件 */
export function isModelFile(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/stuInfoImport/isModelFile`,
    method: 'post',
    data
  })
}

/** 预览excel文件学员信息 */
export function previewData(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/stuInfoImport/previewData`,
    method: 'post',
    data
  })
}

/** 查询学员是否导入完成 */
export function importThreadStuData(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/clue/excel/importThreadStuData`,
    method: 'post',
    data
  })
}

/** 查询学员是否导入完成 */
export function importComplete(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/stuInfoImport/isComplete`,
    method: 'post',
    data
  })
}

// 分配客服接口
export function allotWaiter2StuPort(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/stu/allotWaiter2Stu`,
    method: 'post',
    data
  })
}
