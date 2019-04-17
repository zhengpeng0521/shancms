import request from '@/utils/request'

/** 销售业绩图表 */
export async function getAchivementList(params) {
  return request({
    url: `${window.REPORT_URL}/crm/statistics/seller/dup/sellerBroken`,
    method: 'post',
    data: params
  })
}

/** 销售业绩列表 */
export async function getAchivementData(params) {
  return request({
    url: `${window.REPORT_URL}/crm/statistics/seller/dup/getSellerPerList`,
    method: 'post',
    data: params
  })
}
