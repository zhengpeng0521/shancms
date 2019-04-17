const SHOW_LOADING = 'SHOW_LOADING' // 显示loading
const HIDE_LOADING = 'HIDE_LOADING' // 隐藏loading

const commonTable = {
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
  }
}

export default commonTable
