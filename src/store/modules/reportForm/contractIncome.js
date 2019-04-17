import { Message } from 'element-ui'
import {
  getSignType,
  getPackList,
  getTeachList
} from '@/api/reportForm/contractIncome'
import { SHOW_LOADING, HIDE_LOADING } from '../../types'

const contractIncome = {
  namespaced: true,

  state: {
    loading: false,
    searchValue: {},

    signSource: [], // 签约类型
    stuSource: [], // 学员
    clsSource: [], // 课时
    nurserySource: [], // 托班
    teachSource: [] // 教材
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
    async getContractIncome({ state, commit }, payload) {
      commit(SHOW_LOADING)
      // 签约学员
      const signList = await getSignType(payload)
      if (signList && signList.data && signList.data.errorCode === 0) {
        const signSource = [
          { type: '续约', money: signList.data.renewalMoney },
          { type: '新签', money: signList.data.newSignMoney }
        ]
        const stuSource = [
          { type: '老学员', money: signList.data.oldStuMoney },
          { type: '新学员', money: signList.data.newStuMoney }
        ]
        state.signSource = signSource
        state.stuSource = stuSource
      } else {
        Message.error(
          (signList && signList.data && signList.data.errorMessage) ||
            '签约类型和新老学员获取失败！'
        )
      }

      // 课时套餐
      const pkgParams = {
        ...payload,
        proType: '1'
      }
      const packList = await getPackList(pkgParams)
      if (packList && packList.data && packList.data.errorCode === 0) {
        state.clsSource = packList.data.results
      } else {
        Message.error(
          (packList && packList.data && packList.data.errorMessage) ||
            '课时套餐获取失败！'
        )
      }

      // 托班套餐
      const nurParams = {
        ...payload,
        proType: '3'
      }
      const nurseryList = await getPackList(nurParams)
      if (nurseryList && nurseryList.data && nurseryList.data.errorCode === 0) {
        state.nurserySource = nurseryList.data.results
      } else {
        Message.error(
          (nurseryList && nurseryList.data && nurseryList.data.errorMessage) ||
            '托班套餐获取失败！'
        )
      }

      // 教材
      const teachList = await getTeachList(payload)
      if (teachList && teachList.data && teachList.data.errorCode === 0) {
        state.teachSource = teachList.data.results
        state.searchValue = payload
      } else {
        Message.error(
          (teachList && teachList.data && teachList.data.errorMessage) ||
            '教材获取失败！'
        )
      }

      commit(HIDE_LOADING)
    }
  }
}
export default contractIncome
