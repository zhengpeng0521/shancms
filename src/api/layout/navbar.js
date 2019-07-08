import request from '@/utils/request'

// 修改密码
export async function changePwd(params) {
  return request({
    url: `${window.SYS_URL}/sysBase/tenantUser/changePassword`,
    method: 'post',
    data: params
  })
}
