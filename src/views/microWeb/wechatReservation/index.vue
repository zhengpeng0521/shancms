<template>
  <div class="wechatReservation-container">
    <div class="wechatReservation-top">预约管理</div>
    <div class="search">
      <div class="search-left">
        <CommonSearch
          :is-inline="true"
          :params="formInline"
          :forms="formInline"
          @toParent="resetFieldHanle"
        />
        <AdvancedSearch
          v-bind="superSearch"
          style="margin-left:10px"
        />
      </div>
      <div class="search-right">
        <el-button
          v-if="hasBtn('301000001')"
          type="primary"
          @click="reservationSettingDialogShow()"
        >预约设置</el-button>
        <template>
          <el-popover
            v-if="message!=''"
            placement="bottom-start"
            title="手机扫码访问在线预约"
            width="240"
            trigger="hover"
            popper-class="hoverDialog"
          >
            <div style="margin:20px 30px">
              <qrcode
                id="qrCode"
                ref="qr"
                :options="{ width: 180,height:180,padding:0,margin:0 }"
                :value="message"
                class="erweima"
              />
            </div>
            <div class="erweima-footer">
              <!-- <div class="ipt">
                <span ref="url">{{ message }}</span>
              </div> -->
              <el-button
                v-clipboard:copy="message"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
                type="plain"
              >复制地址</el-button>
              <el-button
                type="plain"
                @click="downLoad"
              >下载二维码</el-button>
            </div>
            <el-button
              slot="reference"
              plain
              style="margin:0 10px"
            >预约链接</el-button>
          </el-popover>
        </template>
        <el-button
          v-if="hasBtn('301000002')"
          plain
          @click="loadDown"
        >导出</el-button>
      </div>
    </div>
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      :operation="operation"
      table-key="microWeb_wechatReservation_index"
      class="borderTable"
    />
    <reservationSetting ref="reservationSettingDialog" />
    <remark ref="remarkDialog" />
  </div>
</template>
<script>
import CommonSearch from '@/components/CommonSearch/CommonSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
import { queryList, queryConfig, batchDeal } from '@/api/microWeb/wechatReservation'
// import { fetchList1 } from '@/api/transaction'
import { exportFile } from '@/utils/exportFile.js'
import reservationSetting from './components/reservationSetting'
import remark from './components/remark'
// 二维码装换插件
import Vue from 'vue'
import VueQrcode from '@chenfengyuan/vue-qrcode'
Vue.component(VueQrcode.name, VueQrcode)
// 复制插件
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
export default {
  components: {
    CommonSearch,
    CommonTable,
    AdvancedSearch,
    reservationSetting,
    remark
    // detail,
    // creatMarketActivity,
    // erweimaDialog
  },
  data() {
    return {
      message: '',
      remarkObj: {},
      superObj: {},
      formValue: {},
      reservationSettingShow: false,
      // 搜索参数
      formInline: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '宝宝姓名',
            modelValue: 'childName',
            isClearable: true,
            itemStyle: 'width: 140px'
          },
          {
            itemType: 'input',
            placeholder: '电话',
            modelValue: 'tel',
            isClearable: true,
            itemStyle: 'width: 140px'
          },
          {
            itemType: 'select',
            placeholder: '状态',
            modelValue: 'status',
            isClearable: true,
            itemStyle: 'width: 140px',
            selectOption: [
              {
                label: '全部状态',
                value: ''
              },
              {
                label: '未处理',
                value: '0'
              }, {
                label: '已处理',
                value: '1'
              }
            ]
          }
        ]
      },
      // 高级搜索参数
      superSearch: {
        onClear: (superValue) => { this.onClear(superValue) },
        onSearch: (superValue) => { this.onSearch(superValue) },
        fields: [
          {
            type: 'datePicker',
            key: 'enlistTime',
            dateType: 'daterange',
            label: '报名时间'
          },
          {
            type: 'datePicker',
            key: 'appoinment',
            dateType: 'daterange',
            label: '预约时间'
          }
        ]
      },
      // 表格参数
      listQuery: {
        show: true // 是否显示
      },
      columns: [
        {
          label: '编号',
          prop: 'id',
          isShowSet: true,
          isShowTooltip: true,
          isColShow: false
        },
        {
          label: '宝宝姓名',
          prop: 'childName',
          isShowSet: true,
          isShowTooltip: true
        },

        {
          label: '性别',
          prop: 'sex',
          isShowTooltip: true,
          isShowSet: true,
          width: 65,
          formatter: (row) => {
            if (row.sex === '1') {
              return `<div>男</div>`
            } else {
              return `<div>女</div>`
            }
          }
        },
        {
          label: '电话',
          prop: 'tel',
          isShowTooltip: true,
          isShowSet: true,
          width: 130
        },
        {
          label: '生日',
          prop: 'childBirthday',
          isShowTooltip: true,
          isShowSet: true,
          width: 120
        },
        {
          label: '详细地址',
          prop: 'addr',
          isShowSet: true,
          isShowTooltip: true,
          isColShow: false
        },
        {
          label: '预约课程',
          prop: 'courseName',
          isShowTooltip: true,
          isShowSet: true,
          formatter: (row) => {
            if (row.courseName === '' || row.courseName === null) {
              return `<div">-</div>`
            } else {
              return `<div style="text-overflow:ellipsis;overflow:hidden">${row.courseName}</div>`
            }
          }
        },
        {
          label: '预约礼物',
          prop: 'giftContent',
          isShowSet: true,
          isShowTooltip: true,
          formatter: (row) => {
            if (row.giftContent === '') {
              return `<div">-</div>`
            } else {
              return `<div>${row.giftContent}</div>`
            }
          }
        },
        {
          label: '预约时间',
          prop: 'appointmentTime',
          width: '120',
          isShowSet: true,
          isShowTooltip: true
        },
        {
          label: '报名时间',
          prop: 'formatCreateTime',
          isShowSet: true,
          width: '120',
          isShowTooltip: true,
          formatter: (row) => {
            const str = row.formatCreateTime ? row.formatCreateTime.substring(0, 10) : ''
            const str1 = row.formatCreateTime ? row.formatCreateTime.substring(11, 19) : ''
            return `<div style="text-overflow:ellipsis;overflow:hidden">${str} ${str1}</div>`
          }
        },
        {
          label: '处理状态',
          prop: 'status',
          isShowSet: true,
          isShowTooltip: true,
          formatter: (row) => {
            if (row.status && row.status === '1') {
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(135, 208, 104);border-radius: 50px;margin-right: 5px;"></span>
                        ${'已处理'}
                      </div>`
            } else {
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(208, 2, 27);border-radius: 50px;margin-right: 5px;"></span>
                        ${'未处理'}
                      </div>`
            }
          }
        },
        {
          label: '备注信息',
          prop: 'remarkContent',
          isShowSet: true,
          // isShowTooltip: true,
          width: 130,
          render: (h, params) => {
            if (params.row.remark) {
              const color = this.hasBtn('301000003') ? 'rgba(24,145,237,1)' : '#666'
              return h('div', {}, [
                h('div', { style: { overflow: 'hidden', 'text-overflow': 'ellipsis', color,
                  'white-space': 'normal', display: '-webkit-box', '-webkit-line-clamp': '2', width: '120px',
                  'line-height': '15px', 'font-size': '14px', '-webkit-box-orient': 'vertical'
                }, on: { click: () => {
                  this.hasBtn('301000003') ? this.remarkShow(params.row) : null
                } }
                }, [h('el-tooltip', {
                  props: { placement: 'top', width: '200', content: params.row.remark, effect: 'dark' }
                }, [
                  h('span',
                    { },
                    params.row.remark)
                ])])
              ])
            } else {
              if (this.hasBtn('301000003')) {
                return h('div', {}, [
                  h('div', { style: { overflow: 'hidden', 'text-overflow': 'ellipsis', color: 'rgba(24,145,237,1)',
                    'white-space': 'normal', display: '-webkit-box', '-webkit-line-clamp': '2', width: '120px',
                    'line-height': '15px', 'font-size': '14px', '-webkit-box-orient': 'vertical'
                  }, on: { click: () => {
                    this.remarkShow(params.row)
                  } }
                  }, [h('el-tooltip', {
                    props: { placement: 'top', width: '200', content: '修改备注信息', effect: 'dark' }
                  }, [
                    h('span',
                      { },
                      '修改备注信息')
                  ])])
                ])
              } else {
                return h('div', {}, '')
              }
            }
          }
        },
        {
          label: '类型',
          prop: 'method',
          isShowSet: true,
          isShowTooltip: true,
          isColShow: false,
          formatter: (row) => {
            if (row.type === '1') {
              return `<div>机构</div>`
            } else if (row.type === '2') {
              return `<div>课程</div>`
            } else if (row.type === '3') {
              return `<div>活动</div>`
            }
          }
        }
      ],
      options: {
        isSettingShow: true, // 是否出现设置
        apiService: queryList // 表格的数据请求接口
      },
      tableHeight: 'calc(100vh - 233px)',
      operation: {
        width: '150',
        fixed: 'right',
        list: [
          {
            label: '处理',
            type: 'singleCancel',
            method: (row) => {
              this.dealRecord(row)
            },
            prop: 'status',
            popoverCon: [
              {
                contentText: '确认处理该记录吗？',
                status: '0'
              }
            ]
          }
        ]
      },
      isBorder: true
    }
  },
  mounted() {
    const loading = this.$loading({
      lock: true,
      text: '拼命加载中',
      // spinner: 'el-icon-loading',
      fullscreen: false,
      // background: 'rgba(0, 0, 0, 0.7)',
      target: document.querySelector('.wechatReservation-container')
    })
    queryConfig().then(res => {
      if (res.data.errorCode === 0) {
        // console.log(res.data, '---------')
        loading.close()
        let qrurl = res.data.results.orgAudition
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
    })
  },
  methods: {
    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      this.formValue = formValue
      const params = {
        ...this.formValue,
        ...this.superObj
        // childName: this.formInline.childrenName,
        // tel: this.formInline.tel
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle() {
      // 重置的入参
      const params = {
        childName: '',
        tel: ''
      }
      this.$refs.tableCommon.getList(params)
      this.formValue = {}
    },
    // 高级搜索
    onSearch(superValue) {
      const newObj = superValue
      newObj.appointStartDate = ''
      newObj.appointEndDate = ''
      newObj.enrollStartDate = ''
      newObj.enrollEndDate = ''
      newObj.childBirthday1 = ''
      newObj.childBirthday2 = ''
      if (superValue.appoinment && superValue.appoinment.length > 0) {
        newObj.appointStartDate = superValue.appoinment[0]
        newObj.appointEndDate = superValue.appoinment[1]
        delete newObj.appoinment
      }
      if (superValue.enlistTime && superValue.enlistTime.length > 0) {
        newObj.enrollStartDate = superValue.enlistTime[0]
        newObj.enrollEndDate = superValue.enlistTime[1]
        delete newObj.enlistTime
      }
      if (superValue.rangeDate && superValue.rangeDate.length > 0) {
        newObj.childBirthday1 = superValue.rangeDate[0]
        newObj.childBirthday2 = superValue.rangeDate[1]
        delete newObj.rangeDate
      }
      const params = {
        ...newObj,
        ...this.formValue
        // childName: this.formValue.childrenName,
        // tel: this.formValue.tel
      }
      this.superObj = params
      this.$refs.tableCommon.getList(params)
    },
    onClear() {
      const params = {
        // childName: this.formValue.childrenName,
        // tel: this.formValue.tel
        ...this.formValue
      }
      this.superObj = params
      this.$refs.tableCommon.getList(params)
    },
    // 导出
    loadDown() {
      const path = '/ss-mic-provider/mic/reservation/excelList'
      const params = {
        ...this.superObj,
        ...this.formValue
      }
      exportFile(path, params)
    },
    // 二维码下载
    downLoad() {
      var oQrcode = document.querySelector('#qrCode')
      var imgSrc = oQrcode.toDataURL('image/png')
      var a = document.createElement('a')
      var event = new MouseEvent('click')
      // 下载图名字
      a.download = '二维码文件'
      // url
      a.href = imgSrc
      // 合成函数，执行下载
      a.dispatchEvent(event)
    },
    // 设置
    reservationSettingDialogShow() {
      this.reservationSettingShow = true
      this.$refs.reservationSettingDialog.reservationSettingDialogShow = true
      console.log(this.$refs, '11111111')
    },
    //  二维码弹框方法
    onCopy: function(e) {
      this.$message({
        message: '复制成功',
        type: 'success'
      })
    },
    onError: function(e) {
      this.$message.error('复制失败')
    },
    // 处理预约记录
    dealRecord(row) {
      const params = {
        ids: row.id
      }
      batchDeal(params).then(ret => {
        if (ret.data.errorCode === 0) {
          this.searchHandle(this.formValue)
          this.$message.success(ret.errorMessage)
        } else {
          this.$message.error(ret.errorMessage)
        }
      })
    },
    // 修改备注信息弹框
    remarkShow(val) {
      this.remarkObj = val
      this.$refs.remarkDialog.changeRemarkVal = val.remark
      this.$refs.remarkDialog.remarkDialogShow = true
    }
  }
}
</script>
<style lang="scss" scoped>
.wechatReservation-container {
  width: calc(100%);
  padding: 0 20px;
  min-width: 1060px;
  // border: 1px solid #f00;
  .wechatReservation-top {
    width: 100%;
    padding-top: 20px;
    padding-bottom: 14px;
    border-bottom: 1px solid #ddd;
    font-size: 16px;
    // background: pink;
  }
  .search {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    height: 48px;
  }
}
</style>
<style lang="scss">
.wechatReservation-container {
  .borderTable {
    .el-table--fit {
      border-left: none;
    }
  }
}
.hoverDialog {
  padding: 0;
  .erweima-footer {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
  }
}
.hoverDialog .el-popover__title {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 0;
}
</style>

