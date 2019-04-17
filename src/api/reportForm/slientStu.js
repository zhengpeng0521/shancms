import request from '@/utils/request'

/** 获取沉默学员数据 */
export async function getSlience(params) {
  return request({
    url: `${window.REPORT_URL}/erp/stats/silenceCost/silenceQuery`,
    method: 'post',
    data: params
  })
}
