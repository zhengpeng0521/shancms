import request from '@/utils/request'

// 库存管理列表
export function getStock(query) {
  return request({
    url: `${window.SS_CRM}/crm/product/queryRepertory`,
    method: 'post',
    data: query
  })
}

// 删除库存
export function deleteStock(query) {
  return request({
    url: `${window.SS_CRM}/crm/product/deleteRepertory`,
    method: 'post',
    data: query
  })
}

// 获取物品下拉
export function getGoods(query) {
  return request({
    url: `${window.SS_CRM}/crm/product/queryRepertoryList`,
    method: 'post',
    data: query
  })
}

// 新增库存
export function addStock(query) {
  return request({
    url: `${window.SS_CRM}/crm/product/addRepertory`,
    method: 'post',
    data: query
  })
}

// 查看库存详情
export function getStockDetail(query) {
  return request({
    url: `${window.SS_CRM}/crm/product/getRepertory`,
    method: 'post',
    data: query
  })
}

// 编辑库存
export function editStock(query) {
  return request({
    url: `${window.SS_CRM}/crm/product/updateRepertory`,
    method: 'post',
    data: query
  })
}
