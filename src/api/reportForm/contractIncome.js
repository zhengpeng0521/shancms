import request from '@/utils/request'

// 签约类型/学员收入
export async function getSignType(params) {
  return request({
    url: `${window.REPORT_URL}/crm/statistics/seller/getSignType`,
    method: 'post',
    data: params
  })
}

// 套餐收入
export async function getPackList(params) {
  return request({
    url: `${window.REPORT_URL}/crm/statistics/seller/getPeriodPackList`,
    method: 'post',
    data: params
  })
}

// 教材收入
export async function getTeachList(params) {
  return request({
    url: `${window.REPORT_URL}/crm/statistics/seller/getTeachAidList`,
    method: 'post',
    data: params
  })
}
