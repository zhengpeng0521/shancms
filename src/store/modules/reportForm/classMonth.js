import { Message } from 'element-ui'
import {
  getClassMonthTotal,
  getClassMonthList
} from '@/api/reportForm/classMonth'
import { SHOW_LOADING, HIDE_LOADING, UPDATE_STATE } from '../../types'

const classMonth = {
  namespaced: true,

  state: {
    loading: false,
    searchValue: {}, // 搜索内容

    total: [], // 总计
    monthList: [], // 列表
    pageCount: 0 // 总条数
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
    /** 获取月结表列表 */
    async getClassMonth({ state, commit }, payload) {
      commit(SHOW_LOADING)

      const params = {
        month: payload.month
      }
      // 总计
      const { data } = await getClassMonthTotal(params)
      if (data && data.errorCode === 0) {
        const total = { ...data.data }
        total.countType = '总计'
        state.total = [total]
      } else {
        Message.error((data && data.errorMessage) || '月结表总计获取失败！')
      }

      // 列表
      const listData = await getClassMonthList(payload)
      if (listData && listData.data && listData.data.errorCode === 0) {
        state.monthList = listData.data.results
        state.pageCount = listData.data.data.resultCount

        state.searchValue = payload
      } else {
        Message.error(
          (listData && listData.data && listData.data.errorMessage) ||
            '月结表列表获取失败！'
        )
      }

      commit(HIDE_LOADING)
    }
  }
}
export default classMonth
