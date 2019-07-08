<template>
  <div class="activityShow-container">
    <div class="activityShow-top">活动管理</div>
    <div class="search">
      <div class="search-left">
        <CommonSearch
          :is-inline="true"
          :params="formInline"
          :forms="formInline"
          @toParent="resetFieldHanle"
        />
        <!-- <AdvancedSearch
          v-bind="superSearch"
          style="margin-left:10px"
        /> -->
      </div>
      <div class="search-right">
        <el-button
          v-if="hasBtn('305000001')"
          type="primary"
          @click="addActivity()"
        >新建活动</el-button>
      </div>
    </div>
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      :operation="operates"
      table-key="microWeb_activityShow_index"
      class="borderTable"
    />
    <!-- 二维码弹框 -->
    <el-dialog
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
    <!-- 报名弹窗 -->
    <enroll
      v-if="enrollShow"
      :visible.sync="enrollShow"
    />
    <addActivity
      v-if="addActivityShow"
      ref="addActivityDialog"
      :edit-obj="editObj"
      :visible.sync="addActivityShow"
      @closeCreateDialog="closeCreateDialog"
    />
  </div>
</template>
<script>
import CommonSearch from '@/components/CommonSearch/CommonSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
import addActivity from './components/addActivity'
import { getActivityList, updateStatus, getActivityAddress, getActivityMsg } from '@/api/microWeb/activityShow'
// 二维码装换插件
import Vue from 'vue'
import VueQrcode from '@chenfengyuan/vue-qrcode'
Vue.component(VueQrcode.name, VueQrcode)
// 复制插件
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
// 报名弹窗
import enroll from './components/enroll'

export default {
  components: {
    CommonSearch,
    CommonTable,
    enroll,
    addActivity
  },
  data() {
    return {
      activityObj: {},
      editObj: {},
      formValue: {},
      // superValue: {},
      // 搜索参数
      formInline: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '活动名称',
            modelValue: 'name',
            isClearable: true,
            itemStyle: 'width: 140px'
          },
          {
            itemType: 'select',
            placeholder: '活动状态',
            modelValue: 'status',
            isFilterable: true,
            isClearable: true,
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
      // 二维码弹框数据
      dialogVisible: false,
      message: '',
      // 表格参数
      listQuery: {
        show: true // 是否显示
      },
      columns: [
        {
          label: '活动名称',
          prop: 'name',
          isShowSet: true,
          // isShowTooltip: true,
          width: 150,
          render: (h, params) => {
            return h('div', {}, [
              h('div', { style: { overflow: 'hidden', 'text-overflow': 'ellipsis', color: 'rgba(24,145,237,1)',
                'white-space': 'normal', display: '-webkit-box', '-webkit-line-clamp': '2', width: '120px',
                'line-height': '15px', 'font-size': '14px', '-webkit-box-orient': 'vertical'
              }, on: { click: () => {
                this.addActivityDialogShow(params.row)
              } }
              }, [h('el-tooltip', {
                props: { placement: 'top', width: '200', content: params.row.name, effect: 'dark' }
              }, [
                h('a',
                  { },
                  params.row.name)
              ])])
            ])
          }
        },
        {
          label: '二维码',
          prop: 'address',
          isShowSet: true,
          formatter: (row) => {
            return `<i class="iconfont icon_ym_ewm"/>`
          },
          methods: (row) => {
            this.showDialog(row)
          }
        },
        {
          label: '活动报名时间',
          width: 170,
          prop: 'enlistTime',
          isShowSet: true,
          formatter: (row) => {
            return `<div class="box" style="display:flex;flex-direction:column;-webkit-line-clamp: 2;">
                        <div class="startTime" style="width:150px;height:20px">${row.applystartTime}~</div>
                        <div class="endTime" style="width:150px;height:30px;">${row.applyendTime}</div>
            </div>`
          }
        },
        {
          label: '状态',
          prop: 'status',
          isShowSet: true,
          formatter: (row) => {
            if (row.status === '1') {
              return `<div style="display:flex">
                      <div style="margin-top:8px;margin-right:5px;width:8px;height:8px;background:rgba(135,208,104,1);border-radius:50px"></div>
                      <span>已上架</span>
                    </div>`
            } else if (row.status === '2') {
              return `<div style="display:flex">
                      <div style="margin-right:5px;margin-top:8px;width:8px;height:8px;background:rgba(208,2,27,1);border-radius:50px"></div>
                      <span>已下架</span>
                    </div>`
            }
          }
        },
        {
          label: '排序值',
          prop: 'sort',
          isShowSet: true,
          width: '150',
          renderHeader: (h, { column, $index }) => {
            return h('div', {}, [
              h('span', '排序值'),
              h('el-tooltip', { props: { effect: 'dark', content: '排序值越大排在越前面', placement: 'top' }}, [
                h('i', { 'class': 'el-icon-warning', style: { marginLeft: '5px' }})
              ])
            ])
          },
          align: 'right',
          formatter: (row) => {
            return `<span>${row.sort}</span>`
          }
        },
        {
          label: '报名成功/等位',
          prop: 'orgName',
          isShowSet: true,
          isShowTooltip: true,
          width: 170,
          formatter: (row) => {
            return `<div style="color:rgba(24,145,237,1)">${row.sucNum}/${row.waitNum}</div>`
          },
          methods: (row) => {
            this.activityObj = row
            this.enrollDialogShow()
          }
        },
        {
          label: '创建时间',
          prop: 'createTime',
          isColShow: false,
          width: 170,
          isShowTooltip: true,
          isShowSet: true
        }

      ],
      options: {
        isSettingShow: true, // 是否出现设置
        apiService: getActivityList // 表格的数据请求接口
      },
      tableHeight: 'calc(100vh - 240px)',
      isBorder: true,
      operates: {
        fixed: 'right',
        width: 200,
        list: [
          {
            label_1: '上架',
            label_2: '下架',
            type: 'unnormal',
            prop: 'status',
            btnId: '305000004',
            method: (row) => {
              if (row.status === '1') {
                row.status = '2'
              } else if (row.status === '2') {
                row.status = '1'
              }
              const loading = this.$loading({
                lock: true,
                text: '拼命加载中',
                fullscreen: false,
                target: document.querySelector('.activityShow-container')
              })
              const params = {
                ids: row.id,
                status: row.status
              }
              updateStatus(params).then(res => {
                if (res.data.errorCode === 0) {
                  this.resetFieldHanle(res)
                } else {
                  this.$message.error(res.errorMessage)
                }
                loading.close()
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
          },
          {
            label: '编辑',
            type: 'normal',
            btnId: '305000003',
            method: (row) => {
              this.addActivityDialogShow(row)
            }
          },
          {
            label: '删除',
            type: 'normal',
            btnId: '305000002',
            method: (row) => {
              const params = {
                ids: row.id,
                status: 0
              }
              const loading = this.$loading({
                lock: true,
                text: '拼命加载中',
                fullscreen: false,
                target: document.querySelector('.activityShow-container')
              })
              updateStatus(params).then(res => {
                if (res.data.errorCode === 0) {
                  this.resetFieldHanle(res)
                } else {
                  this.$message.error(res.errorMessage)
                }
                loading.close()
              })
            },
            popoverCon: [
              {
                contentText: '确认删除？'
                // status: '1'
              }
            ]
          }
        ]
      },
      // 报名弹窗
      enrollShow: false,
      // 新增活动
      addActivityShow: false
    }
  },
  methods: {
    closeCreateDialog() {
      this.editObj = {}
    },
    /* 搜索 */
    searchHandle(formValue) {
      this.formValue = formValue
      // 搜索的入参
      const params = {
        ...this.formValue
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle(formValue) {
      // 重置的入参
      const params = {
        // ...this.superValue
      }
      this.$refs.tableCommon.getList(params)
      this.formValue = {}
    },
    //  二维码弹框方法
    showDialog(row) {
      const params = {
        actId: row.id
      }
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中',
        fullscreen: false,
        target: document.querySelector('.activityShow-container')
      })
      getActivityAddress(params).then((res) => {
        if (res.data.errorCode === 0) {
          this.dialogVisible = true
          let qrurl = res.data.address
          if (!qrurl) {
            qrurl = ''
          } else if (qrurl.startsWith('//')) {
            qrurl = window.location.protocol + qrurl
          } else if (!qrurl.startsWith('http')) {
            qrurl = 'http://' + qrurl
          }
          this.message = qrurl
        } else {
          this.$message.error(res.errorMessage)
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
    // 报名弹窗方法
    enrollDialogShow() {
      this.enrollShow = true
    },
    // 新增活动
    addActivity() {
      this.addActivityShow = true
    },
    // 编辑活动
    addActivityDialogShow(val) {
      this.editObj = val
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中',
        fullscreen: false,
        target: document.querySelector('.activityShow-container')
      })
      getActivityMsg({ id: val.id }).then(res => {
        if (res.data.errorCode === 0) {
          const params = { ...res.data }
          params.activityTime = [res.data.activitystartTime2, res.data.activityendTime2]
          params.enrollTime = [res.data.applystartTime2, res.data.applyendTime2]
          params.cancelTime = res.data.cancelTime2
          const arr = []
          const arr1 = []
          const arr2 = []
          if (res.data.actBanner && res.data.actBanner.length > 0) {
            res.data.actBanner.split(',').map((val) => {
              arr1.push({ url: val })
            })
          }
          if (res.data.shareCover && res.data.shareCover.length > 0) {
            res.data.shareCover.split(',').map((val) => {
              arr2.push({ url: val })
            })
          }
          if (res.data.activityCover && res.data.activityCover.length > 0) {
            res.data.activityCover.split(',').map((val) => {
              arr.push({ url: val })
            })
          }
          this.$refs.addActivityDialog.lessonForm = params
          this.$refs.addActivityDialog.lessonForm.name = params.name
          this.$refs.addActivityDialog.iptCont = params.actHtml
          this.$refs.addActivityDialog.lessonForm.participate = String(params.participate)
          this.$refs.addActivityDialog.lessonForm.waiting = String(params.waiting)
          this.$refs.addActivityDialog.lessonForm.sort = params.sort
          const actBanner = []
          if (params.actBanner) {
            params.actBanner.split(',').map((item, index) => {
              actBanner.push({ url: item, uid: index })
            })
          }
          this.$refs.addActivityDialog.lessonForm.actBanner = actBanner
          this.$refs.addActivityDialog.lessonForm.activityCover = arr
          this.$refs.addActivityDialog.lessonForm.shareCover = arr2
          this.$refs.addActivityDialog.Banner = arr1
          this.$refs.addActivityDialog.shareCoverArr = arr2
          this.$refs.addActivityDialog.activityCoverArr = arr
          this.$refs.addActivityDialog.lessonForm = params
        } else {
          this.$message.error(res.errorMessage)
        }
        loading.close()
      })

      this.addActivityShow = true
    }
  }
}
</script>
<style lang="scss" scoped>
.activityShow-container {
  width: calc(100%);
  padding: 0 20px;
  .activityShow-top {
    width: 100%;
    padding: 20px 0;
    border-bottom: 1px solid #eee;
    font-size: 14px;
  }
  .search {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    height: 48px;
  }
}
.erweimaBox {
  // .el-dialog__header .el-dialog__title {
  //   height: 21px;
  //   display: block;
  // }
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
        white-space: nowrap;
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
</style>
<style lang="scss">
.erweimaBox {
  .el-dialog__header .el-dialog__title {
    height: 21px;
    display: block;
  }
}
.activityShow-container {
  .borderTable {
    .el-table--fit {
      border-left: none;
    }
  }
  .el-table__row {
    height: 70px;
  }
}
</style>

