import request from '@/utils/request'

// 获取课时月结表总计
export async function getClassMonthTotal(params) {
  return request({
    url: `${window.REPORT_URL}/crm/cardReport/queryPeriodMonthTotal`,
    method: 'post',
    data: params
  })
}

// 获取课时月结表列表
export async function getClassMonthList(params) {
  return request({
    url: `${window.REPORT_URL}/crm/cardReport/queryPeriodMonthList`,
    method: 'post',
    data: params
  })
}
