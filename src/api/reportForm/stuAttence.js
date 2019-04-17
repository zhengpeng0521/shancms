import request from '@/utils/request'

/** 考勤-课程 */
export async function getAttenceByCourse(params) {
  return request({
    url: `${window.REPORT_URL}/cerp/stats/querySQMStuCheckByCourse`,
    method: 'post',
    data: params
  })
}

/** 考勤-主教 */
export async function getAttenceByMteacher(params) {
  return request({
    url: `${window.REPORT_URL}/cerp/stats/querySQMStuCheckByMteacher`,
    method: 'post',
    data: params
  })
}

/** 考勤-助教 */
export async function getAttenceByAteacher(params) {
  return request({
    url: `${window.REPORT_URL}/cerp/stats/querySQMStuCheckByAteacher`,
    method: 'post',
    data: params
  })
}

/** 考勤-学员 */
export async function getAttenceByStu(params) {
  return request({
    url: `${window.REPORT_URL}/crm/erp/statistics/queryByStuName`,
    method: 'post',
    data: params
  })
}

/** 考勤-上课明细 */
export async function getAttenceByPlan(params) {
  return request({
    url: `${window.REPORT_URL}/crm/erp/statistics/queryStuCheckByPlan`,
    method: 'post',
    data: params
  })
}
