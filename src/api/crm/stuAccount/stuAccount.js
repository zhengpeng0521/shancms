import request from '@/utils/request'

const baseUrl = 'ss-crm-provider'
const baseUrlSys = 'ss-sys-provider'

// 根据课程查询学员账户列表
export function batchStuList(data) {
  return request({
    url: baseUrl + '/crm/stucard/batchStuList',
    method: 'post',
    data
  })
}

// 批量消课
export function batchRepealCourse(data) {
  return request({
    url: baseUrl + '/crm/stucard/batchRepealCourse',
    method: 'post',
    data
  })
}

// 查询批量消课结果
export function batchRepealResult(data) {
  return request({
    url: baseUrl + '/crm/stucard/batchResult',
    method: 'post',
    data
  })
}

// 查询学员账户列表
export function stuCardListByCon(data) {
  return request({
    url: baseUrl + '/crm/student/stuCardListByCon',
    method: 'post',
    data
  })
}

// 学员账户---新增消课---消课学员接口
export function getStuInfoList(data) {
  return request({
    url: baseUrl + '/crm/student/getStuInfo',
    method: 'post',
    data
  })
}

// 学员账户---新增消课---确定新增消课学员
export function createRepealCourse(data) {
  return request({
    url: baseUrl + '/crm/student/createRepealCourse',
    method: 'post',
    data
  })
}

// 学员账户---解冻---确定解冻学员账户
export function thawStuCard(data) {
  return request({
    url: baseUrl + '/crm/stucard/thawStuCard',
    method: 'post',
    data
  })
}

// 学员账户---冻结--确定冻结学员账户
export function freezeStuCard(data) {
  return request({
    url: baseUrl + '/crm/stucard/freezeStuCard',
    method: 'post',
    data
  })
}

// 学员账户---添加赠送课时弹框---合同编号接口
export function purSummByCardId(data) {
  return request({
    url: baseUrl + '/crm/student/purSummByCardId',
    method: 'post',
    data
  })
}

// 学员账户---添加赠送课时弹框---选择课时接口
export function summaryQueryCourse(data) {
  return request({
    url: baseUrl + '/cerp/course/summaryQuery',
    method: 'post',
    data
  })
}

// 学员账户---添加赠送课时弹框---确定添加赠送课时
export function addGivePeriod(data) {
  return request({
    url: baseUrl + '/crm/student/addGivePeriod',
    method: 'post',
    data
  })
}

// 学员侧边弹框----会员卡基础信息
export function getBaseInfo(data) {
  return request({
    url: baseUrl + '/crm/student/getBaseInfo',
    method: 'post',
    data
  })
}

// 学员侧边弹框---适用学员
export function cardStuInfoById(data) {
  return request({
    url: baseUrl + '/crm/student/cardStuInfoById',
    method: 'post',
    data
  })
}

// 学员侧边弹框---添加适用学员获取学员下拉列表
export function summaryQuery(data) {
  return request({
    url: baseUrl + '/crm/stuInfo/stu/summaryQueryAll',
    method: 'post',
    data
  })
}

// 学员侧边弹框---转课获取合同下拉列表
export function queryOrderSummary(data) {
  return request({
    url: baseUrl + '/crm/contract/queryOrderSummary',
    method: 'post',
    data
  })
}

// 学员侧边弹框---转课获取课时信息下拉列表
export function getCourseInfoByPurId(data) {
  return request({
    url: baseUrl + '/crm/student/getCourseInfoByPurId',
    method: 'post',
    data
  })
}

// 学员侧边弹框---转课获取课程摘要信息下拉列表
export function getCourseInfoByCardId(data) {
  return request({
    url: baseUrl + '/crm/student/getCourseInfoByCardId',
    method: 'post',
    data
  })
}

// 学员侧边弹框---确定转课
export function createTransferCourse(data) {
  return request({
    url: baseUrl + '/crm/student/createTransferCourse',
    method: 'post',
    data
  })
}

// 学员侧边弹框---确定添加适用学员
export function addStuByCardId(data) {
  return request({
    url: baseUrl + '/crm/student/addStuByCardId',
    method: 'post',
    data
  })
}

// 学员侧边弹框---确定移除适用学员
export function delStuByCardId(data) {
  return request({
    url: baseUrl + '/crm/student/delStuByCardId',
    method: 'post',
    data
  })
}

// 学员侧边弹框---适用家长
export function cardParentInfoById(data) {
  return request({
    url: baseUrl + '/crm/stucard/cardParentInfoById',
    method: 'post',
    data
  })
}

// 学员侧边弹框---合同
export function cardPurInfoById(data) {
  return request({
    url: baseUrl + '/crm/student/cardPurInfoById',
    method: 'post',
    data
  })
}

// 学员侧边弹框---合同中扣课顺序
export function updateSort(data) {
  return request({
    url: baseUrl + '/crm/student/updateSort',
    method: 'post',
    data
  })
}

// 学员侧边弹框---退费
export function cardRefInfoById(data) {
  return request({
    url: baseUrl + '/crm/stucard/cardRefInfoById',
    method: 'post',
    data
  })
}

// 学员侧边弹框---课时变动
export function cardPeriodInfoById(data) {
  return request({
    url: baseUrl + '/crm/stucard/cardPeriodInfoById',
    method: 'post',
    data
  })
}

// 学员侧边弹框---学员详情侧边
export function getStuMsg(data) {
  return request({
    url: baseUrl + '/crm/stuInfo/stu/getStuMsg',
    method: 'post',
    data
  })
}

// 学员侧边弹框---转校弹框--可转校课时信息
export function getTranSchCourseInfoByPurId(data) {
  return request({
    url: baseUrl + '/crm/student/getTranSchCourseInfoByPurId',
    method: 'post',
    data
  })
}

// 学员侧边弹框---转校弹框--是否有约课记录
export function getCardAppointPeriod(data) {
  return request({
    url: baseUrl + '/crm/student/getCardAppointPeriod',
    method: 'post',
    data
  })
}

// 学员侧边弹框---转校弹框--转入校区列表
export function queryOrgList(data) {
  return request({
    url: baseUrlSys + '/sysBase/org/queryOrgList',
    method: 'post',
    data
  })
}

// 学员侧边弹框---转校弹框--确定提交转校
export function createTransfer(data) {
  return request({
    url: baseUrl + '/crm/student/createTransfer',
    method: 'post',
    data
  })
}

// 学员侧边弹框---转校弹框--精确查找
export function queryCRMStuList(data) {
  return request({
    url: baseUrl + '/crm/stuInfo/stu/queryCRMStuList',
    method: 'post',
    data
  })
}

// 赠课记录
export function givePeriodList(data) {
  return request({
    url: baseUrl + '/crm/student/givePeriodList',
    method: 'post',
    data
  })
}

// 赠课记录---审核赠送课时
export function checkGivePeriod(data) {
  return request({
    url: baseUrl + '/crm/student/checkGivePeriod',
    method: 'post',
    data
  })
}

// 转课记录
export function transferPeriodList(data) {
  return request({
    url: baseUrl + '/crm/student/transferPeriodList',
    method: 'post',
    data
  })
}

// 消课记录
export function queryRepealCourseInfo(data) {
  return request({
    url: baseUrl + '/crm/student/queryRepealCourseInfo',
    method: 'post',
    data
  })
}

// 转校记录
export function queryTransList(data) {
  return request({
    url: baseUrl + '/crm/stucard/queryTransList',
    method: 'post',
    data
  })
}

// 转校记录----审核通过确定
export function passTransSchool(data) {
  return request({
    url: baseUrl + '/crm/student/passTransSchool',
    method: 'post',
    data
  })
}

// 转校记录----转校详情弹框
export function getTransCourseInfo(data) {
  return request({
    url: baseUrl + '/crm/stucard/getTransCourseInfo',
    method: 'post',
    data
  })
}

// 转校审核驳回记录
export function rejectTransSchool(data) {
  return request({
    url: baseUrl + '/crm/student/rejectTransSchool',
    method: 'post',
    data
  })
}
