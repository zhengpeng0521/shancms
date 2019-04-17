import request from '@/utils/request'

// 获取学员积分
export async function getInterialList(params) {
  return request({
    url: `${window.SS_CRM}/crm/integral/queryStuIntegral`,
    method: 'post',
    data: params
  })
}

// 积分账户---兑换商品---学员下拉列表
export async function queryCRMStuList(params) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/stu/queryCRMStuList`,
    method: 'post',
    data: params
  })
}

// 积分账户---兑换商品---变动原因规则列表
export async function summaryQueryRules(params) {
  return request({
    url: `${window.SYS_URL}/sysBase/integral/summaryQueryRules`,
    method: 'post',
    data: params
  })
}

// 积分账户---兑换商品---确定新增积分变动
export async function addIntegralFlow(params) {
  return request({
    url: `${window.SS_CRM}/crm/integral/addIntegralFlow`,
    method: 'post',
    data: params
  })
}

// 积分账户---积分变动---兑换商品下拉数据
export async function queryIntegralGoods(params) {
  return request({
    url: `${window.SS_CRM}/crm/integral/queryIntegralGoods`,
    method: 'post',
    data: params
  })
}

// 积分账户---积分变动---确定兑换积分
export async function addIntegralExchange(params) {
  return request({
    url: `${window.SS_CRM}/crm/integral/addIntegralExchange`,
    method: 'post',
    data: params
  })
}

// 兑换商品---新增商品---商品列表
export async function queryIntegralGoodsList(params) {
  return request({
    url: `${window.SS_CRM}/crm/integral/queryIntegralGoodsList`,
    method: 'post',
    data: params
  })
}

// 兑换商品---新增商品---确定新增积分商品
export async function addIntegralGoods(params) {
  return request({
    url: `${window.SS_CRM}/crm/integral/addIntegralGoods`,
    method: 'post',
    data: params
  })
}

// 兑换商品---修改商品---确定修改积分商品
export async function updateIntegralGoods(params) {
  return request({
    url: `${window.SS_CRM}/crm/integral/updateIntegralGoods`,
    method: 'post',
    data: params
  })
}

// 兑换商品---删除商品
export async function deleteIntegralGoods(params) {
  return request({
    url: `${window.SS_CRM}/crm/integral/deleteIntegralGoods`,
    method: 'post',
    data: params
  })
}

// 积分变动
export async function queryIntegralFlow(params) {
  return request({
    url: `${window.SS_CRM}/crm/integral/queryIntegralFlow`,
    method: 'post',
    data: params
  })
}

/** 判断上传的文件是否为模板文件 */
export function isModelFile(data) {
  return request({
    url: `${window.SS_CRM}/crm/integral/excel/isModelFile`,
    method: 'post',
    data
  })
}

/** 预览excel文件学员信息 */
export function previewData(data) {
  return request({
    url: `${window.SS_CRM}/crm/integral/excel/previewIntegralData`,
    method: 'post',
    data
  })
}

// 导入
export function importData(data) {
  return request({
    url: `${window.SS_CRM}/crm/integral/excel/importIntegral`,
    method: 'post',
    data
  })
}

// 导入是否完成
export function importComplete(data) {
  return request({
    url: `${window.SS_CRM}/crm/integral/excel/isComplete`,
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
