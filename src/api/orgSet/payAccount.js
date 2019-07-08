import request from '@/utils/request'

// 收款方式列表查询
export function queryPaymentAccountList(query) {
  return request({
    url: '/ss-sys-provider/sysBase/payment/queryPaymentAccountList',
    method: 'post',
    data: query
  })
}

// 收款方式详细查询
export function getPaymentAccount(query) {
  return request({
    url: '/ss-sys-provider/sysBase/payment/getPaymentAccount',
    method: 'post',
    data: query
  })
}

// 新增支付方式
export function addPaymentAccount(query) {
  return request({
    url: '/ss-sys-provider/sysBase/payment/addPaymentAccount',
    method: 'post',
    data: query
  })
}

// 修改支付方式
export function updatePaymentAccount(query) {
  return request({
    url: '/ss-sys-provider/sysBase/payment/updatePaymentAccount',
    method: 'post',
    data: query
  })
}

// 修改账户状态
export function updateStatus(query) {
  return request({
    url: '/ss-sys-provider/sysBase/payment/updateStatus',
    method: 'post',
    data: query
  })
}

// 删除账户状态
export function deletePaymentAccount(query) {
  return request({
    url: '/ss-sys-provider/sysBase/payment/deletePaymentAccount',
    method: 'post',
    data: query
  })
}

// 查询账户流水
export function queryPayHistoryAccountList(query) {
  return request({
    url: '/ss-sys-provider/sysBase/payment/queryPayHistoryAccountList',
    method: 'post',
    data: query
  })
}

// 查询支付退款明细
export function queryPayOrderMsgList(query) {
  return request({
    url: '/ss-sys-provider/sysBase/payment/queryPayOrderMsgList',
    method: 'post',
    data: query
  })
}

// 统计某一条件下的总数据
export function queryPayOrderTotal(query) {
  return request({
    url: '/ss-sys-provider/sysBase/payment/queryPayOrderTotal',
    method: 'post',
    data: query
  })
}

// 查询账户信息
export function queryPayAccountMsg(query) {
  return request({
    url: '/ss-sys-provider/sysBase/payment/queryPayAccountMsg',
    method: 'post',
    data: query
  })
}

// 查询提现记录
export function queryPaySetRecordList(query) {
  return request({
    url: '/ss-sys-provider/sysBase/payment/queryPaySetRecordList',
    method: 'post',
    data: query
  })
}

// 查询安全手机号和银行卡信息

export function queryPayTelBankMsg(query) {
  return request({
    url: '/ss-sys-provider/sysBase/payment/queryPayTelBankMsg',
    method: 'post',
    data: query
  })
}

// 查询安全手机号和银行卡信息--（新）

export function querySecurtyMobile(query) {
  return request({
    url: '/ss-sys-provider/sysBase/security/querySecurtyMobile',
    method: 'post',
    data: query
  })
}

// 获取二维码

export function genVerifyCodeM(query) {
  return request({
    url: '/ss-sys-provider/sysServer/sms/genVerifyCodeM',
    method: 'post',
    data: query
  })
}

// 新增，改绑安全手机号

export function setSecurtyMobile(query) {
  return request({
    url: '/ss-sys-provider/sysBase/security/setSecurtyMobile',
    method: 'post',
    data: query
  })
}

// 上缴总部

export function turnIn(query) {
  return request({
    url: '/ss-sys-provider/sysBase/payment/turnIn',
    method: 'post',
    data: query
  })
}

// 总部校区查询
export function getHqOrgan(query) {
  return request({
    url: '/ss-sys-provider/sysBase/org/getHqOrgan',
    method: 'post',
    data: query
  })
}

// 提现申请
export function addSett(query) {
  return request({
    url: '/ss-sys-provider/sysBase/payment/addSett',
    method: 'post',
    data: query
  })
}
