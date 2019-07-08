import { Message } from 'element-ui'
import {
  isModelFile,
  previewData,
  importexpendComplete, //eslint-disable-line
  iscompleteData
} from '@/api/crm/financeMgr/expend.js'

const SHOW_LOADING = 'SHOW_LOADING' // 显示loading
const HIDE_LOADING = 'HIDE_LOADING' // 隐藏loading
const UPDATE_STATE = 'UPDATE_STATE'

const expendInfo = {
  namespaced: true,

  state: {
    loading: false,
    btnDisabled: true,
    rule: '',
    uploadId: '', // 上传id

    // 第一步
    flag: false, // 是否摸板

    // 第二步
    fieldList: [], // 表单
    dataSource: [], // 源数据

    // 第三步
    cols: [], // 表格字段
    tableData: [], // 预览数据

    // 第四步
    regex: '',
    importInfo: {}, //  导入返回信息

    // 是否完成
    isComplete: false,
    completeInfo: {},
    hasFail: false,
    completeVisible: false
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
    [UPDATE_STATE](state, payload) {
      for (const i in payload) {
        state[i] = payload[i]
      }
    }
  },

  actions: {
    /** 是否摸板文件 */
    async isModelFile({ state, commit }, payload) {
      commit(SHOW_LOADING)

      state.uploadId = payload.id
      const { data } = await isModelFile(payload)
      if (data && data.errorCode === 0) {
        state.flag = data.flag
        state.btnDisabled = false
        const text = data.flag ? '摸板文件' : '非摸板文件'
        Message.success(`检测成功，该文件为${text}`)
      } else {
        Message.error((data && data.errorMessage) || '是否摸板文件判断失败！')
      }

      commit(HIDE_LOADING)
    },

    /** 导入预览 */
    async previewData({ state, commit }, payload) {
      commit(SHOW_LOADING)

      const { data } = await previewData(payload)
      if (data && data.errorCode === 0) {
        state.regex = payload.regex
        state.cols = data.dataModelFields
        state.tableData = data.results
      } else {
        Message.error((data && data.errorMessage) || '预览获取失败！')
      }

      commit(HIDE_LOADING)
    },

    /** 导入 */
    async importexpendComplete({ state, commit, dispatch }, payload) {
      commit(SHOW_LOADING)
      const params = {
        regex: payload.regex,
        id: payload.id
      }
      const { data } = await importexpendComplete(params)
      if (data && data.errorCode === 0) {
        state.importInfo = data.results
        dispatch('iscompleteData', {
          logFileId: data.data.logFileId,
          regex: state.regex
        })
        const timer = setInterval(() => {
          if (!state.isComplete) {
            dispatch('iscompleteData', {
              logFileId: data.data.logFileId,
              regex: state.regex,
              close: payload.close,
              refresh: payload.refresh
            })
          } else {
            clearInterval(timer)
            commit(HIDE_LOADING)
          }
        }, 5000)
      } else {
        Message.error((data && data.errorMessage) || '导入失败！')
        commit(HIDE_LOADING)
      }
    },

    /** 导入是否完成 */
    async iscompleteData({ state, commit }, payload) {
      const params = {
        regex: payload.regex,
        logFileId: payload.logFileId
      }
      const { data } = await iscompleteData(params)
      if (data && data.errorCode === 0) {
        state.isComplete = data.data.complete
        if (data.data.complete) {
          // 关闭导入
          payload.close && payload.close()
          state.completeInfo = data.data
          // 打开成功提示
          if (data.data.failNum > 0) {
            state.hasFail = true
          } else {
            state.hasFail = false
          }
          state.completeVisible = true
          payload.refresh && payload.refresh()
        }
      } else {
        Message.error((data && data.errorMessage) || '获取导入信息失败！')
        state.isComplete = true
        commit(HIDE_LOADING)
      }
    }
  }
}
export default expendInfo
