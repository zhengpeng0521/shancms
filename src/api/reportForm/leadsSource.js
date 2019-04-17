import request from '@/utils/request'

export async function getLeadsData(params) {
  return request({
    url: `${window.REPORT_URL}/crm/statistics/leadsSourceQuery`,
    method: 'post',
    data: params
  })
}
