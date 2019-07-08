import { GET_EDIT_URL } from '../../types'

const microGame = {
  namespaced: true,

  state: {
    editUrl: '',
    isEdit: false
  },

  mutations: {
    [GET_EDIT_URL](state, payload) {
      state.editUrl = payload.editUrl
      state.isEdit = payload.isEdit
    }
  }
}

export default microGame
