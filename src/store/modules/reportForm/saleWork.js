import { Message } from 'element-ui'
import { getSelect, getChannel } from '@/api/reportForm/saleWork'
import { SHOW_LOADING, HIDE_LOADING, UPDATE_STATE } from '../../types'

const saleWork = {
  namespaced: true,

  state: {
    loading: false,

    searchValue: {}, // 搜索内容
    saleList: [], // 销售列表

    modalVisible: false, // 显示弹窗
    modalLoading: false,
    channel: [], // 一级来源
    secondChannel: [], // 二级来源
    total: 0 // 总计
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
    /** 获取销售列表 */
    // async getSaleWork({ state, commit }, payload) {
    //   commit(SHOW_LOADING)

    //   const { data } = await getSaleWork(payload)
    //   if (data && data.errorCode === 9000) {
    //     state.saleList = data.list
    //     state.searchValue = payload
    //   } else {
    //     Message.error((data && data.errorMessage) || '销售工作列表获取失败！')
    //   }

    //   commit(HIDE_LOADING)
    // },

    /** 获取角色下拉 */
    async getSelect({ state }, payload) {
      const { data } = await getSelect({ appCode: 'ss' })
      if (data && data.errorCode === 0) {
        payload.callback(data.results)
      } else {
        Message.error((data && data.errorMessage) || '角色下拉获取失败！')
      }
    },

    /** 获取来源面板 */
    async getChannel({ state, commit }, payload) {
      commit(UPDATE_STATE, { modalLoading: true })

      const { data } = await getChannel(payload)
      if (data && data.errorCode === 0) {
        let total = 0
        state.channel = data.channel
        state.secondChannel = data.secondChannel
        data.channel.forEach(item => {
          total += Number(item.num)
        })
        state.total = total
      } else {
        Message.error((data && data.errorMessage) || '来源信息获取失败！')
      }

      commit(UPDATE_STATE, { modalLoading: false })
    }
  }
}
export default saleWork
