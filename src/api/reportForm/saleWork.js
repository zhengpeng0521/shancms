import request from '@/utils/request'
/** 销售工作列表 */
export async function getSaleWork(params) {
  return request({
    url: `${window.REPORT_URL}/crm/statistics/seller/dup/getSellerJobList`,
    method: 'post',
    data: params
  })
}

/** 角色下拉 */
export async function getSelect(params) {
  return request({
    url: `${window.SYS_URL}/sysBase/role/tenantRoleQuery`,
    method: 'post',
    data: params
  })
}

/** 来源 */
export async function getChannel(params) {
  return request({
    url: `${window.REPORT_URL}/crm/statistics/seller/dup/getChannelBySellerId`,
    method: 'post',
    data: params
  })
}
