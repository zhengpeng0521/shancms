import request from '@/utils/request'

// 按学员人数柱形
export async function getStuBycourse(params) {
  return request({
    url: `${window.REPORT_URL}/cerp/stats/cerpCourseSellStuNumByCourse`,
    method: 'post',
    data: params
  })
}

// 按学员人数折线
export async function getStuByDate(params) {
  return request({
    url: `${window.REPORT_URL}/cerp/stats/cerpCourseSellStuNumByDate`,
    method: 'post',
    data: params
  })
}

// 按课时数柱形
export async function getTimesBycourse(params) {
  return request({
    url: `${window.REPORT_URL}/cerp/stats/cerpCourseSellCourseHourByCourse`,
    method: 'post',
    data: params
  })
}

// 按课时数折线
export async function getTimesByDate(params) {
  return request({
    url: `${window.REPORT_URL}/cerp/stats/cerpCourseSellCourseCountByDate`,
    method: 'post',
    data: params
  })
}
