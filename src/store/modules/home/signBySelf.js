import { Message } from 'element-ui'
import moment from 'moment'
import { stuQuickSign, querySignSelf } from '@/api/home/signBySelf'
import { lodopPrintStuSignSelf } from '@/utils/lodopPrintUtils'
import { SHOW_LOADING, HIDE_LOADING, UPDATE_STATE } from '../../types'

const signBySelf = {
  namespaced: true,

  state: {
    loading: false,
    visible: false,
    stepFlg: true, // 是否安装了lodoop控件
    qrcode: '',

    qrcodeUrl: undefined,
    stuSignList: [], // 学员签到数据
    lodopResourceDownloadUrl:
      'http://saas.ishanshan.com/saas3.0/lodop_pring_resource.rar'
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
    // 显示和打开自助扫描签到窗口
    async showSwitch({ state, commit, dispatch }, payload) {
      if (!window.LODOP) {
        dispatch('initLodopConfing')
      }

      const sleep = function(ms) {
        return new Promise(function(resolve, reject) {
          setTimeout(function() {
            resolve()
          }, ms)
        })
      }
      await sleep(500)
      dispatch('validateLodopConfig')
      commit(UPDATE_STATE, { qrcode: '' })
    },

    // 初始化lodop打印配置
    initLodopConfing({ state, commit, dispatch }, payload) {
      //            let {ret} = yield call(getLodopConfig);
      const ret = {
        errorCode: 9000,
        host: '127.0.0.1',
        port: '18000'
      }
      if (ret && ret.errorCode === 9000) {
        const { host, port } = ret
        commit(UPDATE_STATE, { host, port })

        const head = document.getElementsByTagName('body')[0]

        const lodopjs_script = document.createElement('script')
        lodopjs_script.type = 'text/javascript'
        lodopjs_script.name = 'lodopjs'
        lodopjs_script.src = 'http://' + host + ':' + port + '/CLodopfuncs.js'

        lodopjs_script.onreadystatechange = function() {
          if (this.readyState === 'complete') {
            initGetCLodopFunc()
          }
        }
        lodopjs_script.onload = function() {
          initGetCLodopFunc()
        }
        head.appendChild(lodopjs_script)

        // eslint-disable-next-line no-inner-declarations
        function initGetCLodopFunc() {
          // eslint-disable-next-line no-undef
          window.LODOP = getCLodop(
            document.getElementById('LODOP_OB'),
            document.getElementById('LODOP_EM')
          )
        }
      }
    },

    // 校验lodop的配置是否正确
    validateLodopConfig({ state, commit, dispatch }, payload) {
      try {
        if (window.LODOP && window.LODOP.VERSION) {
          commit(UPDATE_STATE, { stepFlg: true, visible: true })
          dispatch('querySignSelf')
        } else {
          commit(UPDATE_STATE, { stepFlg: false, visible: true })
        }
      } catch (err) {
        console.info('err', err)
      }
    },

    // 扫码签到记录
    async querySignSelf({ state, commit, dispatch }, payload) {
      window.query_sign_self = true // 打开自助扫码签到扫描
      const params = {
        pageIndex: 0,
        pageSize: 5,
        status: '2',
        onlyToday: true
      }
      const sleep = function(ms) {
        return new Promise(function(resolve, reject) {
          setTimeout(function() {
            resolve()
          }, ms)
        })
      }
      while (window.query_sign_self) {
        const { data } = await querySignSelf(params)
        if (data && data.errorCode === 0) {
          state.stuSignList = data.results
          state.qrcodeUrl = data.linkUrl
        } else {
          Message.error(
            (data && data.errorMessage) || '查询扫码签到记录出错啦!'
          )
        }
        await sleep(2000)
      }
    },

    // 扫码签到
    async signByQrcode({ state, commit }, payload) {
      const { qrcodeStr } = payload
      const arr = qrcodeStr.split('@@')
      const cont = arr[1].split('#')

      const orgId = cont[1]
      const stuId = cont[2]
      const parentId = cont[3]
      const key = orgId + '_' + stuId + '_' + parentId

      const dayStr = moment().format('YYYY-MM-DD HH:mm')
      const signBySelf = window.signBySelf || {}
      const signBySelfDayObj = signBySelf[dayStr] || {}
      const signBySelfValue = signBySelfDayObj[key]

      if (!signBySelfValue || signBySelfValue === '') {
        signBySelfDayObj[key] = '1'
        signBySelf[dayStr] = signBySelfDayObj
        window.signBySelf = signBySelf // 用来控制当天签到过得不会重复签到

        // 打印签到情况 orgName, stuName, scheduleType, courseName, classroomName, signType, costNum, signTime
        // LODOP_PrintStuSignSelf('杭州美吉姆早教中心滨江店', '王大海', '班课', '音乐课二届', '玉兰山', '补课', 4, '2017-04-23 13:33:22');

        // 自主 快速签到
        const { data } = await stuQuickSign({
          orgId: orgId,
          stuId: stuId,
          parentId: parentId,
          status: '2'
        })
        if (data && data.errorCode === 0) {
          if (!!data.courseName && data.courseName.length > 0) {
            if (data.courseNamePrint) {
              for (const i in data.courseName) {
                lodopPrintStuSignSelf(
                  data.orgName || '',
                  data.stuName || '',
                  data.courseName[i] || '',
                  data.parentName || '',
                  data.signTimeStr || '',
                  data.logoUrl || ''
                )
              }
            } else {
              lodopPrintStuSignSelf(
                data.orgName || '',
                data.stuName || '',
                '',
                data.parentName || '',
                data.signTimeStr || '',
                data.logoUrl || ''
              )
            }
          } else {
            Message.warning(`${data.stuName}本日无排课信息`)
            lodopPrintStuSignSelf(
              data.orgName || '',
              data.stuName || '',
              '',
              data.parentName || '',
              data.signTimeStr || '',
              data.logoUrl || ''
            )
          }
        } else {
          Message.error(
            data && data.errorMessage ? data.errorMessage : '签到失败'
          )
          window.signBySelf[dayStr][key] = ''
        }
        state.qrcode = ''
      } else {
        state.qrcode = ''
      }
    }
  }
}
export default signBySelf
