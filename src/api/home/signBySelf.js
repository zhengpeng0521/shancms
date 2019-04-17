import request from '@/utils/request'

// 家长自助扫码签到
export async function stuQuickSign(params) {
  return request({
    url: `${window.SS_CRM}/crm/sign/qrSign`,
    method: 'post',
    data: params
  })
}

// 扫码签到记录
export async function querySignSelf(params) {
  return request({
    url: `${window.SS_CRM}/crm/sign/query`,
    method: 'post',
    data: params
  })
}
