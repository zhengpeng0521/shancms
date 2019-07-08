import request from '@/utils/request'

// 跟进方式/跟进状态
export function dictGetByKey(data) {
  return request({
    url: `${window.SYS_URL}/sysBase/dict/dictGetByKey`,
    method: 'post',
    data
  })
}
// 家长列表
export function parentList(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/clue/parentList`,
    method: 'post',
    data
  })
}
// 根据ID查询在读学员家长信息
export function parentSummary(data) {
  return request({
    url: `${window.SS_CRM}/stu/parent/parentSummary`,
    method: 'post',
    data
  })
}

// 根据ID查询潜在学员家长信息
export function summeryParentInfo(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/clue/summeryParentInfo`,
    method: 'post',
    data
  })
}

// 根据ID删除名单家长信息
export function deleteClueParent(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/clue/deleteClueParent`,
    method: 'post',
    data
  })
}

// 根据ID删除学员家长信息
export function deleteParents(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/parent/deleteParents`,
    method: 'post',
    data
  })
}

// 查询跟进记录
export function getLeadsRecord(data) {
  return request({
    url: `${window.SS_CRM}/crm/commRecord/recordQuery`,
    method: 'post',
    data
  })
}
// 发布跟进记录
export function createLeadsRecord(data) {
  return request({
    url: `${window.SS_CRM}/crm/commRecord/create`,
    method: 'post',
    data
  })
}
// 修改
export function update(data) {
  return request({
    url: `${window.SS_CRM}/crm/commRecord/update`,
    method: 'post',
    data
  })
}
// 删除
export function Delete(data) {
  return request({
    url: `${window.SS_CRM}/crm/commRecord/delete`,
    method: 'post',
    data
  })
}

// 查询到访记录
export function getVisiteList(data) {
  return request({
    url: `${window.SS_CRM}/crm/visit/queryVisitRecord`,
    method: 'post',
    data
  })
}
// 新增到访记录
export function addVisitRecord(data) {
  return request({
    url: `${window.SS_CRM}/crm/visit/addVisitRecord`,
    method: 'post',
    data
  })
}
// 编辑到访记录
export function updateVisitRecord(data) {
  return request({
    url: `${window.SS_CRM}/crm/visit/updateVisitRecord`,
    method: 'post',
    data
  })
}
// 更新到访记录状态
export function updateVisitStatus(data) {
  return request({
    url: `${window.SS_CRM}/crm/visit/updateVisitStatus`,
    method: 'post',
    data
  })
}
/** 获取预约试听列表 */
export function getListenList(data) {
  return request({
    url: `${window.SS_CRM}/crm/subscribeAudition/qureyList`,
    method: 'post',
    data
  })
}

/** 获取学员家长信息 */
export function getParentList(data) {
  return request({
    url: `${window.SS_CRM}/stu/parent/getStuParentList`,
    method: 'post',
    data
  })
}

/** 获取名单家长信息 */
export function parentOrderList(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/clue/parentList`,
    method: 'post',
    data
  })
}

/** 名单家长手机号查重 */
export function parentDupCheck(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/clue/parentDupCheck`,
    method: 'post',
    data
  })
}

/** 学员家长手机号查重 */
export function getOpenIdByMobile(data) {
  return request({
    url: `${window.SS_CRM}/stu/parent/getOpenIdByMobile`,
    method: 'post',
    data
  })
}

/** 添加名单关联家长 */
export function addClueParent(data) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/clue/addClueParent`,
    method: 'post',
    data
  })
}

/** 添加学员关联家长 */
export function createParent(data) {
  return request({
    url: `${window.SS_CRM}/stu/parent/createParent`,
    method: 'post',
    data
  })
}

/** 获取家长关系下拉信息 */
export function getParentDictGetByKey(data) {
  return request({
    url: `${window.SYS_URL}/sysBase/dict/dictGetByKey`,
    method: 'post',
    data
  })
}

/** 获取合同 */
export function queryOrder(data) {
  return request({
    url: `${window.SS_CRM}/crm/contract/queryOrder`,
    method: 'post',
    data
  })
}

/** 获取学员账户 */
export function getVipCard(data) {
  return request({
    url: `${window.SS_CRM}/crm/student/getBaseInfo`,
    method: 'post',
    data
  })
}

/** 获取托班套餐 */
export function getNursery(data) {
  return request({
    url: `${window.SS_CRM}/stu/nur/queryNurPackList`,
    method: 'post',
    data
  })
}

/** 获取已消耗课时 */
export function getUsedPeriods(data) {
  return request({
    url: `${window.SS_CRM}/crm/stucard/consumePerByStuId`,
    method: 'post',
    data
  })
}

/** 获取约课记录 */
export function getOrderClass(data) {
  return request({
    url: `${window.SS_CRM}/cerp/cpbook/stuCpbookQuery`,
    method: 'post',
    data
  })
}

/** 获取作品详情 */
export function getProduction(data) {
  return request({
    url: `${window.SS_CRM}/cerp/stuWork/query`,
    method: 'post',
    data
  })
}
