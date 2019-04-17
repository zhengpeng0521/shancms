import request from '@/utils/request'

// 自主约课查询
export function bookCourseConf(query) {
  return request({
    url: '/ss-sys-provider/sysBase/conf/bookCourseConf',
    method: 'post',
    params: query
  })
}

// 修改自主约课配置
export function changeBookCource(query) {
  return request({
    url: '/ss-sys-provider/sysBase/conf/changeBookCource',
    method: 'post',
    data: query
  })
}

// 显示项设置列表查询
export function menuConfList(query) {
  return request({
    url: '/ss-sys-provider/sysBase/conf/menuConfList',
    method: 'post',
    params: query
  })
}

// 修改家校通移动端可见设置
export function changeCommentMenu(query) {
  return request({
    url: '/ss-sys-provider/sysBase/conf/changeCommentMenu',
    method: 'post',
    data: query
  })
}
