import request from '@/utils/request'

/** 工资列表 */
export async function getSalary(params) {
  return request({
    url: `${window.REPORT_URL}/crm/salary/teacherSalaryQuery`,
    method: 'post',
    data: params
  })
}
