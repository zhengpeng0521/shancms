import request from '@/utils/request'

/** 时长月结表 */
export async function getTimeMonth(params) {
  return request({
    url: `${window.REPORT_URL}/crm/order/resultForMonth`,
    method: 'post',
    data: params
  })
}
