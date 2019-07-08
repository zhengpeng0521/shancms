import request from '@/utils/request'

// 模块配置查询
export async function getSet(params) {
  return request({
    url: `${window.HOME_URL}/sysServer/home/querySet`,
    method: 'post',
    data: params
  })
}

// 模块配置修改
export async function updateSet(params) {
  return request({
    url: `${window.HOME_URL}/sysServer/home/updateSet`,
    method: 'post',
    data: params
  })
}

// 获取机构数据
export async function getOrgData(params) {
  return request({
    url: `${window.HOME_URL}/sysServer/homeOrgData/queryOrgData`,
    method: 'post',
    data: params
  })
}

// 获取今日签到
export async function getSign(params) {
  return request({
    url: `${window.HOME_URL}/sysServer/homeOrgData/AttendStatistics`,
    method: 'post',
    data: params
  })
}

// 今日签到-学员下拉
export async function getStuList(params) {
  return request({
    url: `${window.SS_CRM}/crm/stuInfo/stu/summaryQueryAll`,
    method: 'post',
    data: params
  })
}

// 今日签到-排课列表
export async function getClassPlan(params) {
  return request({
    url: `${window.SS_CRM}/cerp/cp/query`,
    method: 'post',
    data: params
  })
}

// 销售概况-漏斗
export async function getFunnel(params) {
  return request({
    url: `${window.HOME_URL}/home/sales/funnel`,
    method: 'post',
    data: params
  })
}

// 销售概况-折线
export async function getLine(params) {
  return request({
    url: `${window.HOME_URL}/home/sales/broken`,
    method: 'post',
    data: params
  })
}

// 最新推荐
export async function getRecommend(params) {
  return request({
    url: `${window.HOME_URL}/sysServer/homeRecommend/recommendList`,
    method: 'post',
    data: params
  })
}

// 进入首页首先调用
export async function getInit(params) {
  return request({
    url: `${window.HOME_URL}/sysServer/homeTodo/addTodoQueue`,
    method: 'post',
    data: params
  })
}

// 获取待办事项
export async function getTodos(params) {
  return request({
    url: `${window.HOME_URL}/sysServer/homeTodo/queryContent`,
    method: 'post',
    data: params
  })
}

// 根据key获取系统配置
export async function getSysConfByKey(params) {
  return request({
    url: `${window.HOME_URL}/sysBase/sysConf/queryByKey`,
    method: 'post',
    data: params
  })
}

// 获取banner
export async function getBanner(params) {
  return request({
    url: `${window.HOME_URL}/sysServer/homeBanner/bannerList`,
    method: 'post',
    data: params
  })
}

// 获取运营妙计
export async function getGoodCase(params) {
  return request({
    url: `${window.HOME_URL}/sysServer/homeScheme/sucSchemeList`,
    method: 'post',
    data: params
  })
}

// 获取闪闪头条
export async function getLeadNews(params) {
  return request({
    url: `/web-node-server/thinknode/web/offical/excludePath/newReport/query`,
    method: 'post',
    data: params
  })
}

// 获取判断套餐时间
export async function getInfoList(query) {
  return request({
    url: `${window.HOME_URL}/sysPack/mealZsb/queryMealOpening`,
    method: 'post',
    params: query
  })
}
