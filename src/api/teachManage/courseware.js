import request from '@/utils/request'

// 查询课件列表
export function queryCourseware(data) {
  return request({
    url: `${window.SS_CRM}/cerp/courseware/query`,
    method: 'post',
    data
  })
}
// 查询课件目录列表
export function summeryQueryCat(data) {
  return request({
    url: `${window.SS_CRM}/cerp/courseware/summeryQueryCat`,
    method: 'post',
    data
  })
}
// 获取课件图片数量
export function getImgTotal(data) {
  return request({
    url: `${window.SS_CRM}/cerp/courseware/getImgTotal`,
    method: 'post',
    data
  })
}
// 查看课件详情
export function imgDetail(data) {
  return request({
    url: `${window.SS_CRM}/cerp/courseware/cwdetail`,
    method: 'post',
    data
  })
}
// 课件打印
export function print(data) {
  return request({
    url: `${window.SS_CRM}/cerp/courseware/print`,
    method: 'post',
    data
  })
}
/* mock */
export function getCoursewareList(query) {
  return request({
    url: '/courseware/getCoursewareList',
    method: 'get',
    params: query
  })
}
export function getCoursewareDetail(query) {
  return request({
    url: '/courseware/getCoursewareDetail',
    method: 'get',
    params: query
  })
}
