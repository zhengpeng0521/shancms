import request from '@/utils/request'

// 获取赠送课时
export async function getGiveNum(params) {
  return request({
    url: `${window.REPORT_URL}/crm/statistics/seller/getGivePeriodNum`,
    method: 'post',
    data: params
  })
}

// 获取赠送时间
export async function getGiveTime(params) {
  return request({
    url: `${window.REPORT_URL}/crm/statistics/seller/getGivePeriodNumTime`,
    method: 'post',
    data: params
  })
}
