import { Message } from 'element-ui'
import {
  getAchivementList,
  getAchivementData
} from '@/api/reportForm/saleAchivement'
import { objListSortOfTime } from '@/utils/arrayUtils'
import { SHOW_LOADING, HIDE_LOADING, UPDATE_STATE } from '../../types'

const saleAchivement = {
  namespaced: true,

  state: {
    loading: false,

    searchValue: {}, // 搜索内容
    chartList: [], // 图表
    total: [], // 总计
    tableList: [], // 工作详情
    pageCount: 0 // 列表总数
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
    /** 获取销售业绩列表 */
    async getAchivementList({ state, commit }, payload) {
      commit(SHOW_LOADING)

      // 图表
      const { data } = await getAchivementList(payload)
      if (data && data.errorCode === 0) {
        state.chartList = objListSortOfTime(data.data, 'signTime', 'YYYY-MM-DD')
      } else {
        Message.error((data && data.errorMessage) || '销售业绩图获取失败！')
      }

      // 表格
      const listData = await getAchivementData(payload)
      if (listData && listData.data && listData.data.errorCode === 0) {
        const total = []
        total.push(listData.data)
        state.total = total
        state.tableList = listData.data.results
        state.pageCount = listData.data.data.pageCount

        state.searchValue = payload
      } else {
        Message.error(
          (listData && listData.data && listData.data.errorMessage) ||
            '销售业绩列表获取失败！'
        )
      }

      commit(HIDE_LOADING)
    }
  }
}
export default saleAchivement
