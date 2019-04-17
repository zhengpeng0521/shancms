import { Message } from 'element-ui'
import { getLeadsData } from '@/api/reportForm/leadsSource'
import { SHOW_LOADING, HIDE_LOADING } from '../../types'

const leadsSource = {
  namespaced: true,

  state: {
    loading: false,
    searchValue: {},

    firstSource: [], // 一级来源数据
    firstCols: [], // 一级来源图例

    secSource: [], // 二级来源数据
    secCols: [], // 二级来源图例

    totalSource: [] // 总计
  },

  mutations: {
    /** 显示loading */
    [SHOW_LOADING](state) {
      state.loading = true
    },
    /** 隐藏loading */
    [HIDE_LOADING](state) {
      state.loading = false
    }
  },

  actions: {
    /** 获取图表数据 */
    async getLeadsData({ state, commit }, payload) {
      commit(SHOW_LOADING)

      const { data } = await getLeadsData(payload)
      if (data && data.errorCode === 0) {
        const firstCols = []
        const secCols = []

        state.firstSource = data.data[0].items
        state.secSource = data.data[1].items
        state.totalSource = data.data[2].items
        state.searchValue = payload

        data.data.forEach((item, index) => {
          item.items.forEach(source => {
            if (index === 0) {
              firstCols.push({
                key: source.source,
                value: source.sourceName
              })
            } else if (index === 1) {
              secCols.push({
                key: source.source,
                value: source.sourceName
              })
            }
          })
        })

        state.firstCols = firstCols
        state.secCols = secCols
      } else {
        Message.error((data && data.errorMessage) || '名单来源获取失败！')
      }

      commit(HIDE_LOADING)
    }
  }
}
export default leadsSource
