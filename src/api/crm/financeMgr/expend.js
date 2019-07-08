import request from '@/utils/request'

// 支出管理列表查询
export function expendQuery(data) {
  return request({
    url: `${window.SS_CRM}/crm/hq/spend/record/Query`,
    method: 'post',
    data
  })
}

// 支出项目列表查询
export function queryProject(data) {
  return request({
    url: `${window.SS_CRM}/crm/hq/spend/project/queryProject`,
    method: 'post',
    data
  })
}

// 支出方式-列表查询
export function queryPayWay(data) {
  return request({
    url: `${window.SS_CRM}/crm/hq/spend/payWay/queryPayWay`,
    method: 'post',
    data
  })
}

// 支出记录新增
export function addExpendInfo(data) {
  return request({
    url: `${window.SS_CRM}/crm/hq/spend/record/add`,
    method: 'post',
    data
  })
}

// 支出记录-修改
export function updateExpendInfo(data) {
  return request({
    url: `${window.SS_CRM}/crm/hq/spend/record/update`,
    method: 'post',
    data
  })
}

// 支出记录-详情查询
export function queryDeatil(data) {
  return request({
    url: `${window.SS_CRM}/crm/hq/spend/record/queryDeatil`,
    method: 'post',
    data
  })
}

// 支出记录-删除操作
export function expendDelete(data) {
  return request({
    url: `${window.SS_CRM}/crm/hq/spend/record/delete`,
    method: 'post',
    data
  })
}

// 支出项目-修改
export function payProjectUpdate(data) {
  return request({
    url: `${window.SS_CRM}/crm/hq/spend/project/update`,
    method: 'post',
    data
  })
}

// 支出项目-修改
export function payProjectAdd(data) {
  return request({
    url: `${window.SS_CRM}/crm/hq/spend/project/add`,
    method: 'post',
    data
  })
}

// 支出方式-增加
export function paymentAdd(data) {
  return request({
    url: `${window.SS_CRM}/crm/hq/spend/payWay/add`,
    method: 'post',
    data
  })
}

// 支出方式更新
export function paymentUpdate(data) {
  return request({
    url: `${window.SS_CRM}/crm/hq/spend/payWay/update`,
    method: 'post',
    data
  })
}

/** 判断上传的文件是否为模板文件 */
export function isModelFile(data) {
  return request({
    url: `${window.SS_CRM}/crm/hq/spend/import/isModelFile`,
    method: 'post',
    data
  })
}

/** 预览支付记录信息 */
export function previewData(data) {
  return request({
    url: `${window.SS_CRM}/crm/hq/spend/import/preview`,
    method: 'post',
    data
  })
}

/** 是否导入完成 */
export function iscompleteData(data) {
  return request({
    url: `${window.SS_CRM}/crm/hq/spend/import/iscomplete`,
    method: 'post',
    data
  })
}

/** 导入文件 */
export function importexpendComplete(data) {
  return request({
    url: `${window.SS_CRM}/crm/hq/spend/import/importData`,
    method: 'post',
    data
  })
}

/** 导出文件 */
export function expendExportMessage(data) {
  return request({
    url: `${window.SS_CRM}/crm/hq/spend/record/export`,
    method: 'post',
    data
  })
}
