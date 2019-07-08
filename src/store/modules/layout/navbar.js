import { SHOW_LOADING, HIDE_LOADING } from '../../types'
import { changePwd } from '@/api/layout/navbar'

const navbar = {
  namespaced: true,

  state: {
    loading: false
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
    /** 修改密码 */
    async changePassword({ commit }, payload) {
      commit(SHOW_LOADING)

      const params = {
        oldPassword: payload.oldPassword,
        newPassword: payload.newPassword,
        confirmPassword: payload.confirmPassword
      }
      const { data } = await changePwd(params)
      if (data && data.errorCode === 0) {
        payload.close && payload.close()
      } else {
        // 使用回调，解决message层级不够问题
        payload.fail && payload.fail(data)
      }

      commit(HIDE_LOADING)
    }
  }
}
export default navbar
