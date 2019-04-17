import { SHOW_LOADING, HIDE_LOADING } from '../../types'

const stuAttence = {
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
    /** 获取考勤列表-按课程 */
    async getAttenceByCourse({ state, commit }, payload) {
      commit(SHOW_LOADING)

      //   const { data } = await getAttenceByCourse(payload)
      //   console.log(data)

      commit(HIDE_LOADING)
    }
  }
}
export default stuAttence
