import { Message } from 'element-ui'
import {
  getSet,
  updateSet,
  getOrgData,
  getSign,
  getStuList,
  getClassPlan,
  getFunnel,
  getLine,
  getRecommend,
  getInit,
  getTodos,
  getBanner,
  getGoodCase,
  getLeadNews
} from '@/api/home/home'
import { tenantUserSummaryQuery } from '@/api/teachManage/attendance'
import { objListSortOfTime } from '@/utils/arrayUtils'
import { UPDATE_STATE } from '../../types'

const home = {
  namespaced: true,

  state: {
    homeLoading: false,
    moduleList: [], // 首页模块
    /** 弹窗 */
    loading: false,
    selectList: [], // 选择列表
    unselectedList: [], // 未选择列表

    /** 机构数据 */
    orgLoading: false,
    dateType: '1', // 日期类型
    orgDate: '', // 更新时间
    dataList: [], // 机构数据

    /** 快捷入口 */
    entryLoading: false,
    entryList: [], // 入口列表

    /** 今日签到 */
    signLoading: false,
    selectLoading: false,
    stuList: [], // 学员下拉
    signInfo: {}, // 签到信息
    signDate: '',
    planList: [], // 排课列表
    teacherList: [], // 教师列表

    /** 销售概况 */
    saleLoading: false,
    saleDate: '',
    saleFunnel: [], // 漏斗数据
    saleLine: [], // 曲线

    /** 最新推荐 */
    recommendLoading: false,
    recommendList: [], // 推荐列表

    /** 待办事项 */
    todoLoading: false,
    todoList: [], // 待办列表
    todoSetList: [], // 待办设置列表
    contractExpire: 0, // 合同过期天数，合同规则

    /** Banner */
    bannerLoading: false,
    bannerList: [], // banner图片
    bannerNews: [], // banner新闻

    /** 运营妙计 */
    caseLoading: false,
    caseList: [], // 运营妙计列表

    /** 闪闪头条 */
    leadNewsLoading: false,
    leadNewsList: []
  },

  mutations: {
    /** 更新状态 */
    [UPDATE_STATE](state, payload) {
      for (const i in payload) {
        state[i] = payload[i]
      }
    }
  },

  actions: {
    /** 初始化获取模块 */
    async homeInit({ state, commit }, payload) {
      commit(UPDATE_STATE, { homeLoading: true })

      const { data } = await getSet(payload)
      if (data && data.errorCode === 0) {
        const moduleList = []
        data.selectList.forEach(item => {
          moduleList.push(item.name)
        })
        state.moduleList = moduleList
      } else {
        Message.error((data && data.errorMessage) || '首页模块获取失败！')
      }

      commit(UPDATE_STATE, { homeLoading: false })
    },

    /** 模块配置查询 */
    async getSet({ state, commit }, payload) {
      commit(UPDATE_STATE, { loading: true })

      const params = {
        type: payload.type,
        menuIds: payload.menuIds
      }
      const { data } = await getSet(params)
      if (data && data.errorCode === 0) {
        // 是否显示在首页上
        if (payload.isEntry) {
          state.entryList = data.selectList
        } else {
          state.selectList = data.selectList
          state.unselectedList = data.unSelectList
        }
      } else {
        Message.error((data && data.errorMessage) || '配置获取失败！')
      }

      commit(UPDATE_STATE, { loading: false })
    },

    /** 模块配置修改 */
    async updateSet({ state, commit, dispatch, rootGetters }, payload) {
      commit(UPDATE_STATE, { loading: true })
      const params = {
        selectListStr: payload.selectListStr,
        type: payload.type
      }
      const { data } = await updateSet(params)
      if (data && data.errorCode === 0) {
        Message.success('配置修改成功！')
        payload.close && payload.close()
        // 刷新
        let menuIds = [...rootGetters.roles]
        menuIds = menuIds.join(',')
        if (payload.type === 'orgData') {
          dispatch('getOrgData', {
            dateType: state.dateType,
            menuIds
          })
        } else if (payload.type === 'shortCut') {
          dispatch('getSet', {
            type: 'shortCut',
            isEntry: true,
            menuIds
          })
        } else if (payload.type === 'todoList') {
          dispatch('getTodos', { inteval: payload.inteval })
        } else if (payload.type === 'home') {
          dispatch('homeInit', { type: 'home', menuIds })
        }
      } else {
        Message.error((data && data.errorMessage) || '配置修改失败！')
      }

      commit(UPDATE_STATE, { loading: false })
    },

    /** 获取机构数据 */
    async getOrgData({ state, commit }, payload) {
      commit(UPDATE_STATE, { orgLoading: true })
      state.dateType = payload.dateType

      const { data } = await getOrgData(payload)
      if (data && data.errorCode === 0) {
        state.dataList = data.result
        state.orgDate = data.renewTime || '暂无'
      } else {
        Message.error((data && data.errorMessage) || '获取机构数据失败！')
      }

      commit(UPDATE_STATE, { orgLoading: false })
    },

    /** 获取今日签到 */
    async getSign({ state, commit }, payload) {
      commit(UPDATE_STATE, { signLoading: true })

      const { data } = await getSign(payload)
      if (data && data.errorCode === 0) {
        state.signInfo = data
        state.signDate = data.renewTime || '暂无'
      } else {
        Message.error((data && data.errorMessage) || '获取今日签到失败！')
      }

      commit(UPDATE_STATE, { signLoading: false })
    },

    /** 今日签到-学员下拉 */
    async getStuList({ state, commit }, payload) {
      commit(UPDATE_STATE, { selectLoading: true })

      const { data } = await getStuList(payload)
      if (data && data.errorCode === 0) {
        state.stuList = data.results
      } else {
        Message.error((data && data.errorMessage) || '获取学员下拉失败！')
      }

      commit(UPDATE_STATE, { selectLoading: false })
    },

    /** 今日签到-排课列表 */
    async getClassPlan({ state, commit }, payload) {
      commit(UPDATE_STATE, { selectLoading: true })

      const { data } = await getClassPlan(payload)
      if (data && data.errorCode === 0) {
        state.planList = data.results
      } else {
        Message.error((data && data.errorMessage) || '获取排课列表失败！')
      }

      commit(UPDATE_STATE, { selectLoading: false })
    },

    /** 今日签到-教师列表 */
    async getTeacherList({ state, commit }, payload) {
      const { data } = await tenantUserSummaryQuery(payload)
      if (data && data.errorCode === 0) {
        state.teacherList = data.results
      } else {
        Message.error((data && data.errorMessage) || '获取排课列表失败！')
      }
    },

    /** 销售概况-漏斗 */
    async getFunnel({ state, commit }, payload) {
      commit(UPDATE_STATE, { saleLoading: true })

      const { data } = await getFunnel(payload)
      if (data && data.errorCode === 0) {
        if (data.data.length > 7) {
          state.saleFunnel = data.data.slice(0, 7)
        } else {
          state.saleFunnel = data.data
        }
      } else {
        Message.error((data && data.errorMessage) || '获取销售概况失败！')
      }

      commit(UPDATE_STATE, { saleLoading: false })
    },

    /** 销售概况-曲线 */
    async getLine({ state, commit }, payload) {
      commit(UPDATE_STATE, { saleLoading: true })

      const { data } = await getLine(payload)
      if (data && data.errorCode === 0) {
        const saleLine = []
        for (const i in data.data) {
          if (i === 'renewTime') {
            state.saleDate = data.data[i] || '暂无'
          } else {
            saleLine.push({
              date: i,
              num: data.data[i]
            })
          }
        }
        state.saleLine = objListSortOfTime(saleLine, 'date', 'YYYY-MM-DD')
      } else {
        Message.error((data && data.errorMessage) || '获取销售概况失败！')
      }

      commit(UPDATE_STATE, { saleLoading: false })
    },

    /** 最新推荐 */
    async getRecommend({ state, commit, rootGetters }) {
      commit(UPDATE_STATE, { recommendLoading: true })

      const menuIds = [...rootGetters.roles]
      const params = {
        status: '1',
        pageIndex: 0,
        pageSize: 4,
        menuIds: menuIds.join(',')
      }
      const { data } = await getRecommend(params)
      if (data && data.errorCode === 0) {
        state.recommendList = data.results
      } else {
        Message.error((data && data.errorMessage) || '获取最新推荐失败！')
      }

      commit(UPDATE_STATE, { recommendLoading: false })
    },

    /** 获取待办事项前初始化 */
    async getTodos({ commit, dispatch }, payload) {
      commit(UPDATE_STATE, { todoLoading: true })

      const { data } = await getInit()
      if (data && data.errorCode === 0) {
        dispatch('getTodoList')
        payload.inteval && payload.inteval()
      } else {
        Message.error((data && data.errorMessage) || '获取待办事项失败！')
      }

      commit(UPDATE_STATE, { todoLoading: false })
    },

    /** 获取待办列表 */
    async getTodoList({ state, rootGetters }) {
      const menuIds = [...rootGetters.roles]
      const params = {
        menuIds: menuIds.join(',')
      }
      const { data } = await getTodos(params)
      if (data && data.errorCode === 0) {
        state.todoList = data.results
      } else {
        Message.error((data && data.errorMessage) || '获取待办事项失败！')
      }
    },

    /** 获取banner */
    async getBanner({ state, commit }, payload) {
      commit(UPDATE_STATE, { bannerLoading: true })

      // 获取图片
      const params = {
        type: '5',
        status: '1'
      }
      const { data } = await getBanner(params)
      if (data && data.errorCode === 0) {
        state.bannerList = data.results
      } else {
        Message.error((data && data.errorMessage) || '获取banner图失败！')
      }

      // 获取文案
      // 2019.05.22需求不显示
      // const news = {
      //   type: '6',
      //   status: '1'
      // }
      // const banner = await getBanner(news)
      // if (banner && banner.data && banner.data.errorCode === 0) {
      //   state.bannerNews = banner.data.results
      // } else {
      //   Message.error(
      //     (banner && banner.data && banner.data.errorMessage) ||
      //       '获取新闻失败！'
      //   )
      // }

      commit(UPDATE_STATE, { bannerLoading: false })
    },

    /** 获取运营妙计 */
    async getGoodCase({ state, commit }, payload) {
      commit(UPDATE_STATE, { caseLoading: true })

      const params = {
        status: '1',
        pageIndex: 0,
        pageSize: 3
      }
      const { data } = await getGoodCase(params)
      if (data && data.errorCode === 0) {
        state.caseList = data.results
      } else {
        Message.error((data && data.errorMessage) || '获取运营妙计失败！')
      }

      commit(UPDATE_STATE, { caseLoading: false })
    },

    /** 获取闪闪头条 */
    async getLeadNews({ state, commit }, payload) {
      commit(UPDATE_STATE, { leadNewsLoading: true })

      const params = {
        pageIndex: 0,
        pageSize: 5
      }
      const { data } = await getLeadNews(params)
      if (data && data.errorCode === 9000) {
        state.leadNewsList = data.results
      } else {
        Message.error((data && data.errorMessage) || '获取闪闪头条失败！')
      }

      commit(UPDATE_STATE, { leadNewsLoading: false })
    }
  }
}
export default home
