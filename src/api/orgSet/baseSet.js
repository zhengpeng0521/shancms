import request from '@/utils/request'

// 获取考勤签到的打印信息
export function signPrintInfo(query) {
  return request({
    url: '/ss-sys-provider/sysBase/print/signPrintInfo',
    method: 'post',
    params: query
  })
}

// 新增或更新显示考勤打印设置信息
export function saveAttendInfo(query) {
  return request({
    url: '/ss-sys-provider/sysBase/print/saveAttendInfo',
    method: 'post',
    data: query
  })
}

// 根据租户显示考勤打印设置信息
export function attendInfo(query) {
  return request({
    url: '/ss-sys-provider/sysBase/print/attendInfo',
    method: 'post',
    params: query
  })
}

// 签到打印保存
export function saveSignInPrintInfo(query) {
  return request({
    url: '/ss-sys-provider/sysBase/print/saveSignInPrintInfo',
    method: 'post',
    data: query
  })
}

// 签到表设置查询
export function querySignTable(query) {
  return request({
    url: '/ss-sys-provider/sysBase/print/querySignTable',
    method: 'post',
    params: query
  })
}

// 签到表打印设置保存
export function setSignTable(query) {
  return request({
    url: '/ss-sys-provider/sysBase/print/setSignTable',
    method: 'post',
    params: query
  })
}

// 教室列表查询
export function queryClassRoom(query) {
  return request({
    url: '/ss-crm-provider/sysBase/classroom/query',
    method: 'post',
    params: query
  })
}

// 教室-状态修改
export function statusUpdate(query) {
  return request({
    url: '/ss-crm-provider/sysBase/clsroom/statusUpdate',
    method: 'post',
    params: query
  })
}

// 教室-创建
export function createClassroom(query) {
  return request({
    url: '/ss-crm-provider/sysBase/classroom/create',
    method: 'post',
    params: query
  })
}

// 教室-编辑
export function updateClassroom(query) {
  return request({
    url: '/ss-crm-provider/sysBase/clsroom/update',
    method: 'post',
    params: query
  })
}

// 教室-删除
export function deleteClassroom(query) {
  return request({
    url: '/ss-crm-provider/sysBase/clsroom/delete',
    method: 'post',
    params: query
  })
}

// 教室-根据编号查询教室
export function queryById(query) {
  return request({
    url: '/ss-crm-provider/sysBase/classroom/queryById',
    method: 'post',
    params: query
  })
}

// 获取节假日列表
export function holidayList(query) {
  return request({
    url: '/ss-sys-provider/sysBase/holiday/list',
    method: 'post',
    params: query
  })
}

// 获取节假日详情
export function holidayGet(query) {
  return request({
    url: '/ss-sys-provider/sysBase/holiday/get',
    method: 'post',
    params: query
  })
}

// 节假日管理-修改
export function holidayUpdate(query) {
  return request({
    url: '/ss-sys-provider/sysBase/holiday/update',
    method: 'post',
    params: query
  })
}

// 节假日管理-删除
export function holidayDelete(query) {
  return request({
    url: '/ss-sys-provider/sysBase/holiday/delete',
    method: 'post',
    params: query
  })
}

// 节假日管理-新增
export function holidayCreate(query) {
  return request({
    url: '/ss-sys-provider/sysBase/holiday/create',
    method: 'post',
    params: query
  })
}

// 字典 ~ 查询 ~ 字典列表
export function dictList(query) {
  return request({
    url: '/ss-sys-provider/sysBase/dict/dictList',
    method: 'post',
    params: query
  })
}

// 字典 ~ 查询 ~ 字典列表
export function confChannelEditResult(query) {
  return request({
    url: '/ss-sys-provider/sysBase/conf/confChannelEditResult',
    method: 'post',
    params: query
  })
}

// 字典 ~ 删除 ~ 某一数据
export function deleteDictItem(query) {
  return request({
    url: '/ss-sys-provider/sysBase/dictItem/deleteDictItem',
    method: 'post',
    params: query
  })
}

// 字典 ~ 修改 ~ 某一数据
export function updateDictItem(query) {
  return request({
    url: '/ss-sys-provider/sysBase/dictItem/updateDictItem',
    method: 'post',
    params: query
  })
}

// 字典 ~ 添加 ~ 某一数据
export function addItem(query) {
  return request({
    url: '/ss-sys-provider/sysBase/dictItem/addItem',
    method: 'post',
    params: query
  })
}

// 修改校区一二级来源是否可变
export function saveChannel(query) {
  return request({
    url: '/ss-sys-provider/sys/conf/saveChannel',
    method: 'post',
    params: query
  })
}
