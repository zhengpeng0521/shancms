import request from '@/utils/request'

// 开通截止日期查询
export function queryMealOpening(query) {
  return request({
    url: '/ss-sys-provider/sysPack/mealZsb/queryMealOpening',
    method: 'post',
    params: query
  })
}
