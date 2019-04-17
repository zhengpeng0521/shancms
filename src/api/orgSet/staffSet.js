import request from '@/utils/request'

// 获取员工列表
export function queryList(query) {
  return request({
    url: '/ss-sys-provider/sysBase/tenantUser/query',
    method: 'post',
    params: query
  })
}

// 查询机构下用户
export function chiefUserQuery(query) {
  return request({
    url: '/ss-sys-provider/sysBase/tenantUser/chiefUserQuery',
    method: 'post',
    params: query
  })
}

// 员工详情查询
export function detailById(query) {
  return request({
    url: '/ss-sys-provider/sysBase/tenantUser/detailById',
    method: 'post',
    params: query
  })
}

// 员工角色详情
export function summaryRoleQuery(query) {
  return request({
    url: '/ss-sys-provider/sysBase/role/summaryQuery',
    method: 'post',
    params: query
  })
}

// 员工管理-新增员工
export function create(query) {
  return request({
    url: '/ss-sys-provider/sysBase/tenantUser/create',
    method: 'post',
    params: query
  })
}

// 修改员工职能
export function modifyFunctions(query) {
  return request({
    url: '/ss-sys-provider/sysBase/tenantUser/modifyFunctions',
    method: 'post',
    params: query
  })
}

// 员工删除
export function deleteOrFired(query) {
  return request({
    url: '/ss-sys-provider/sysBase/tenantUser/deleteOrFired',
    method: 'post',
    params: query
  })
}

// 员工编辑
export function update(query) {
  return request({
    url: '/ss-sys-provider/sysBase/tenantUser/update',
    method: 'post',
    params: query
  })
}

// 部门查询
export function summaryQuery(query) {
  return request({
    url: '/ss-sys-provider/sysBase/department/summaryQuery',
    method: 'post',
    params: query
  })
}

// 部门组织架构树查询
export function formatList(query) {
  return request({
    url: '/ss-sys-provider/sysBase/department/formatList',
    method: 'post',
    params: query
  })
}

// 部门新增
export function creatDepartment(query) {
  return request({
    url: '/ss-sys-provider/sysBase/department/creat',
    method: 'post',
    params: query
  })
}

// 部门编辑
export function updateDepartment(query) {
  return request({
    url: '/ss-sys-provider/sysBase/department/update',
    method: 'post',
    params: query
  })
}

// 部门删除
export function deleteDepartment(query) {
  return request({
    url: '/ss-sys-provider/sysBase/department/delete',
    method: 'post',
    params: query
  })
}

// 角色查询
export function tenantRoleQuery(query) {
  return request({
    url: '/ss-sys-provider/sysBase/role/tenantRoleQuery',
    method: 'post',
    params: query
  })
}

// 获取角色tree资源树
export function resourceTreeQuery(query) {
  return request({
    url: '/ss-sys-provider/sysBase/role/resourceTreeQuery',
    method: 'post',
    params: query
  })
}

// 创建角色
export function tenantRoleCreate(query) {
  return request({
    url: '/ss-sys-provider/sysBase/role/tenantRoleCreate',
    method: 'post',
    params: query
  })
}

// 复制角色
export function tenantRoleCopy(query) {
  return request({
    url: '/ss-sys-provider/sysBase/role/tenantRoleCopy',
    method: 'post',
    params: query
  })
}

// 编辑角色
export function tenantRoleUpdate(query) {
  return request({
    url: '/ss-sys-provider/sysBase/role/tenantRoleUpdate',
    method: 'post',
    params: query
  })
}

// 删除角色
export function tenantRoleDelete(query) {
  return request({
    url: '/ss-sys-provider/sysBase/role/tenantRoleDelete',
    method: 'post',
    params: query
  })
}

// 操作权限
export function operateQuery(query) {
  return request({
    url: '/ss-sys-provider/sysBase/role/operateQuery',
    method: 'post',
    params: query
  })
}

// 获取老师工资设置
export function getUserWageSetting(query) {
  return request({
    url: '/ss-sys-provider/sysBase/userWage/getUserWageSetting',
    method: 'post',
    params: query
  })
}

// 获取老师工资设置
export function queryUserWageSettingList(query) {
  return request({
    url: '/ss-sys-provider/sysBase/userWage/queryUserWageSettingList',
    method: 'post',
    params: query
  })
}

// 新增工资设置
export function saveUserWageSetting(query) {
  return request({
    url: '/ss-sys-provider/sysBase/userWage/saveUserWageSetting',
    method: 'post',
    data: query
  })
}

// 工资设置-编辑
export function updateUserWageSetting(query) {
  return request({
    url: '/ss-sys-provider/sysBase/userWage/updateUserWageSetting',
    method: 'post',
    params: query
  })
}

// 工资设置-编辑
export function summaryCourseQuery(query) {
  return request({
    url: '/ss-crm-provider/cerp/course/summaryQuery',
    method: 'post',
    params: query
  })
}
