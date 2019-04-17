import request from '@/utils/request'

// 教室利用率
export async function getClassroom(params) {
  return request({
    url: `${window.REPORT_URL}/erp/stats/SQRoom/queryRoom`,
    method: 'post',
    data: params
  })
}
