import { Message } from 'element-ui'
import {
  getStuBycourse,
  getStuByDate,
  getTimesBycourse,
  getTimesByDate
} from '@/api/reportForm/courseSale'
import { SHOW_LOADING, HIDE_LOADING } from '../../types'

const courseSale = {
  namespaced: true,

  state: {
    loading: false,
    searchValue: {},

    courseList: [], // 课程列表
    courseCols: [], // 课程图例

    dateList: [], // 日期列表
    allCols: [], // 日期全部图例
    showCols: [] // 日期显示的图例
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
    /** 获取图表数据 按学员人数 */
    async getStu({ state, commit }, payload) {
      commit(SHOW_LOADING)
      // 按学员人数柱形
      const stuListByCourse = await getStuBycourse(payload)
      if (
        stuListByCourse &&
        stuListByCourse.data &&
        stuListByCourse.data.errorCode === 0
      ) {
        const courseCols = []
        stuListByCourse.data.data.forEach(item => {
          courseCols.push({
            key: item.courseId,
            value: item.num
          })
        })

        state.courseCols = courseCols
        state.courseList = stuListByCourse.data.data
      } else {
        Message.error(
          (stuListByCourse &&
            stuListByCourse.data &&
            stuListByCourse.data.errorMessage) ||
            '课程售卖数据获取失败！'
        )
      }

      // 按学员人数折线
      const stuListByDate = await getStuByDate(payload)
      if (
        stuListByDate &&
        stuListByDate.data &&
        stuListByDate.data.errorCode === 0
      ) {
        let mapOnce = false
        const dateList = []
        const allCols = []
        const showCols = ['date']
        for (const i in stuListByDate.data.data) {
          const obj = {
            date: i
          }
          stuListByDate.data.data[i].forEach(item => {
            obj[item.courseId] = item.num
            if (!mapOnce) {
              allCols.push({
                key: item.courseId,
                value: item.courseName
              })
              showCols.push(item.courseId)
            }
          })
          mapOnce = true
          dateList.push(obj)
        }
        state.dateList = dateList
        state.allCols = allCols
        state.showCols = showCols
        state.searchValue = payload
      } else {
        Message.error(
          (stuListByDate &&
            stuListByDate.data &&
            stuListByDate.data.errorMessage) ||
            '课程售卖趋势获取失败！'
        )
      }

      commit(HIDE_LOADING)
    },

    /** 获取图表数据 按课时数 */
    async getTimes({ state, commit }, payload) {
      commit(SHOW_LOADING)
      // 按学员人数柱形
      const timesListByCourse = await getTimesBycourse(payload)
      if (
        timesListByCourse &&
        timesListByCourse.data &&
        timesListByCourse.data.errorCode === 0
      ) {
        const courseCols = []
        timesListByCourse.data.data.forEach(item => {
          courseCols.push({
            key: item.courseId,
            value: item.num
          })
        })

        state.courseCols = courseCols
        state.courseList = timesListByCourse.data.data
      } else {
        Message.error(
          (timesListByCourse &&
            timesListByCourse.data &&
            timesListByCourse.data.errorMessage) ||
            '课程售卖数据获取失败！'
        )
      }

      // 按学员人数折线
      const timesListByDate = await getTimesByDate(payload)
      if (
        timesListByDate &&
        timesListByDate.data &&
        timesListByDate.data.errorCode === 0
      ) {
        let mapOnce = false
        const dateList = []
        const allCols = []
        const showCols = ['date']
        for (const i in timesListByDate.data.data) {
          const obj = {
            date: i
          }
          timesListByDate.data.data[i].forEach(item => {
            obj[item.courseId] = item.num
            if (!mapOnce) {
              allCols.push({
                key: item.courseId,
                value: item.courseName
              })
              showCols.push(item.courseId)
            }
          })
          mapOnce = true
          dateList.push(obj)
        }
        state.dateList = dateList
        state.allCols = allCols
        state.showCols = showCols
        state.searchValue = payload
      } else {
        Message.error(
          (timesListByDate &&
            timesListByDate.data &&
            timesListByDate.data.errorMessage) ||
            '课程售卖趋势获取失败！'
        )
      }

      commit(HIDE_LOADING)
    }
  }
}
export default courseSale
