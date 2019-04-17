import { Message } from 'element-ui'
import {
  deleteStock,
  getGoods,
  addStock,
  getStockDetail,
  editStock
} from '@/api/crm/market/stock'

const SHOW_LOADING = 'SHOW_LOADING' // 显示loading
const HIDE_LOADING = 'HIDE_LOADING' // 隐藏loading
const UPDATE_STATE = 'UPDATE_STATE'

const stock = {
  namespaced: true,

  state: {
    loading: false,
    dialogLoading: false,
    goodList: [], // 物品下拉
    stockDetail: {} //  详情
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
    /** 删除库存 */
    async deleteStock({ state, commit }, payload) {
      const params = {
        ids: payload.ids.join(',')
      }
      const { data } = await deleteStock(params)
      if (data && data.errorCode === 0) {
        Message.success('删除成功！')
        payload.callback && payload.callback()
      } else {
        Message.error((data && data.errorMessage) || '库存删除失败！')
      }
    },

    /** 获取物品下拉 */
    async getGoods({ state, commit }) {
      commit(SHOW_LOADING)
      const { data } = await getGoods()
      if (data && data.errorCode === 0) {
        state.goodList = data.list
      } else {
        Message.error((data && data.errorMessage) || '获取物品下拉失败！')
      }
      commit(HIDE_LOADING)
    },

    /** 新增库存 */
    async addStock({ state, commit }, payload) {
      commit(SHOW_LOADING)
      const { data } = await addStock(payload.values)
      if (data && data.errorCode === 0) {
        Message.success('新增成功！')
        payload.close && payload.close()
        payload.refresh && payload.refresh()
      } else {
        Message.error((data && data.errorMessage) || '新增库存失败！')
      }
      commit(HIDE_LOADING)
    },

    /** 获取库存详情 */
    async getStockDetail({ state, commit }, payload) {
      commit(UPDATE_STATE, { dialogLoading: true })
      const { data } = await getStockDetail({ id: payload.id })
      if (data && data.errorCode === 0) {
        state.stockDetail = data
        payload.set && payload.set()
      } else {
        Message.error((data && data.errorMessage) || '详情获取失败！')
      }
      commit(UPDATE_STATE, { dialogLoading: false })
    },

    /** 编辑库存 */
    async editStock({ state, commit }, payload) {
      commit(SHOW_LOADING)
      const { data } = await editStock(payload.values)
      if (data && data.errorCode === 0) {
        Message.success('编辑成功！')
        payload.close && payload.close()
        payload.refresh && payload.refresh()
      } else {
        Message.error((data && data.errorMessage) || '编辑库存失败！')
      }
      commit(HIDE_LOADING)
    }
  }
}
export default stock
