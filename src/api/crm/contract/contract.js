import request from '@/utils/request'

// 查询续约
export async function checkRenew(params) {
  return request({
    url: `${window.SS_CRM}/crm/contract/checkRenew`,
    method: 'post',
    data: params
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

// 获取合同列表
export async function queryOrder(params) {
  return request({
    url: `${window.SS_CRM}/crm/contract/queryOrder`,
    method: 'post',
    data: params
  })
}

// 审核合同
export async function passOrder(params) {
  return request({
    url: `${window.SS_CRM}/crm/contract/passOrder`,
    method: 'post',
    data: params
  })
}

// 驳回合同
export async function rejectOrder(params) {
  return request({
    url: `${window.SS_CRM}/crm/contract/rejectOrder`,
    method: 'post',
    data: params
  })
}

// 合同套餐
export async function queryContractProduct(params) {
  return request({
    url: `${window.SS_CRM}/crm/contract/queryContractProduct`,
    method: 'post',
    data: params
  })
}

// 删除合同套餐
export async function deleteContractProduct(params) {
  return request({
    url: `${window.SS_CRM}/crm/contract/deleteContractProduct`,
    method: 'post',
    data: params
  })
}

// 合同侧边---收款单
export async function payInfoList(params) {
  return request({
    url: `${window.SS_CRM}/crm/purchaseCollection/payInfoList`,
    method: 'post',
    data: params
  })
}

// 合同侧边---合同详情
export async function getOrderDetailById(params) {
  return request({
    url: `${window.SS_CRM}/crm/contract/getOrderDetailById`,
    method: 'post',
    data: params
  })
}

// 合同侧边---审核记录
export async function queryOrderCheckRecord(params) {
  return request({
    url: `${window.SS_CRM}/crm/contract/queryOrderCheckRecord`,
    method: 'post',
    data: params
  })
}

// 合同侧边---合同修改到期时间
export async function putOffOrder(params) {
  return request({
    url: `${window.SS_CRM}/crm/contract/putOffOrder`,
    method: 'post',
    data: params
  })
}

// 合同侧边---合同作废
export async function invalidOrder(params) {
  return request({
    url: `${window.SS_CRM}/crm/contract/invalidOrder`,
    method: 'post',
    data: params
  })
}

// 合同侧边---查看合同附件
export async function getOrderImg(params) {
  return request({
    url: `${window.SS_CRM}/crm/contract/getOrderImg`,
    method: 'post',
    data: params
  })
}
// 合同侧边---修改合同附件
export async function updateOrderImg(params) {
  return request({
    url: `${window.SS_CRM}/crm/contract/updateOrderImg`,
    method: 'post',
    data: params
  })
}

// 合同侧边---删除合同
export async function deleteOrder(params) {
  return request({
    url: `${window.SS_CRM}/crm/contract/deleteOrder`,
    method: 'post',
    data: params
  })
}

// 合同侧边---再次提交
export async function resubmit(params) {
  return request({
    url: `${window.SS_CRM}/crm/contract/resubmit`,
    method: 'post',
    data: params
  })
}

// 新增套餐---课程摘要查询
export async function summaryQuery(params) {
  return request({
    url: `${window.SS_CRM}/cerp/course/summaryQuery`,
    method: 'post',
    data: params
  })
}

// 新增套餐---确定添加套餐
export async function addContractProduct(params) {
  return request({
    url: `${window.SS_CRM}/crm/contract/addContractProduct`,
    method: 'post',
    data: params
  })
}

// 新增套餐---托班类型下拉列表
export async function dictGetByKey(params) {
  return request({
    url: `${window.SYS_URL}/sysBase/dict/dictGetByKey`,
    method: 'post',
    data: params
  })
}

// 编辑套餐---合同套餐详情
export async function getContractProduct(params) {
  return request({
    url: `${window.SS_CRM}/crm/contract/getContractProduct`,
    method: 'post',
    data: params
  })
}

// 编辑套餐---确定编辑合同套餐
export async function updateContractProduct(params) {
  return request({
    url: `${window.SS_CRM}/crm/contract/updateContractProduct`,
    method: 'post',
    data: params
  })
}

// 合同收款---定金列表查询
export async function queryPurchaseDeposit(params) {
  return request({
    url: `${window.SS_CRM}/crm/purchaseDeposit/query`,
    method: 'post',
    data: params
  })
}

// 合同收款---确定合同绑定定金
export async function bindDeposit(params) {
  return request({
    url: `${window.SS_CRM}/crm/purchaseDeposit/bindDeposit`,
    method: 'post',
    data: params
  })
}

// 合同收款---收款方式列表查询
export async function queryPaymentAccountList(params) {
  return request({
    url: `${window.SYS_URL}/sysBase/payment/queryPaymentAccountList`,
    method: 'post',
    data: params
  })
}

// 合同收款---确定支付合同
export async function payOrder(params) {
  return request({
    url: `${window.SS_CRM}/crm/contract/payOrder`,
    method: 'post',
    data: params
  })
}

// 新建合同---自动生成合同编号
export async function getOrderNum(params) {
  return request({
    url: `${window.SS_CRM}/crm/contract/getOrderNum`,
    method: 'post',
    data: params
  })
}

// 新建合同---学员列表数据查询
export async function queryCRMStuList(params) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/stu/queryCRMStuList`,
    method: 'post',
    data: params
  })
}

// 新建合同---物资列表下拉数据查询
export async function queryTeachingAid(params) {
  return request({
    url: `${window.SS_CRM}/crm/product/queryTeachingAid`,
    method: 'post',
    data: params
  })
}

// 新建合同---关联销售下拉数据查询
export async function summaryQueryTenantUser(params) {
  return request({
    url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`,
    method: 'post',
    data: params
  })
}

// 新建合同---合同规则查询
export async function queryPurchaseConf(params) {
  return request({
    url: `${window.SYS_URL}/sysBase/purchase/queryPurchaseConf`,
    method: 'post',
    data: params
  })
}

// 新建合同---确定新增合同
export async function addClassOrder(params) {
  const orderType = params.orderType
  if (orderType === '3') {
    params.nurpkg = params.classpkg
    return request({
      url: `${window.SS_CRM}/crm/contract/addNurOrder`,
      method: 'post',
      data: params
    })
  } else {
    return request({
      url: `${window.SS_CRM}/crm/contract/addClassOrder`,
      method: 'post',
      data: params
    })
  }
}

// 编辑合同---获取编辑合同数据
export async function getOrder(params) {
  return request({
    url: `${window.SS_CRM}/crm/contract/getOrder`,
    method: 'post',
    data: params
  })
}

// 编辑合同---确定编辑合同
export async function updateClassOrder(params) {
  return request({
    url: `${window.SS_CRM}/crm/contract/updateClassOrder`,
    method: 'post',
    data: params
  })
}
// 潜在学员id获取家长列表
export function parentList(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/clue/parentList`,
    method: 'post',
    data
  })
}
// c查询合同打印信息
export function getOrderPrint(data) {
  return request({
    url: `${window.SS_CRM}/crm/contract/getOrderPrint`,
    method: 'post',
    data
  })
}
