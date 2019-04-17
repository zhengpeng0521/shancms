import { Message } from 'element-ui'
import { getSlience } from '@/api/reportForm/slientStu'
import { SHOW_LOADING, HIDE_LOADING } from '../../types'

const slientStu = {
  namespaced: true,

  state: {
    loading: false,
    searchValue: {},
    stuNum: 0, // 未耗课时学员数
    orderStu: [], // 合同学员
    studentList: [] // 学员
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
    /** 获取沉默学员 */
    async getSlience({ state, commit }, payload) {
      commit(SHOW_LOADING)

      const { data } = await getSlience(payload)
      if (data && data.errorCode === 0) {
        state.searchValue = payload
        state.stuNum = data.uncostStuNum
        state.orderStu = [
          { type: '总学员', num: data.newPurStuNum + data.renewPurStuNum },
          { type: '新签学员', num: data.newPurStuNum },
          { type: '续约学员', num: data.renewPurStuNum }
        ]
        state.studentList = [
          { type: '总学员', num: data.newStuNum + data.oldStuNum },
          { type: '新学员', num: data.newStuNum },
          { type: '老学员', num: data.oldStuNum }
        ]
      } else {
        Message.error((data && data.errorMessage) || '沉默学员表获取失败！')
      }

      commit(HIDE_LOADING)
    }
  }
}
export default slientStu
