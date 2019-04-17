import request from '@/utils/request'

// 获取设置列表
export function showTableColumn(data) {
  return request({
    url: '/ss-sys-provider/sysBase/column/showTableColumn',
    method: 'post',
    data
  })
}

// 设置表格列
export function saveTableColumn(data) {
  return request({
    url: '/ss-sys-provider/sysBase/column/saveTableColumn',
    method: 'post',
    data
  })
}
