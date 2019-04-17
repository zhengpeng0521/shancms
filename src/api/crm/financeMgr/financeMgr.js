import request from '@/utils/request'

const baseUrl = 'ss-crm-provider'
const baseUrlSys = 'ss-sys-provider'

// 查询定金管理列表
export function purchaseDepositQuery(data) {
  return request({
    url: baseUrl + '/crm/purchaseDeposit/query',
    method: 'post',
    data
  })
}

// 定金管理---确认退款
export function purchaseDepositBack(data) {
  return request({
    url: baseUrl + '/crm/purchaseDeposit/back',
    method: 'post',
    data
  })
}

// 定金管理---确认删除
export function purchaseDepositDelete(data) {
  return request({
    url: baseUrl + '/crm/purchaseDeposit/delete',
    method: 'post',
    data
  })
}

// 定金管理---新建定金弹框---学员下拉列表
export function summaryQuery(data) {
  return request({
    url: baseUrl + '/crm/stuInfo/stu/summaryQuery',
    method: 'post',
    data
  })
}

// 定金管理---高级搜索---收款方式数据
export function queryPaymentAccountList(data) {
  return request({
    url: baseUrlSys + '/sysBase/payment/queryPaymentAccountList',
    method: 'post',
    data
  })
}

// 定金管理---新建定金弹框---确定新增定金
export function purchaseDepositCreate(data) {
  return request({
    url: baseUrl + '/crm/purchaseDeposit/create',
    method: 'post',
    data
  })
}

// 收款管理
export function payInfoList(data) {
  return request({
    url: baseUrl + '/crm/purchaseCollection/payInfoList',
    method: 'post',
    data
  })
}

// 收款管理---到账审核
export function checkPayInfo(data) {
  return request({
    url: baseUrl + '/crm/purchaseCollection/checkPayInfo',
    method: 'post',
    data
  })
}

// 退款列表
export function refundOrderList(data) {
  return request({
    url: baseUrl + '/crm/purchaseRefund/refundOrderList',
    method: 'post',
    data
  })
}

// 退款列表---审核退款弹框---获取数据
export function getRefundOrderById(data) {
  return request({
    url: baseUrl + '/crm/purchaseRefund/getRefundOrderById',
    method: 'post',
    data
  })
}

// 退款列表---审核退款弹框---确认退款
export function acceptRefundOrder(data) {
  return request({
    url: baseUrl + '/crm/purchaseRefund/acceptRefundOrder',
    method: 'post',
    data
  })
}

// 退款列表---审核退款弹框---驳回
export function rejectRefundOrder(data) {
  return request({
    url: baseUrl + '/crm/purchaseRefund/rejectRefundOrder',
    method: 'post',
    data
  })
}

// 退款列表---新建退款单弹框---会员卡下拉列表
export function stuCardSummary(data) {
  return request({
    url: baseUrl + '/crm/stucard/stuCardSummary',
    method: 'post',
    data
  })
}

// 退款列表---新建退款单弹框---合同编号下拉列表
export function purSummByCardId(data) {
  return request({
    url: baseUrl + '/crm/student/purSummByCardId',
    method: 'post',
    data
  })
}

// 退款列表---新建退款单弹框---选择退课下拉列表
export function getRefundInfo(data) {
  return request({
    url: baseUrl + '/crm/purchaseRefund/getRefundInfo',
    method: 'post',
    data
  })
}

// 退款列表---新建退款单弹框---可退时长信息
export function getNurRefundInfo(data) {
  return request({
    url: baseUrl + '/stu/nur/getNurRefundInfo',
    method: 'post',
    data
  })
}

// 退款列表---新建退款单弹框---退时长合同编号
export function queryNurPackList(data) {
  return request({
    url: baseUrl + '/stu/nur/queryNurPackList',
    method: 'post',
    data
  })
}

// 退款列表---新建退款单弹框---确定创建退款单
export function createRefundOrder(data) {
  return request({
    url: baseUrl + '/crm/purchaseRefund/createRefundOrder',
    method: 'post',
    data
  })
}
