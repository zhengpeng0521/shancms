import { Message } from 'element-ui'
import {
  getCourseTimes,
  getTeachTable,
  getTachingDetail
} from '@/api/reportForm/teaching'
import { SHOW_LOADING, HIDE_LOADING, UPDATE_STATE } from '../../types'

const teaching = {
  namespaced: true,

  state: {
    loading: false,
    searchValue: {}, // 搜索内容
    teachSource: [], // 柱形图数据
    teachTotal: [], // 总计
    teachList: [], // 授课列表
    pageCount: 0,

    detailLoading: false,
    detailList: [], // 明细
    detailTotal: {} // 明细汇总
  },

  mutations: {
    /** 显示loading */
    [SHOW_LOADING](state) {
      state.loading = true
    },
    /** 隐藏loading */
    [HIDE_LOADING](state) {
      state.loading = false
    },
    [UPDATE_STATE](state, payload) {
      for (const i in payload) {
        state[i] = payload[i]
      }
    }
  },

  actions: {
    /** 获取老师授课列表 */
    async getTeachingList({ state, commit }, payload) {
      commit(SHOW_LOADING)

      // 柱形图
      const { data } = await getCourseTimes(payload)
      if (data && data.errorCode === 0) {
        state.teachSource = data.results
      } else {
        Message.error((data && data.errorMessage) || '授课图表获取失败！')
      }

      // 表格
      const tableList = await getTeachTable(payload)
      if (tableList && tableList.data && tableList.data.errorCode === 0) {
        const total = { ...tableList.data, countType: '总计' }
        delete total.results
        state.teachTotal = [total]
        state.teachList = tableList.data.results
        state.pageCount = tableList.data.data.resultCount
        state.searchValue = payload
      } else {
        Message.error(
          (tableList && tableList.data && tableList.data.errorMessage) ||
            '授课列表获取失败！'
        )
      }

      commit(HIDE_LOADING)
    },

    /** 获取授课明细 */
    async getTachingDetail({ state, commit }, payload) {
      commit(UPDATE_STATE, { detailLoading: true })

      const { data } = await getTachingDetail(payload)
      if (data && data.errorCode === 0) {
        const detailTotal = {
          sAttend: 0,
          sAudition: 0,
          sMakeup: 0,
          tAttend: 0,
          tAudition: 0,
          tMakeup: 0,
          teacherHours: 0
        }
        data.results.forEach(item => {
          detailTotal.sAttend += item.sattend
          detailTotal.sAudition += item.saudition
          detailTotal.sMakeup += item.smakeup
          detailTotal.tAttend += item.tattend
          detailTotal.tAudition += item.taudition
          detailTotal.tMakeup += item.tmakeup
          detailTotal.teacherHours += parseInt(item.teacherHours)
        })
        state.detailList = data.results
        state.detailTotal = detailTotal
      } else {
        Message.error((data && data.errorMessage) || '授课明细获取失败！')
      }

      commit(UPDATE_STATE, { detailLoading: false })
    }
  }
}
export default teaching
