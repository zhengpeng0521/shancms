const changeThirdMain = {
  namespaced: true,
  state: {
    tabsName: '',
    isChange: false
  },

  mutations: {
    CHANGE_ACTIVE_NAME: (state, actives) => {
      state.tabsName = actives
      state.isChange = true
    },

    CHANGE_SWITCH: (state, actives) => {
      state.isChange = false
      state.tabsName = ''
    }
  },
  actions: {
    changeTabs({ commit }, actives) {
      commit('CHANGE_ACTIVE_NAME', actives)
    }
  }
}

export default changeThirdMain
