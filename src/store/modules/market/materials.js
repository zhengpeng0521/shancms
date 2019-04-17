import { Message } from 'element-ui'
import {
  removeMaterials,
  addMaterials,
  getMaterialsDetail,
  editMaterials
} from '@/api/crm/market/materialsMgr'

const SHOW_LOADING = 'SHOW_LOADING' // 显示loading
const HIDE_LOADING = 'HIDE_LOADING' // 隐藏loading
const SHOW_DETAIL = 'SHOW_DETAIL'
const HIDE_DETAIL = 'HIDE_DETAIL'

const materials = {
  namespaced: true,

  state: {
    loading: false,
    dialogLoading: false
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
    [SHOW_DETAIL](state) {
      state.dialogLoading = true
    },
    [HIDE_DETAIL](state) {
      state.dialogLoading = false
    }
  },

  actions: {
    /** 删除物资 */
    async removeMaterials({ state, commit }, payload) {
      const params = {
        id: payload.id
      }
      const { data } = await removeMaterials(params)
      if (data && data.errorCode === 0) {
        payload.callback && payload.callback({ pageIndex: 0 })
      } else {
        Message.error((data && data.errorMessage) || '删除失败！')
      }
    },

    /** 新增物资 */
    async addMaterials({ state, commit }, payload) {
      commit(SHOW_LOADING)

      const { data } = await addMaterials(payload.search)
      if (data && data.errorCode === 0) {
        Message.success('新增成功!')
        payload.close && payload.close('materialForm')
        payload.refresh && payload.refresh({ pageIndex: 0 })
      } else {
        Message.error((data && data.errorMessage) || '新增失败！')
      }

      commit(HIDE_LOADING)
    },

    /** 获取物资详情 */
    async getMaterialsDetail({ state, commit }, payload) {
      commit(SHOW_DETAIL)

      const { data } = await getMaterialsDetail({ id: payload.id })
      if (data && data.errorCode === 0) {
        payload.callback && payload.callback(data)
      } else {
        Message.error((data && data.errorMessage) || '获取详情失败！')
      }

      commit(HIDE_DETAIL)
    },

    /** 编辑物资 */
    async editMaterials({ state, commit }, payload) {
      commit(SHOW_LOADING)

      const { data } = await editMaterials(payload.search)
      if (data && data.errorCode === 0) {
        Message.success('编辑成功!')
        payload.close && payload.close('materialForm')
        payload.refresh && payload.refresh({ pageIndex: 0 })
      } else {
        Message.error((data && data.errorMessage) || '编辑失败！')
      }

      commit(HIDE_LOADING)
    }
  }
}
export default materials
