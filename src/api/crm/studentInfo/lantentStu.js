import request from '@/utils/request'

// 查询潜在学员
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
// 新增到访记录
export function addVisitRecord(data) {
  return request({
    url: `${window.SS_CRM}/crm/visit/addVisitRecord`,
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

// 查询1-2级来源配置是否可修改
export function confChannelEditResult(data) {
  return request({
    url: `${window.SYS_URL}/sysBase/conf/confChannelEditResult`,
    method: 'post',
    data
  })
}

// 判断上传的文件是否为模板文件
export function isModelFile(data) {
  return request({
    url: `${window.SS_CRM}/import/clue/student/isModelFile`,
    method: 'post',
    data
  })
}

// 获取目标源字段
export function getSourceData(data) {
  return request({
    url: `${window.SS_CRM}/import/cluepool/getSourceData`,
    method: 'post',
    data
  })
}

// 导入预览
export function previewData(data) {
  return request({
    url: `${window.SS_CRM}/import/cluepool/previewData`,
    method: 'post',
    data
  })
}

// 导入
export function importData(data) {
  return request({
    url: `${window.SS_CRM}/import/clue/student/importLeadsData`,
    method: 'post',
    data
  })
}

// 导入是否完成
export function importComplete(data) {
  return request({
    url: `${window.SS_CRM}/import/cluepool/isComplete`,
    method: 'post',
    data
  })
}

// 获取导入规则
export function getCheck(data) {
  return request({
    url: `${window.SYS_URL}/sysBase/duplicate/clueDupCheckInfo`,
    method: 'post',
    data
  })
}
