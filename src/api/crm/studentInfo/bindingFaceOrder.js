import request from '@/utils/request'

// 绑定学生用户人脸
export function bindMemberToStuEx(data) {
  return request({
    url: `/smartshop/smartshop/md/bindMemberToStuEx`,
    method: 'post',
    data
  })
}

// 绑定家长用户人脸
export function bindMemberToParentEx(data) {
  return request({
    url: `/smartshop/smartshop/md/bindMemberToParentEx`,
    method: 'post',
    data
  })
}
