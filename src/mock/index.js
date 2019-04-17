import Mock from 'mockjs'
// import loginAPI from './login'
import articleAPI from './article'
import remoteSearchAPI from './remoteSearch'
import transactionAPI from './transaction'
import courseAPI from './course'
import gradeAPI from './grade'
import orderCourseAPI from './orderCourse'
// import reportAPI from './reportForm'
// import erpFormAPI from './erpForm'
// import SaleWorkAPI from './saleWork'
import leaveAuditAPI from './leaveAudit'
import crmDetailAPI from './crmDetail'
import coursewareAPI from './courseware'
import affairClassAPI from './affairClass'
import marketingAPI from './marketing'
import webPreviewAPI from './webPreview'
// 修复在使用 MockJS 情况下，设置 withCredentials = true，且未被拦截的跨域请求丢失 Cookies 的问题
// https://github.com/nuysoft/Mock/issues/300
Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
Mock.XHR.prototype.send = function() {
  if (this.custom.xhr) {
    this.custom.xhr.withCredentials = this.withCredentials || false
  }
  this.proxy_send(...arguments)
}

// Mock.setup({
//   timeout: '350-600'
// })

// 登录相关
// Mock.mock(/\/login\/login/, 'post', loginAPI.loginByUsername)
// Mock.mock(/\/login\/logout/, 'post', loginAPI.logout)
// Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)

// 文章相关
Mock.mock(/\/article\/list/, 'get', articleAPI.getList)
// Mock.mock(/\/article\/detail/, 'get', articleAPI.getArticle)
// Mock.mock(/\/article\/pv/, 'get', articleAPI.getPv)
// Mock.mock(/\/article\/create/, 'post', articleAPI.createArticle)
// Mock.mock(/\/article\/update/, 'post', articleAPI.updateArticle)

// 搜索相关
Mock.mock(/\/search\/user/, 'get', remoteSearchAPI.searchUser)

// 账单相关
Mock.mock(/\/transaction\/list/, 'get', transactionAPI.getList)
// 微官网
Mock.mock(/\/marketing\/list/, 'get', marketingAPI.getList)
Mock.mock(/\/webPreview\/getList/, 'get', webPreviewAPI.getList)
Mock.mock(/\/webPreview\/ActivityList/, 'get', webPreviewAPI.ActivityList)

// 课程
Mock.mock(/\/course\/list/, 'get', courseAPI.getList)
Mock.mock(/\/course\/getEditInfo/, 'get', courseAPI.getEditInfo)
Mock.mock(/\/course\/getGroupList/, 'get', courseAPI.getGroupList)
Mock.mock(/\/course\/getCourseThemeList/, 'get', courseAPI.getCourseThemeList)

// 班级
Mock.mock(/\/grade\/list/, 'get', gradeAPI.getList)
Mock.mock(/\/grade\/getStuList/, 'get', gradeAPI.getStuList)
Mock.mock(/\/grade\/getCourseList/, 'get', gradeAPI.getCourseList)
Mock.mock(/\/grade\/getStuChooseList/, 'get', gradeAPI.getStuChooseList)
// 排课
Mock.mock(/\/grade\/getScheduleList/, 'get', gradeAPI.getScheduleList)
Mock.mock(/\/grade\/getListChooseList/, 'get', gradeAPI.getListChooseList)
Mock.mock(/\/grade\/getRoomList/, 'get', gradeAPI.getRoomList)
// 约课
Mock.mock(/\/orderCourse\/getList/, 'get', orderCourseAPI.getList)
Mock.mock(/\/orderCourse\/getTeacherList/, 'get', orderCourseAPI.getTeacherList)
Mock.mock(/\/orderCourse\/getRoomList/, 'get', orderCourseAPI.getRoomList)
Mock.mock(/\/orderCourse\/getPrintList/, 'get', orderCourseAPI.getPrintList)
Mock.mock(
  /\/orderCourse\/getCreateConflictList/,
  'get',
  orderCourseAPI.getCreateConflictList
)

// 请假审核
Mock.mock(/\/leaveAudit\/getList/, 'get', leaveAuditAPI.getList)
// 签到记录
Mock.mock(/\/leaveAudit\/getSignList/, 'get', leaveAuditAPI.getSignList)
// 教学课件
Mock.mock(
  /\/courseware\/getCoursewareList/,
  'get',
  coursewareAPI.getCoursewareList
)
// 教学课件详情
Mock.mock(
  /\/courseware\/getCoursewareDetail/,
  'get',
  coursewareAPI.getCoursewareDetail
)
// 学员作品
Mock.mock(
  /\/courseware\/getStuProductionList/,
  'get',
  coursewareAPI.getStuProductionList
)
// 学员列表
Mock.mock(/\/courseware\/getStuList/, 'get', coursewareAPI.getStuList)
// 家校互评列表
Mock.mock(/\/courseware\/getElvationList/, 'get', coursewareAPI.getElvationList)
// 托班（考勤记录）
Mock.mock(
  /\/affairClass\/getAttendanceList/,
  'get',
  affairClassAPI.getAttendanceList
)
// 托班（班级管理列表）
Mock.mock(/\/affairClass\/getGradeList/, 'get', affairClassAPI.getGradeList)
// 托班（班级管理中的主教）
Mock.mock(/\/affairClass\/getMainTeacher/, 'get', affairClassAPI.getMainTeacher)
// 托班（班级管理中的托班类型）
Mock.mock(/\/affairClass\/getClassType/, 'get', affairClassAPI.getClassType)
// 托班（班级管理中的教室）
Mock.mock(
  /\/affairClass\/getClassroomList/,
  'get',
  affairClassAPI.getClassroomList
)
// 托班（班级管理中的考勤管理）
Mock.mock(
  /\/affairClass\/getStuAttendanceList/,
  'get',
  affairClassAPI.getStuAttendanceList
)
// 托班（班级管理中的班级学员信息）
Mock.mock(/\/affairClass\/getStuInfoList/, 'get', affairClassAPI.getStuInfoList)
// 托班（班级管理中的筛选学员信息）
Mock.mock(
  /\/affairClass\/getSearchStuList/,
  'get',
  affairClassAPI.getSearchStuList
)
// 托班（班级管理中的精确查找）
Mock.mock(/\/affairClass\/getSearchList/, 'get', affairClassAPI.getSearchList)

// 托班（班级管理中的班级信息编辑）
Mock.mock(/\/affairClass\/getStuEditInfo/, 'get', affairClassAPI.getStuEditInfo)
// 托班（班级排课 班级名称搜索）
Mock.mock(
  /\/affairClass\/getClassNameList/,
  'get',
  affairClassAPI.getClassNameList
)
// 托班（班级排课 排课列表）
Mock.mock(
  /\/affairClass\/getScheduleList/,
  'get',
  affairClassAPI.getScheduleList
)
// 销售报表
// 名单
// Mock.mock(
//   /\/crm\/statistics\/leadsSourceQuery/,
//   'post',
//   reportAPI.getLeadsSource
// )
// 销售工作
// Mock.mock(/\/ss-web\/getSelect/, 'post', SaleWorkAPI.getSelect)
// Mock.mock(
//   /\/crm\/statistics\/seller\/dup\/getSellerJobList/,
//   'post',
//   SaleWorkAPI.getSaleWork
// )
// Mock.mock(
//   /\/crm\/statistics\/seller\/dup\/getChannelBySellerId/,
//   'post',
//   SaleWorkAPI.getChannel
// )
// 销售业绩
// Mock.mock(
//   /\/crm\/statistics\/seller\/dup\/sellerBroken/,
//   'post',
//   reportAPI.getAchivement
// )
// Mock.mock(
//   /\/crm\/statistics\/seller\/dup\/getSellerPerList/,
//   'post',
//   reportAPI.getAchivementData
// )
// 合同收入
// Mock.mock(
//   /\/crm\/statistics\/seller\/getSignType/,
//   'post',
//   reportAPI.getSignType
// )
// Mock.mock(
//   /\/crm\/statistics\/seller\/getPeriodPackList/,
//   'post',
//   reportAPI.getPackList
// )
// Mock.mock(
//   /\/crm\/statistics\/seller\/getTeachAidList/,
//   'post',
//   reportAPI.getTeachList
// )
// 课程售卖
// Mock.mock(
//   /\/cerp\/stats\/cerpCourseSellStuNumByCourse/,
//   'post',
//   reportAPI.getStuBycourse
// )
// Mock.mock(
//   /\/cerp\/stats\/cerpCourseSellStuNumByDate/,
//   'post',
//   reportAPI.getStuByDate
// )
// Mock.mock(
//   /\/cerp\/stats\/cerpCourseSellCourseHourByCourse/,
//   'post',
//   reportAPI.getTimesBycourse
// )
// Mock.mock(
//   /\/cerp\/stats\/cerpCourseSellCourseCountByDate/,
//   'post',
//   reportAPI.getTimesByDate
// )
// 赠课记录
// Mock.mock(
//   /\/crm\/statistics\/seller\/getGivePeriodNum/,
//   'post',
//   reportAPI.getGiveNum
// )
// Mock.mock(
//   /\/crm\/statistics\/seller\/getGivePeriodNumTime/,
//   'post',
//   reportAPI.getGiveTime
// )

// 教学报表
// 消课
// Mock.mock(
//   /\/cerp\/stats\/costSQ\/queryByAllCourse/,
//   'post',
//   erpFormAPI.getUseClassAll
// )
// Mock.mock(
//   /\/cerp\/stats\/costSQ\/queryByCourse/,
//   'post',
//   erpFormAPI.getUseClassCourse
// )
// Mock.mock(
//   /\/cerp\/stats\/costSQ\/queryByOrg/,
//   'post',
//   erpFormAPI.getUseClassOrg
// )
// Mock.mock(
//   /\/cerp\/stats\/costSQ\/queryByTeacher/,
//   'post',
//   erpFormAPI.getUseClassTeacher
// )
// Mock.mock(
//   /\/cerp\/stats\/costSQ\/queryBySeller/,
//   'post',
//   erpFormAPI.getUseClassSale
// )
// Mock.mock(
//   /\/cerp\/stats\/costSQ\/queryByCounselor/,
//   'post',
//   erpFormAPI.getUseClassCharge
// )
// 沉默
// Mock.mock(
//   /\/erp\/stats\/silenceCost\/silenceQuery/,
//   'post',
//   erpFormAPI.getSlience
// )
// 考勤
// Mock.mock(
//   /\/cerp\/stats\/querySQMStuCheckByCourse/,
//   'post',
//   erpFormAPI.getAttenceByCourse
// )
// Mock.mock(
//   /\/cerp\/stats\/querySQMStuCheckByMteacher/,
//   'post',
//   erpFormAPI.getAttenceByMteacher
// )
// Mock.mock(
//   /\/cerp\/stats\/querySQMStuCheckByAteacher/,
//   'post',
//   erpFormAPI.getAttenceByAteacher
// )
// Mock.mock(
//   /\/crm\/erp\/statistics\/queryByStuName/,
//   'post',
//   erpFormAPI.getAttenceByStu
// )
// Mock.mock(
//   /\/crm\/erp\/statistics\/queryStuCheckByPlan/,
//   'post',
//   erpFormAPI.getAttenceByPlan
// )
// 授课
// Mock.mock(/\/cerp\/stuClass\/queryByCourse/, 'post', erpFormAPI.getCourseTimes)
// Mock.mock(/\/ss-web\/getTeachTable/, 'post', erpFormAPI.getTeachTable)
// Mock.mock(/\/cerp\/stuClass\/queryDetail/, 'post', erpFormAPI.getTachingDetail)
// 教室
// Mock.mock(/\/erp\/stats\/SQRoom\/queryRoom/, 'post', erpFormAPI.getClassroom)
// 课时详情
// Mock.mock(/\/stu\/stucard\/detailQuery/, 'post', erpFormAPI.getClassTimeDetail)
// 工资
// Mock.mock(/\/crm\/salary\/teacherSalaryQuery/, 'post', erpFormAPI.getSalary)
// 课时月结
// Mock.mock(
//   /\/crm\/cardReport\/queryPeriodMonthTotal/,
//   'post',
//   erpFormAPI.getClassMonthTotal
// )
// Mock.mock(
//   /\/crm\/cardReport\/queryPeriodMonthList/,
//   'post',
//   erpFormAPI.getClassMonthList
// )
// 时长月结
// Mock.mock(/\/crm\/order\/resultForMonth/, 'post', erpFormAPI.getTimeMonth)

// crm详情
Mock.mock(/\/ss-web\/getLeadsRecord/, 'post', crmDetailAPI.getLeadsRecord)
Mock.mock(/\/ss-web\/createLeadsRecord/, 'post', crmDetailAPI.createLeadsRecord)
Mock.mock(/\/ss-web\/getVisiteList/, 'post', crmDetailAPI.getVisiteList)
Mock.mock(/\/ss-web\/getListenList/, 'post', crmDetailAPI.getListenList)
Mock.mock(/\/ss-web\/getParentList/, 'post', crmDetailAPI.getParentList)
Mock.mock(/\/ss-web\/getContract/, 'post', crmDetailAPI.getContract)
Mock.mock(/\/ss-web\/getVipCard/, 'post', crmDetailAPI.getVipCard)
Mock.mock(/\/ss-web\/getNursery/, 'post', crmDetailAPI.getNursery)
Mock.mock(/\/ss-web\/getUsedPeriods/, 'post', crmDetailAPI.getUsedPeriods)
Mock.mock(/\/ss-web\/getOrderClass/, 'post', crmDetailAPI.getOrderClass)

export default Mock
