import {
  loginByUsername,
  logout,
  getUserInfo,
  querySessionContent
} from '@/api/login'
import { getOrgan } from '@/api/sider/side'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    id: '',
    avatar: '',
    introduction: '',
    tenantId: 0,
    orgId: 0,
    roles: [],
    buttonAuth: [],
    orgName: '',
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_TENANTID: (state, tenantId) => {
      state.tenantId = tenantId
    },
    SET_ORGID: (state, orgId) => {
      state.orgId = orgId
    },
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ORGNAME: (state, orgName) => {
      state.orgName = orgName
    },
    SET_BUTTON_AUTH: (state, buttonAuth) => {
      state.buttonAuth = buttonAuth
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginByUsername(userInfo)
          .then(response => {
            let data = response.data
            if (data.errorCode === 0) {
              data = data.data
              commit('SET_TOKEN', data.jwtToken)
              commit('SET_TENANTID', userInfo.tenantId)
              commit('SET_ORGID', userInfo.orgId)
              setToken(data.jwtToken)
              resolve()
            } else {
              reject(data.errorMessage)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        querySessionContent()
          .then(response => {
            if (!response.data) {
              // 由于mockjs 不支持自定义状态码只能这样hack
              reject('error')
            }
            const res = response.data
            if (res.errorCode === 0) {
              const data = res.data
              if (data.authorities && data.authorities.length > 0) {
                // 验证返回的roles是否是一个非空数组
                getOrgan().then(res => {
                  const data = res.data
                  if (data.errorCode === 0) {
                    commit('SET_ORGNAME', data.orgName)
                  } else {
                    reject(data.errorMessage)
                  }
                })
                commit('SET_TENANTID', data.session.tenantId)
                commit('SET_ORGID', data.session.orgId)
                commit('SET_ROLES', data.authorities)
                commit('SET_BUTTON_AUTH', data.operationAuth)
                commit('SET_NAME', data.session.uName)
                commit('SET_ID', data.session.uid)
                commit('SET_AVATAR', data.avatar)
                commit('SET_INTRODUCTION', data.introduction)
                resolve(response)
              } else {
                reject('您没有操作权限,不能登录')
              }
            } else {
              reject(res.errorMessage)
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout()
          .then(() => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            commit('SET_NAME', '')
            commit('SET_ID', '')
            removeToken()
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_ID', data.id)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
          resolve()
        })
      })
    }
  }
}

export default user
