
<template>
  <div class="message_notice">
    <div style="margin-bottom: 20px;">
      <el-button
        :class="fourthRoute === 'notice' ? 'active_btn' : ''"
        @click="changeFourth('notice')"
      >通知设置</el-button>
      <el-button
        :class="fourthRoute === 'sms' ? 'active_btn' : ''"
        @click="changeFourth('sms')"
      >短信消息</el-button>

      <el-button
        v-if="fourthRoute === 'notice'"
        type="primary"
        class="notice_bind_btn"
        @click="openDialog"
      >员工微信绑定</el-button>
    </div>

    <!-- 菜单改动！！！--通知设置start -->
    <div v-if="fourthRoute === 'notice'">
      <CommonTable
        ref="tableCommon"
        :columns="columns"
        :table-height="tableHeight"
        :pagination="listQuery"
        :options="optionsTab"
      />

      <el-dialog
        :visible.sync="switchDialog"
        :title="dialogTitle"
        @close="cancelDialog()"
      >
        <div v-if="!isAdd">
          <el-form>
            <el-form-item label="短信通知：">
              <span>{{ noticeData.smsSwitch==='1'?'开启':'关闭' }}</span>

            </el-form-item>
            <el-form-item label="微信通知：">
              <span>{{ noticeData.wxSwitch==='1'?'开启':'关闭' }}</span>

            </el-form-item>
            <el-form-item label="通知时间：">
              <span>{{ noticeData.sendTime }}</span>

            </el-form-item>

            <el-form-item label="消息实例：">
              <pre style="margin:0;padding-left:82px;white-space:pre-wrap;">{{ noticeData.tplContent }}</pre>
            </el-form-item>

            <el-form-item label="推送对象：">
              <span v-if="noticeData.target== '1'">绑定微信并关注微信公众号的家长

                <el-popover
                  placement="top-start"
                  width="290"
                  trigger="hover"
                  content="1、前往CRM-学员家长绑定家长微信。2、家长关注闪闪。"
                >

                  <!-- <i
                    slot="reference"
                    class="el-icon-question"
                  /> -->
                  <i
                    slot="reference"
                    class="iconfont icon_ym_ts"
                    style="color:#666"
                  />
                </el-popover>
              </span>
              <span
                v-for="(v,index) in noticeData.userList"
                :key="index"
              > {{ v.userName }}<i :class="[{'nowx':v.flag==='1'},'iconfont','icon_gb_wx']" /></span>
            </el-form-item>
          </el-form>

        </div>
        <div v-else>
          <div>
            <el-form label-width="90px">

              <el-form-item label="信息接收人:">

                <el-select
                  v-model="newPerson"
                  multiple
                  filterable
                  placeholder="请输入新建消息接收人"
                  @change="(val)=> {newPersonChange(saveRows.userList,val)}"
                  @visible-change="(val)=>{visibleChange(saveRows.userList,val)}"
                >
                  <el-option
                    v-for="item in userList"
                    :disabled="item.display"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id+'_'+item.name"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="已选:">
                <span
                  v-for="(v,i) in saveRows.userList"
                  :key="i"
                >
                  <span @click="deleteReceive(v,i)"> {{ v.userName }} <i class="el-icon-error" /></span>
                </span>
                <span
                  v-for="(sel,selIndex) in selectedArr"
                  :key="sel.stuId"
                >
                  <span @click="deleteReceive1(sel,selIndex)"> {{ sel.userName }} <i class="el-icon-error" /></span>
                </span>
              </el-form-item>
            </el-form>

          </div>

        </div>
        <span
          v-if="isAdd"
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            class="cancel_btn"
            @click="cancelDialog()"
          >取 消</el-button>
          <el-button
            type="primary"
            @click="addReceive(saveRows.userList)"
          >确 定</el-button>
        </span>
      </el-dialog>
      <WeChat ref="wechatCode" />
    </div>
    <!-- 菜单改动！！！--通知设置end -->

    <!-- 菜单改动！！！--短信消息start -->
    <SmsLog v-if="fourthRoute === 'sms'" />
    <!-- 菜单改动！！！--短信消息end -->
  </div>
</template>

<script>
// eslint-disable-next-line
import { queryTemp, addReceiver, updateMsgTemp, removeReceiver, tenantUserSummaryQuery } from '@/api/orgSet/messageNotice.js'

import CommonTable from '@/components/CommonTable/CommonTable'
import WeChat from '@/components/WeChat/WeChat'
import SmsLog from '@/views/orgSet/smsLog/smsLog'

export default {
  components: {
    CommonTable,
    WeChat,
    SmsLog
  },
  data() {
    return {
      fourthRoute: 'notice',
      classRoomData: {
        name: '',
        direction: ''
      },
      saveRows: '',
      switchDialog: false,
      isAdd: false,
      newPerson: [],
      noticeData: '',
      dialogTitle: '上课通知',
      listQuery: {
        show: true // 是否显示
      },
      columns: [

        {
          label: '业务名称',
          prop: 'tplTitle',

          formatter: (row, column, cellValue) => {
            return `<div style="color:#1D9DF2;text-overflow:ellipsis;overflow:hidden">${row.tplTitle}</div>`
          },
          methods: (row) => {
            this.openDetailDialog(row)
          }
        },
        {
          label: '说明',
          prop: 'sendTime'
        },
        {
          label: '推送对象',
          prop: 'target',
          width: '200',
          align: 'center',
          isShowTooltip: true,
          renderHeader: (h, { column, $index }) => {
            return h('div', {
              style: { lineHeight: '23px', paddingTop: '7px' }
            }, [h('span', {

            }, '推送对象',
            ),
            h('el-popover', {
              props: { placement: 'top', trigger: 'hover', width: '300' }
            }, [
              h(
                'div',
                [
                  h('div', '家长：绑定微信并关注微信公众号的家长'),
                  h('div', '员工：自行设置；员工需绑定微信公众号')
                ]
              ),
              h('i', { slot: 'reference', class: 'el-icon-view' })
            ])
            ])
          },
          render: (h, params) => {
            if (params.row.target === '1') {
              return h('span', '家长')
            } else {
              const getLiEleArr = (h) => {
                if (params.row.userList && params.row.userList.length <= 4) {
                  return params.row.userList.map((item, index) => h('span', {
                    style: { marginRight: '10px' },
                    on: {
                      'click': handleClick
                    },
                    key: `${index}`
                  }, [item.userName, h('i',
                    { class: {
                      'iconfont': true,
                      'icon_gb_wx': true,
                      'nowx': item.flag === '1'
                    },
                    style: 'margin-left:2px'
                    })]))
                } else {
                  let other = []
                  other = Object.assign([], params.row.userList).slice(0, 4)
                  return h('div', { style: 'display:inline-block' }, [
                    h(
                      'el-popover',
                      {
                        props: { placement: 'top', trigger: 'hover' }
                      },
                      [
                        h(
                          'div',
                          params.row.userList.map((item, index) => h('span', {
                            style: { marginRight: '10px' },
                            on: {
                              'click': handleClick
                            },
                            key: `${index}`
                          }, [item.userName, h('i',
                            { class: {
                              'iconfont': true,
                              'icon_gb_wx': true,
                              'nowx': item.flag === '1'
                            },
                            style: 'margin-left:2px'
                            })])),
                        ),
                        h('span', { slot: 'reference' },
                          other.map((item, index) => h('span', {
                            style: { marginRight: '10px' },
                            on: {
                              'click': handleClick
                            },
                            key: `${index}`
                          }, [item.userName, h('i',
                            { class: {
                              'iconfont': true,
                              'icon_gb_wx': true,
                              'nowx': item.flag === '1'
                            }, style: 'margin-left:2px' })]))),
                        h('span', { style: 'margin-right:10px', slot: 'reference' },
                          '...')
                      ]
                    )
                  ])
                }
              }
              const handleClick = event => {
                event.stopPropagation()
              }

              const addNewMember = event => {
                this.getTenatUserList()
                this.selectedArr = []
                this.isAdd = true
                this.dialogTitle = '消息接收人'
                this.saveRows = Object.assign({}, params.row)
                event.stopPropagation()
              }

              return h('span', {}, [getLiEleArr(h), h('el-button', { class: 'edit_btn el-button--primary', on: { 'click': addNewMember }}, '编辑')])
            }
          }

        },
        // 一期不做
        // {label: '短信通知',
        //   prop: 'smsSwitch',

        //   render: (h, params) => {
        //     return (
        //       <el-switch v-model={params.row.switch} active-value='1' inactive-value='0' active-color='#46b6ee'
        //         inactive-color='#dcdfe6' ></el-switch>
        //     )
        //   }

        // },

        { label: '微信通知',
          prop: 'wxSwitch',
          render: (h, params) => {
            return (
              <el-switch v-model={params.row.wxSwitch} active-value='1' inactive-value='2' active-color='#46b6ee'
                inactive-color='#dcdfe6' nativeOnClick={() => {
                  this.switchReceiver(params.row)
                }}></el-switch>
            )
          }

        }

      ],
      optionsTab: {
        apiService: queryTemp, // 表格的数据请求接口
        isSettingShow: false // 是否出现设置
      },

      tableHeight: 'calc(100vh - 228px)',
      userList: [], // 新建消息接收人列表
      selectedArr: [] // 已选的列表
    }
  },

  methods: {
    /** 改变4级菜单 */
    changeFourth(route) {
      this.fourthRoute = route
    },

    /* 消息接收人改变 */
    newPersonChange(list, val) {
      this.selectedArr = []
      let userArr = []
      val && val.map(item => {
        userArr = item.split('_')
        const obj = {
          userId: userArr && userArr[0],
          userName: userArr && userArr[1]
        }
        this.selectedArr.push(obj)
      })
    },
    visibleChange(list, val) {
      if (val) {
        for (const index in list) {
          for (const userIndex in this.userList) {
            if (list[index].userId === this.userList[userIndex].id) {
              this.$nextTick(() => {
                this.$forceUpdate()
                this.userList[userIndex].display = true
              })
            } else {
              this.userList[userIndex].display = false
            }
          }
        }
      }
    },
    /* 员工列表查询 */
    getTenatUserList() {
      tenantUserSummaryQuery().then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.switchDialog = true
          this.userList = data.results
        } else {
          this.$message.error(data.errorMessage || '获取员工列表失败')
        }
      })
    },
    // 添加信息接收人
    switchReceiver(val) {
      var data = {
        id: val.id
      }
      // eslint-disable-next-line
      if (val.wxSwitch == '1') {
        data.wxSwitch = '1'
      } else {
        data.wxSwitch = '2'
      }

      updateMsgTemp(data).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success(res.data.errorMessage)
          this.$refs.tableCommon.getList()
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    // 删除信息接收人
    deleteReceive(val, index) {
      this.saveRows.userList.splice(index, 1)
    },
    /* 删除下拉选中的接收人 */
    deleteReceive1(val, index) {
      this.selectedArr.splice(index, 1)
      this.newPerson.splice(index, 1)
    },
    // 添加信息接收人
    addReceive(list) {
      const idArr = []
      let userArr = []
      let userIds = ''
      if (this.newPerson && this.newPerson.length > 0) {
        this.newPerson.map(item => {
          userArr = item.split('_')
          idArr.push(userArr[0])
        })
        if (list && list.length > 0) {
          list.map(listItem => {
            idArr.push(listItem.userId)
          })
        }
        userIds = idArr.join(',')
      } else {
        if (list && list.length > 0) {
          list.map(listItem => {
            idArr.push(listItem.userId)
          })
          userIds = idArr.join(',')
        }
      }
      const data = {
        userIds: userIds,
        type: this.saveRows.type
      }
      if (userIds) {
        addReceiver(data).then(res => {
          if (res.data.errorCode === 0) {
            this.cancelDialog()
            this.$message.success(res.data.errorMessage)
            this.$refs.tableCommon.getList()
          } else {
            this.$message.error(res.data.errorMessage)
          }
        })
      } else {
        this.$message.error('请选择消息接收人')
      }
    },
    // 员工微信绑定
    openDialog() {
      this.$refs.wechatCode.openDialog()
      this.$refs.wechatCode.getQr()
    },

    openDetailDialog(val) {
      this.noticeData = Object.assign({}, val)
      this.switchDialog = true
      this.dialogTitle = val.tplTitle
      this.isAdd = false
    },

    cancelDialog() {
      this.switchDialog = false
      // this.isAdd = true
      this.newPerson = []
      if (this.isAdd) {
        this.$refs.tableCommon.getList()
      }
    },
    getUserList(val) {
      for (let i = 0; i < val.length; i++) {
        i.name
      }
      return
    }

  }
}
</script>

<style lang="scss" scoped>
.notice_bind_btn {
  float: right;
}

.active_btn {
  border-color: #46b6ee;
  color: #46b6ee;
}
</style>

<style lang="scss">
.message_notice {
  box-sizing: border-box;
}

.nowx {
  color: #46b6ee;
}
// .page_title_text {
//   font-weight: 900;
//   padding-bottom: 14px;
//   border-bottom: 1px solid rgba(238, 238, 238, 1);
//   margin: 20px 0;
//   padding-left: 20px;
// }
</style>
