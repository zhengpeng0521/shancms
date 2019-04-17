import request from '@/utils/request'

/** 消课统计全部 */
export async function getUseClassAll(params) {
  return request({
    url: `${window.REPORT_URL}/cerp/stats/costSQ/queryByAllCourse`,
    method: 'post',
    data: params
  })
}

/** 课程统计 */
export async function getUseClassCourse(params) {
  return request({
    url: `${window.REPORT_URL}/cerp/stats/costSQ/queryByCourse`,
    method: 'post',
    data: params
  })
}

/** 机构统计 */
export async function getUseClassOrg(params) {
  return request({
    url: `${window.REPORT_URL}/cerp/stats/costSQ/queryByOrg`,
    method: 'post',
    data: params
  })
}

/** 授课老师统计 */
export async function getUseClassTeacher(params) {
  return request({
    url: `${window.REPORT_URL}/cerp/stats/costSQ/queryByTeacher`,
    method: 'post',
    data: params
  })
}

/** 负责销售统计 */
export async function getUseClassSale(params) {
  return request({
    url: `${window.REPORT_URL}/cerp/stats/costSQ/queryBySeller`,
    method: 'post',
    data: params
  })
}

/** 负责老师统计 */
export async function getUseClassCharge(params) {
  return request({
    url: `${window.REPORT_URL}/cerp/stats/costSQ/queryByCounselor`,
    method: 'post',
    data: params
  })
}
