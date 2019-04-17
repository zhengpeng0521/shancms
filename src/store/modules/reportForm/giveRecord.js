import { Message } from 'element-ui'
import { getGiveNum, getGiveTime } from '@/api/reportForm/giveRecord'
import { SHOW_LOADING, HIDE_LOADING } from '../../types'

const giveRecord = {
  namespaced: true,

  state: {
    loading: false,
    searchValue: {},

    giveNumList: [], // 赠送课时
    giveTimeList: [] // 赠送时间
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
    async getGiveList({ state, commit }, payload) {
      commit(SHOW_LOADING)

      const giveNum = await getGiveNum(payload)
      if (giveNum && giveNum.data && giveNum.data.errorCode === 0) {
        const giveNumList = [
          {
            type: '专用课时消耗',
            num: giveNum.data.costExcCourseNum,
            money: giveNum.data.costExcCourseMoney
          },
          {
            type: '通用课时消耗',
            num: giveNum.data.costCommCourseNum,
            money: giveNum.data.costCommCourseMoney
          },
          {
            type: '专用课时新增',
            num: giveNum.data.excCourseNum,
            money: giveNum.data.excCourseMoney
          },
          {
            type: '通用课时新增',
            num: giveNum.data.commCourseNum,
            money: giveNum.data.commCourseMoney
          }
        ]
        state.giveNumList = giveNumList
      } else {
        Message.error(
          (giveNum && giveNum.data && giveNum.data.errorMessage) ||
            '赠送课时获取失败！'
        )
      }

      const giveTime = await getGiveTime(payload)
      if (giveTime && giveTime.data && giveTime.data.errorCode === 0) {
        const giveTimeList = [
          {
            type: '服务期间',
            num: giveTime.data.newSerPeriodExtNum,
            money: giveTime.data.newSerPeriodExtMoney
          },
          {
            type: '开合同时',
            num: giveTime.data.newPurPeriodExtNum,
            money: giveTime.data.newPurPeriodExtMoney
          }
        ]
        state.giveTimeList = giveTimeList
        state.searchValue = payload
      } else {
        Message.error(
          (giveTime && giveTime.data && giveTime.data.errorMessage) ||
            '赠送时间获取失败！'
        )
      }

      commit(HIDE_LOADING)
    }
  }
}
export default giveRecord
