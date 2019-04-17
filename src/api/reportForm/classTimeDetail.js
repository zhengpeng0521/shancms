import request from '@/utils/request'

// 课时详情
export async function getClassTimeDetail(params) {
  return request({
    url: `${window.REPORT_URL}/stu/stucard/detailQuery`,
    method: 'post',
    data: params
  })
}
