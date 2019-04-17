<template>
  <transition name="slide-fade">
    <!-- <div> -->
    <div
      v-show="isVisible"
      class="side-zhezhao"
    >
      <div
        v-show="isVisible"
        class="side-dialog"
      >
        <div class="top">
          <div class="top-left">
            <span>活动信息</span>
          </div>
          <div class="top-right">
            <Confirm
              :text="'关闭'"
              :placement="'top'"
              :content="'确认关闭么?'"
              :confirm="close"
              :is-button="true"
              :btn-type="'plain'"
            />
            <!-- <el-popover
              v-model="visible2"
              placement="bottom-end"
              width="160"
              popper-class="tanchukuang"
            >
              <p><span>图标</span>确定要关闭窗口吗？</p>
              <div style="text-align: right; margin: 0;">
                <el-button
                  size="mini"
                  class="edit_btn"
                  plain
                  @click="visible2 = false"
                >取消</el-button>
                <el-button
                  type="primary"
                  class="edit_btn"
                  @click="close"
                >确定</el-button>
              </div>
              <el-button
                slot="reference"
                plain
              >关闭</el-button>
            </el-popover> -->
          </div>
        </div>
        <div class="body">
          <CommonSearch
            :is-inline="true"
            :params="formInline"
            :forms="formInline"
            @toParent="resetFieldHanle"
          />
          <AdvancedSearch
            v-bind="superSearch"
            style="margin-bottom: 14px"
          />
          <CommonTable
            ref="tableCommon"
            :columns="columns"
            :table-height="tableHeight"
            :pagination="listQuery"
            :options="options"
            :operation="operates"
            :is-border="isBorder"
          />

        </div>
      </div>
      <remark ref="remarkDialog" />
    </div>
    <!-- <remark ref="remarkDialog" /> -->
    <!-- </div> -->
  </transition>
</template>
<script>
import CommonSearch from '@/components/CommonSearch/CommonSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
import remark from './remark'
import Confirm from '@/components/MiniCommon/Confirm'
// import { fetchList } from '@/api/marketing'
import { getJoinerList, cancelJoin, precedenceWait } from '@/api/microWeb/activityShow'
// import { fetchList1 } from '@/api/transaction'
export default {
  components: {
    CommonSearch,
    CommonTable,
    AdvancedSearch,
    remark,
    Confirm
  },
  props: {
    'visible': {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      actObj: {},
      visible2: false,
      visible3: false,
      isVisible: this.visible,
      // 搜索参数
      formValue: {},
      superValue: {},
      formInline: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '宝宝姓名',
            modelValue: 'name',
            isClearable: true
          },
          {
            itemType: 'input',
            placeholder: '联系方式',
            modelValue: 'tel',
            isClearable: true
          },
          {
            itemType: 'datePicker',
            datePickerType: 'daterange',
            rangeSeparator: '~',
            startPlaceholder: '报名开始时间',
            endPlaceholder: '报名结束时间',
            valueFormat: 'yyyy-MM-dd',
            modelValue: 'date2'
          }
        ]
      },
      // 表格参数
      listQuery: {
        show: true // 是否显示
      },
      columns: [
        {
          label: '宝宝姓名',
          prop: 'name',
          isShowSet: true,
          isShowTooltip: true
          // width: 130,
        },
        {
          label: '宝宝生日',
          prop: 'birthday',
          isShowTooltip: true,
          isShowSet: true,
          width: 180
        },
        {
          label: '宝宝性别',
          prop: 'sex',
          isShowTooltip: true,
          isShowSet: true,
          formatter: (row) => {
            if (row.sex === '1') {
              return `<div>男</div>`
            } else {
              return `<div>女</div>`
            }
          }
        },
        {
          label: '联系方式',
          prop: 'mobile',
          isShowTooltip: true,
          isShowSet: true,
          width: 130
        },
        {
          label: '家长关系',
          prop: 'relation',
          isShowTooltip: true,
          isShowSet: true,
          formatter: (row) => {
            if (row.relation === 'mother') {
              return '<div>妈妈</div>'
            } else if (row.relation === 'father') {
              return `<div>爸爸</div>`
            } else if (row.relation === 'grandmother') {
              return `<div>奶奶</div>`
            } else if (row.relation === 'grandfather') {
              return `<div>爷爷</div>`
            } else if (row.relation === 'motherfather') {
              return `<div>外公</div>`
            } else if (row.relation === 'mothermother') {
              return `<div>外婆</div>`
            } else {
              return `<div>二大爷</div>`
            }
          }
        },
        {
          label: '是否会员',
          prop: 'vip',
          isShowSet: true,
          isShowTooltip: true,
          formatter: (row) => {
            if (row.vip === 'true') {
              return `<div>是</div>`
            } else {
              return `<div>否</div>`
            }
          }
        },
        {
          label: '报名时间',
          prop: 'createTime',
          isShowSet: true,
          isShowTooltip: true,
          width: 170
        },
        {
          label: '支付金额',
          prop: 'payAmount',
          isShowSet: true,
          isShowTooltip: true,
          align: 'right',
          formatter: (row) => {
            if (row.payAmount === '0' || row.payAmount === '0.00') {
              return `<div style="display:flex">-</div>`
            } else {
              return `<div style="display:flex">${row.payAmount}</div>`
            }
          }
        },
        {
          label: '支付状态',
          prop: 'payStatus',
          isShowSet: true,
          formatter: (row) => {
            if (row.payStatus === '0') {
              return `<div>未支付</div>`
            } else if (row.payStatus === '1') {
              return `<div>已支付</div>`
            } else if (row.payStatus === '2') {
              return `<div>已退款</div>`
            }
          }
        },
        {
          label: '报名状态',
          prop: 'status',
          width: '200px',
          isShowSet: true,
          isShowTooltip: true,
          formatter: (row) => {
            if (row.status === '2') {
              return `<div>报名成功</div>`
            } else if (row.status === '0' && row.reason !== null) {
              return `<div style="width:190px">
                        <div>已取消</div>
                        <div style="color: rgb(200, 13, 13);width:170px; overflow:hidden;text-overflow:ellipsis;white-space:nowrap">取消原因：${row.reason}</div></div>`
            } else if (row.status === '0' && row.reason === null) {
              return `<div>已取消</div>`
            } else if (row.status === '1') {
              return `<div>等位中</div>`
            } else if (row.status === '3') {
              return `<div>已提交</div>`
            } else {
              return `<div>支付超时</div>`
            }
          }
        },
        {
          label: '备注信息',
          prop: 'remark',
          isShowSet: true,
          // isShowTooltip: true,
          width: 130,
          render: (h, params) => {
            if (params.row.remark) {
              return h('div', {}, [
                h('div', { style: { overflow: 'hidden', 'text-overflow': 'ellipsis', color: 'rgba(24,145,237,1)',
                  'white-space': 'normal', display: '-webkit-box', '-webkit-line-clamp': '1', width: '120px',
                  'line-height': '15px', 'font-size': '14px', '-webkit-box-orient': 'vertical'
                }, on: { click: () => {
                  this.remarkShow(params.row)
                // console.log(this.$refs.remarkDialog.changeRemarkVal, params.row.info, '1111111111')
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
              return h('div', {}, [
                h('div', { style: { overflow: 'hidden', 'text-overflow': 'ellipsis', color: 'rgba(24,145,237,1)',
                  'white-space': 'normal', display: '-webkit-box', '-webkit-line-clamp': '1', width: '120px',
                  'line-height': '15px', 'font-size': '14px', '-webkit-box-orient': 'vertical'
                }, on: { click: () => {
                  this.remarkShow(params.row)
                // console.log(this.$refs.remarkDialog.changeRemarkVal, params.row.info, '1111111111')
                } }
                }, [h('el-tooltip', {
                  props: { placement: 'top', width: '200', content: '暂无', effect: 'dark' }
                }, [
                  h('span',
                    { },
                    '暂无')
                ])])
              ])
            }
          }
        }

      ],
      options: {
        isSettingShow: false, // 是否出现设置
        apiService: getJoinerList, // 表格的数据请求接口
        params: { activityId: this.$parent.activityObj.id }
      },
      operates: {
        fixed: 'right',
        width: 130,
        list: [
          {
            label: '取消报名',
            type: 'mulChoose',
            method: (row) => {
              // console.log(row, this.$parent.activityObj)
              const params = {
                id: row.id,
                // status: '0',
                activityId: this.$parent.activityObj.id,
                tenantId: this.$parent.activityObj.tenantId
              }
              cancelJoin(params).then(res => {
                if (res.data.errorCode === 0) {
                  this.resetFieldHanle(res)
                  this.$message.success('取消报名成功')
                } else {
                  this.$message.error(res.error)
                }
              })
            },
            prop: 'status',
            popoverCon: [
              {
                contentText: '确认要取消报名吗？',
                status: '1'
              },
              {
                contentText: '确认要取消报名吗？',
                status: '2'
              }
            ]
          },
          {
            label: '优先等位',
            type: 'mulChoose',
            method: (row) => {
              console.log(row, this.$parent.activityObj)
              const params = {
                id: row.id,
                activityId: this.$parent.activityObj.id,
                tenantId: this.$parent.activityObj.tenantId
              }
              precedenceWait(params).then(res => {
                if (res.data.errorCode === 0) {
                  this.$parent.resetFieldHanle(res)
                  this.$message.success('优先等位成功')
                } else {
                  this.$message.error(res.errorMessage)
                }
              })
            },
            prop: 'status',
            popoverCon: [
              {
                contentText: '确认要优先等位么?',
                status: '1'
              }
            ]
          }
        ]
      },
      tableHeight: 'calc(100vh - 176px)',
      isBorder: true,
      // 高级搜索参数
      superSearch: {
        onClear: (superValue) => { this.onClear(superValue) },
        onSearch: (superValue) => { this.onSearch(superValue) },
        fields: [
          {
            type: 'select',
            key: 'relation',
            label: '家长关系',
            options: [
              { value: '', label: '全部' },
              { value: 'father', label: '爸爸' },
              { value: 'mother', label: '妈妈' },
              { value: 'grandmother', label: '奶奶' },
              { value: 'grandfather', label: '爷爷' },
              { value: '1539585384641', label: '二大爷' },
              { value: 'mothermother', label: '外婆' },
              { value: 'motherfather', label: '外公' }
            ]
          },
          {
            type: 'select',
            key: 'sex',
            label: '宝宝性别',
            options: [
              { value: '', label: '全部' },
              { value: '2', label: '女' },
              { value: '1', label: '男' }
            ]
          },
          // {
          //   type: 'select',
          //   key: 'memeber',
          //   label: '是否会员',
          //   options: [
          //     { value: '0', label: '全部' },
          //     { value: '1', label: '是' },
          //     { value: '2', label: '否' }
          //   ]
          // },
          {
            type: 'select',
            key: 'payStatus',
            label: '支付状态',
            options: [
              { value: '', label: '全部' },
              { value: '0', label: '未支付' },
              { value: '1', label: '已支付' },
              { value: '2', label: '已退款' }
            ]
          },
          {
            type: 'select',
            key: 'status',
            label: '报名状态',
            options: [
              { value: '', label: '全部' },
              { value: '2', label: '报名成功' },
              { value: '1', label: '等位中' },
              { value: '0', label: '已取消' }
            ]
          }
        ]
      },
      // 备注弹框参数
      remarkDialogShow: false

    }
  },
  watch: {
    'visible'(val) {
      this.isVisible = val
      // console.log(val)
    },
    'isVisible'(val) {
      this.$emit('update:visible', val)
    }
  },
  // mounted() {
  //   this.actObj = this.$parent.activityObj
  // },
  methods: {
    close() {
      this.isVisible = false
      this.visible2 = false
      this.visible3 = false
      // console.log('1111')
    },
    /* 搜索 */
    searchHandle(formValue) {
      console.log(formValue, '1111111')
      if (formValue.date2 && formValue.date2.length > 0) {
        formValue.startDate = formValue.date2[0]
        formValue.endDate = formValue.date2[1]
      }
      delete formValue.date2
      this.formValue = formValue
      const params = {
        activityId: this.$parent.activityObj.id,
        ...this.formValue,
        ...this.superValue
        // name: this.formInline.id,
        // tel: this.formInline.tel,
        // startDate: startDate,
        // endDate: endDate
      }
      this.$refs.tableCommon.getList(params)
    },

    /* 搜索重置 */
    resetFieldHanle(formValue) {
      // 重置的入参
      const params = {
        activityId: this.$parent.activityObj.id
      }
      this.$refs.tableCommon.getList(params)
      this.formValue = {}
    },
    /** 高级搜索 */
    onSearch(superValue) {
      this.superValue = superValue
      const params = {
        activityId: this.$parent.activityObj.id,
        ...this.superValue,
        ...this.formValue
        // relation: superValue.parentRelation,
        // sex: superValue.sex,
        // // vip: superValue.memeber,
        // payStatus: superValue.paymentStatus,
        // status: superValue.enrollStatus,
        // name: this.formInline.id,
        // tel: this.formInline.tel,
        // startDate: startDate,
        // endDate: endDate
      }
      this.$refs.tableCommon.getList(params)
    },
    onClear(superValue) {
      const params = {
        activityId: this.$parent.activityObj.id,
        ...this.formValue
        // relation: '',
        // sex: '',
        // // vip: '',
        // payStatus: '',
        // status: '',
        // name: this.formInline.id,
        // tel: this.formInline.tel,
        // startDate: startDate,
        // endDate: endDate
      }
      this.$refs.tableCommon.getList(params)
      this.superValue = {}
    },
    // 表格方法
    deleteHandle(row) {
      console.log('删除', row, this)
    },
    // 修改备注信息弹框
    remarkShow(row) {
      console.log(row, 'row')
      this.actObj = { id: row.id, activityId: this.$parent.activityObj.id }
      this.$refs.remarkDialog.changeRemarkVal = row.remark
      this.$refs.remarkDialog.remarkDialogShow = true
    }

  }
}
</script>
<style lang="scss" scoped>
.side-zhezhao {
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0px;
  right: 0px;
  z-index: 2000;
  // z-index: 10000;
}

.side-dialog {
  top: 0px;
  right: 0px;
  z-index: 1000;
  width: calc(100% - 150px);
  position: fixed;
  // margin-left: -20px;
  height: 100%;
  background-color: rgba(255, 255, 255, 1);
  -moz-box-shadow: 2px 2px 5px #333333;
  -webkit-box-shadow: 2px 2px 5px #333333;
  box-shadow: 2px 2px 5px #333333;
  padding: 0 20px;
  .top {
    // width: calc(100vw - 180px) !important;
    min-height: 40px;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;
    display: flex;
    justify-content: space-between;
    padding: 10px 0 10px 0;
    .top-left {
      display: flex;
      font-size: 16px;
      // margin-top: 10px;
    }
    .top-right {
      display: flex;
      .el-button {
        margin-left: 10px;
        // margin-bottom: 10px;
      }
    }
  }
  .body {
    padding-top: 20px;
    height: calc(100vh - 70px);
    overflow: auto;
    .cont {
      margin-top: 20px;
      overflow: auto;
    }
  }
}

.slide-fade-enter-active {
  transition: all 0.5s ease;
}
.slide-fade-leave-active {
  transition: all 0.5s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(1000px);
  opacity: 0;
}
</style>
// <style lang="scss">
// .el-select-dropdown {
//   z-index: 10005 !important;
// }
// .el-date-range-picker {
//   z-index: 10005 !important;
// }
// .el-tooltip__popper {
//   z-index: 10005 !important;
// }
// .tanchukuang {
//   z-index: 20000 !important;

//   p {
//     font-size: 12px;
//     color: #666;
//   }
//   .sortTip {
//     z-index: 200001 !important;
//   }
// }
//
</style>

