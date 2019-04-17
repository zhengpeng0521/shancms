import request from '@/utils/request'

// 机构图片获取
export function getOrgan(data) {
  return request({
    url: `${window.SYS_URL}/sysBase/org/getOrgan`,
    method: 'post',
    data
  })
}
