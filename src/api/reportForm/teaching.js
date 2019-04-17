import request from '@/utils/request'

/** 授课图表 */
export async function getCourseTimes(params) {
  return request({
    url: `${window.REPORT_URL}/cerp/stuClass/queryByCourse`,
    method: 'post',
    data: params
  })
}

/** 授课列表 */
export async function getTeachTable(params) {
  return request({
    url: `${window.REPORT_URL}/cerp/stuClass/query`,
    method: 'post',
    data: params
  })
}

/** 授课明细 */
export async function getTachingDetail(params) {
  return request({
    url: `${window.REPORT_URL}/cerp/stuClass/queryDetail`,
    method: 'post',
    data: params
  })
}
