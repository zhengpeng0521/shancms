import request from '@/utils/request'

// 物资管理列表
export function getMaterialsMgr(data) {
  return request({
    url: `${window.SS_CRM}/crm/product/queryTeachingAid`,
    method: 'post',
    data
  })
}

// 删除物资
export function removeMaterials(data) {
  return request({
    url: `${window.SS_CRM}/crm/product/deleteTeachingAid`,
    method: 'post',
    data
  })
}

// 新增物资
export function addMaterials(data) {
  return request({
    url: `${window.SS_CRM}/crm/product/addTeachingAid`,
    method: 'post',
    data
  })
}

// 物资详情
export function getMaterialsDetail(data) {
  return request({
    url: `${window.SS_CRM}/crm/product/getTeachingAid`,
    method: 'post',
    data
  })
}

// 物资编辑
export function editMaterials(data) {
  return request({
    url: `${window.SS_CRM}/crm/product/updateTeachingAid`,
    method: 'post',
    data
  })
}
