<template>
  <div class="myGame-container">
    <div class="myGame-top">
      <!-- 搜索框 -->
      <div class="search">
        <CommonSearch
          :is-inline="true"
          :params="formInline"
          :forms="formInline"
          @toParent="resetFieldHanle"
        />
      </div>
    </div>
    <div class="myGame-cont">
      <!-- 表格 -->
      <Table
        ref="tableCommon"
        :columns="columns"
        :tableHeight="tableHeight"
        :pagination="listQuery"
        :operation="operates"
        :options="options"
        table-key="marketing_microGame_microGame"
      />
      <!-- 编辑页面弹框 -->
      <creatMyGame
        v-if="picDetailShow"
        :visible.sync="picDetailShow"
        :is-edit="isEdit"
        :edit-url="editUrl"
        :reset-edit="GET_EDIT_URL"
        @openPreviewDialog="openPreviewDialog"
        @reloadList="reloadList"
      />
      <!-- 查看数据弹框 -->
      <dataDetail
        v-if="dataDetailShow"
        :visible.sync="dataDetailShow"
      />
      <!-- 二维码弹框 -->
      <el-dialog
        v-if="message!==''"
        :visible.sync="dialogVisible"
        :append-to-body="true"
        custom-class="erweimaBox"
        width="400px"
      >
        <qrcode
          :options="{ width: 360,height:360,padding:0,margin:0 }"
          :value="message"
          class="erweima"
        />
        <p>请使用微信扫一扫</p>
        <div class="erweima-footer">
          <div class="ipt">
            <el-input
              ref="url"
              v-model="message"
              :readonly="true"
            />
          </div>
          <el-button
            v-clipboard:copy="message"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
            type="primary"
          >复制地址</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 游戏保存成功后的弹框 -->
    <el-dialog
      :visible.sync="previewDialogVisible"
      title="保存成功"
      width="400px"
      append-to-body
      @close="closePreviewDialog"
    >
      <div>
        <p class="game_top"><i class="el-icon-circle-check icon_success" />微游戏已保存成功</p>
        <div class="game_qrcode">
          <transition name="el-zoom-in-bottom">
            <Qrcode
              v-if="previewDialogData.qrcodeUrl"
              :value="previewDialogData.qrcodeUrl"
              :options="{ width: 190,height:190,margin: 0 }"
            />
          </transition>
        </div>
        <div class="copy_box">
          <el-input
            ref="url"
            v-model="previewDialogData.qrcodeUrl"
            :readonly="true"
            :style="{marginRight: '20px'}"
          />
          <el-button
            v-clipboard:copy="previewDialogData.qrcodeUrl"
            v-clipboard:success="previewCopy"
            v-clipboard:error="previewError"
            type="primary"
          >复制</el-button>
        </div>
      </div>
      <span slot="footer">
        <el-button @click="goMyGame('edit')">再次编辑</el-button>
        <el-button @click="closePreviewDialog">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapMutations, mapState, mapActions } from 'vuex'

import CommonSearch from '@/components/CommonSearch/CommonSearch'
import Table from '@/components/CommonTable/CommonTable'
import { queryGameInsts, getOrgName, queryGameInfos, updateStatus } from '@/api/marketing/microGame.js'
// 调用slideDetail
import creatMyGame from '../components/creatMyGame'
import dataDetail from '../components/myGameDataDetail'
// 二维码装换插件
import Vue from 'vue'
import Qrcode from '@chenfengyuan/vue-qrcode'
// 复制插件
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
export default {
  components: {
    CommonSearch,
    Table,
    creatMyGame,
    dataDetail,
    Qrcode
  },
  data() {
    return {
      obj: {},
      dataObj: {},
      formObj: {},
      list: [],
      orgList: [],
      formInline: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '游戏名称',
            modelValue: 'dataTitle',
            isClearable: true
          },
          {
            itemType: 'select',
            placeholder: '游戏类型',
            modelValue: 'gameCode',
            isClearable: true,
            apiService: queryGameInfos,
            labelKey: 'gameTitle',
            valueKey: 'gameCode',
            params: { status: 1, pageSize: 10000 }
          },
          {
            itemType: 'select',
            placeholder: '状态',
            modelValue: 'status',
            isFilterable: true,
            isClearable: true,
            defaultFirst: true,
            default: true,
            itemStyle: 'width:140px',
            selectOption: [
              {
                label: '已上架',
                value: '1'
              }, {
                label: '已下架',
                value: '2'
              }, {
                label: '全部状态',
                value: ''
              }
            ]
          }
        ]
      },
      // 表格参数
      columns: [
        {
          label: '游戏名称',
          prop: 'dataTitle',
          isShowSet: true,
          isShowTooltip: true,
          width: '230',
          render: (h, params) => {
            return h(
              'div',
              {
                style: 'display:flex'
              }, [
                h('img', { style: 'width:40px;height:40px;margin-right:10px', attrs: { src: params.row.icon }}),
                h('div', { class: 'gameName',
                  on: {
                    click: () => {
                      this.picDetailBtn(params.row)
                    }
                  }}, params.row.dataTitle)
              ]
            )
          }
        }, {
          label: '二维码',
          prop: 'demoUrl',
          isShowSet: true,
          formatter: (row) => {
            return `<i class="iconfont icon_ym_ewm iconfont_code"/>`
          },
          methods: (row) => {
            this.showDialog(row)
          }
        },
        {
          label: '状态',
          prop: 'statu',
          isShowTooltip: true,
          isShowSet: true,
          formatter: (row) => {
            if (row.status === '2') {
              return `<div style="display:flex">
                      <div style="margin-right:5px;margin-top:8px;width:8px;height:8px;background:rgba(208,2,27,1);border-radius:50px"></div>
                      <span>已下架</span>
                    </div>`
            } else {
              return `<div style="display:flex">
                      <div style="margin-top:8px;margin-right:5px;width:8px;height:8px;background:rgba(135,208,104,1);border-radius:50px"></div>
                      <span>已上架</span>
                    </div>`
            }
          }
        }, {
          label: '数据详情',
          prop: 'dataList',
          isShowSet: false,
          isShowTooltip: true,
          width: 150,
          height: 80,
          render: (h, params) => {
            if (this.hasBtn('202000002')) {
              return h(
                'div',
                {
                  style: 'display:flex;flex-direction:column;'
                }, [
                  h('div', { style: 'line-height:12px;font-size:10px' }, '有效用户：' + params.row.amount || '0'),
                  h('div', { style: 'line-height:12px;margin-right: 5px;margin-top:5px;font-size:10px' }, '浏览数：' + params.row.views || '0'),
                  h('a', { style: 'line-height:12px;margin-top:5px;font-size:10px',
                    on: {
                      click: () => {
                        this.dataDetailBtn(params.row)
                      }
                    }}, '查看')
                ]
              )
            } else {
              return h(
                'div',
                {
                  style: 'display:flex;flex-direction:column;'
                }, [
                  h('div', { style: 'line-height:12px;font-size:10px' }, '有效用户：' + params.row.amount || '0'),
                  h('div', { style: 'line-height:12px;margin-right: 5px;margin-top:5px;font-size:10px' }, '浏览数：' + params.row.views || '0')
                ]
              )
            }
          }
        }, {
          label: '游戏时间',
          width: 200,
          isShowTooltip: true,
          prop: 'gameTime',
          isShowSet: true,
          formatter: (row) => {
            return `<div class="box" style="display:flex;flex-direction:column;-webkit-line-clamp: 2;">
                        <div class="startTime" style="width:150px;height:20px">${row.startTime}~</div>
                        <div class="endTime" style="width:150px;height:30px;">${row.endTime}</div>
            </div>`
          }
        }, {
          label: '创建时间',
          width: 200,
          prop: 'createTime',
          isShowTooltip: true,
          isShowSet: true,
          isColShow: false
        }, {
          label: '游戏类型',
          prop: 'gameTitle',
          isShowSet: true,
          isShowTooltip: true
        }
      ],
      tableHeight: 'calc(100vh - 231px)',
      listQuery: {
        show: true // 是否显示
      },
      operates: {
        width: '160',
        fixed: 'right',
        list: [
          {
            label: '编辑',
            type: 'normal',
            btnId: '202000004',
            method: (row) => {
              this.picDetailBtn(row)
            }
          },
          {
            label_1: '上架',
            label_2: '下架',
            type: 'unnormal',
            method: (row) => {
              var status = ''
              row.status === '1' ? status = '2' : status = '1'
              const params = {
                m: 'update_status',
                gameId: row.gameId,
                gameCode: row.gameCode,
                dataId: row.dataId,
                status: status
              }
              updateStatus(params).then(res => {
                if (res.data.errorCode === 9000) {
                  row.status === '1' ? row.status = '2' : row.status = '1'
                  if (this.formObj.status) {
                    this.$refs.tableCommon.getList({
                      'status': this.formObj.status
                    })
                  } else {
                    this.resetFieldHanle()
                  }
                } else {
                  this.$message.error(res.data && res.data.errorMsg || '上下架失败')
                }
              })
            },
            popoverCon: [
              {
                contentText: '确认要上架吗？',
                status: '2'
              }, {
                contentText: '确认要下架吗？',
                status: '1'
              }
            ]
          }
        ]
      },
      options: {
        apiService: queryGameInsts, // 表格的数据请求接口
        isSettingShow: true,
        params: { status: 1 }
      },
      isBorder: true,
      // 二维码弹框数据
      dialogVisible: false,
      message: '',
      // 数据详情，编辑弹框参数
      picDetailShow: false,
      dataDetailShow: false,
      dataDetailTable: {

      },
      tableShow: false,
      searchShow: false,
      previewDialogVisible: false, // 游戏保存后预览弹框显示
      previewDialogData: {} // 游戏保存后预览弹框显示数据
    }
  },

  computed: {
    ...mapState('microGame', ['isEdit', 'editUrl'])
  },

  mounted() {
    this.getOrgName()
    if (this.isEdit) {
      this.obj = { isGameEdit: true }
      this.picDetailShow = true
    }
  },
  methods: {
    ...mapMutations('microGame', ['GET_EDIT_URL']),
    // 打开游戏保存后的预览弹框, gameUrl: 游戏链接, data: iframe传递的信息
    openPreviewDialog(data) {
      this.previewDialogVisible = true
      this.previewDialogData = {
        qrcodeUrl: data.instH5Url
      }
      this.obj = {
        ...this.obj,
        dataId: data.instId
      }
    },
    // 关闭游戏保存后的预览弹框
    closePreviewDialog() {
      this.previewDialogVisible = false
    },
    previewCopy: function(e) {
      this.$message({
        message: '复制成功',
        type: 'success'
      })
    },
    previewError: function(e) {
      this.$message.error('复制失败')
    },
    ...mapActions('changeThirdMain', [
      'changeTabs'
    ]),
    /** 刷新表格数据 */
    reloadList() {
      this.searchHandle(this.formValue)
    },
    /** 跳转我的 */
    goMyGame(type) {
      this.previewDialogVisible = false
      this.picDetailShow = true
    },
    /* 搜索框搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      const params = {
        status: 1
      }
      this.$refs.tableCommon.getList(params)
    },
    searchHandle(formValue) {
      // 搜索的入参
      this.formValue = formValue
      this.formObj = formValue
      const params = {
        ...this.formValue
      }
      this.$refs.tableCommon.getList(params)
    },
    // 表格方法

    // 数据详情弹框，编辑弹框方法
    picDetailBtn(val) {
      this.obj = val
      this.picDetailShow = true
    },
    dataDetailBtn(row) {
      this.dataObj = row
      this.dataDetailShow = true
    },
    //  二维码弹框方法
    showDialog(row) {
      this.dialogVisible = true
      const params = {
        m: 'h5',
        gameId: row.gameId,
        gameCode: row.gameCode,
        dataId: row.dataId,
        status: row.status
      }
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中',
        fullscreen: true,
        target: document.querySelector('.myGame-container')
      })
      updateStatus(params).then(res => {
        if (res.data.errorCode === 9000) {
          let qrurl = res.data.data.url
          if (!qrurl) {
            qrurl = ''
          } else if (qrurl.startsWith('//')) {
            qrurl = window.location.protocol + qrurl
          } else if (!qrurl.startsWith('http')) {
            qrurl = 'http://' + qrurl
          }
          this.message = qrurl
        } else {
          this.$message.error(res.data.errorMessage)
        }
        loading.close()
      })
    },
    onCopy: function(e) {
      this.$message({
        message: '复制成功',
        type: 'success'
      })
      this.$refs.url.style.background = 'rgba(51,141,233,1)'
      this.$refs.url.style.color = '#fff'
    },
    onError: function(e) {
      this.$message.error('复制失败')
    },
    getOrgName() {
      const params = {
        type: 1
      }
      getOrgName(params).then(res => {
        if (res.data.errorCode === 0) {
          this.orgList = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.myGame-container {
  .myGame-top {
    min-width: 920px;
  }
}
</style>
<style lang="scss">
.myGame-container .el-table__row {
  height: 60px;
  line-height: 16px;
  .cell {
    height: 70px !important;
  }
}

.erweimaBox {
  .el-dialog__header .el-dialog__title {
    height: 21px;
    display: block;
  }
  .el-dialog__body {
    padding: 20px !important;
    text-align: center;
    p {
      margin-top: 20px;
      margin-bottom: 10px;
      font-size: 16px;
      text-align: center;
    }
    .erweima-footer {
      display: flex;
      justify-content: space-around;
      .ipt {
        width: 262px;
        border-radius: 4px;
        transition: all 0.3s;
        line-height: 28px;
        overflow: hidden;
      }
      .el-input__inner {
        padding: 0 10px;
      }
      .el-button {
        margin-left: 2%;
      }
    }
  }
}
.iconfont_code {
  color: #46b6ee;
}
</style>
<style lang="scss">
.myGame-container {
  .gameName {
    overflow: hidden;
    text-overflow: ellipsis;
    color: #1d9df2;
    white-space: normal;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    width: 230px;
    line-height: 20px;
    font-size: 14px;
    -webkit-box-orient: vertical;
    cursor: pointer;
    &:hover {
      color: #56c0f5;
    }
  }

  //---------------------- 保存成功 start---------------------------
  .game_top {
    text-align: center;
    font-size: 20px;
    margin-bottom: 20px;
    .icon_success {
      color: #87d068;
      margin-right: 5px;
    }
  }

  .game_qrcode {
    text-align: center;
  }

  .copy_box {
    display: flex;
    margin-top: 20px;
    margin-bottom: 14px;
  }
  //---------------------- 保存成功 end---------------------------
}
</style>
