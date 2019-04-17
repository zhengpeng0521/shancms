import request from '@/utils/request'

// 库存明细列表
export function getStockDetail(query) {
  return request({
    url: `${window.SS_CRM}/crm/product/queryRepertoryDetail`,
    method: 'post',
    data: query
  })
}
