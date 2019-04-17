import request from '@/utils/request'

// 是否开通外呼中心
export async function getIsOpen(params) {
  return request({
    url: `${window.SS_CRM}/crm/calloutManage/getIsOpen`,
    method: 'post',
    data: params
  })
}

// 坐席列表查询
export async function getCenterSeatList(params) {
  return request({
    url: `${window.SS_CRM}/crm/calloutManage/getCenterSeatList`,
    method: 'post',
    data: params
  })
}

// 剩余可分配时长数据
export async function getManageDuration(params) {
  return request({
    url: `${window.SS_CRM}/crm/calloutTimeAllot/getManageDuration`,
    method: 'post',
    data: params
  })
}
