import request from '@/utils/request'

// 检测是否绑定人脸
export function isBindFace(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/stu/getZjlCRMStuMdBindList`,
    method: 'post',
    data
  })
}
