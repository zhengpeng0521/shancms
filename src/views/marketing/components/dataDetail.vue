<template>
  <transition name="slide-fade">
    <div
      v-show="isVisible"
      ref="dataDetail"
      class="side-dialog"
    >
      <!-- :class="{picDetailShow:picDetail.picDetailShowflag}" -->
      <div class="top">
        <div class="top-left">
          <img
            src="https://img.ishanshan.com/gimg/img/17f0dfd2429ae6f65391477aee5b7a25"
            alt=""
          >
          <span>数据详情</span>
        </div>
        <el-button
          plain
          @click="close"
        >关闭</el-button>
      </div>
      <div
        v-show="searchShow"
        class="search"
      >
        <CommonSearch
          :is-inline="true"
          :params="formInline"
          :forms="formInline"
          @toParent="resetFieldHanle"
        />
        <el-button
          v-if="hasBtn('203000003')"
          type="primary"
          @click="zsbexportXsml"
        >导出</el-button>
      </div>
      <div
        v-show="tableShow"
        class="main"
      >
        <CommonTable
          ref="dataDetailTableCommon"
          :columns="columns"
          :table-height="tableHeight"
          :pagination="listQuery"
          :options="options"
          :operation="operates"
          :id="dataDetailTable.id"
          table-key="marketing_microInterac_dataDetail"
        />
      </div>
    </div>
  </transition>
</template>
<script>
// import { fetchList } from '@/api/marketing'
import CommonSearch from '@/components/CommonSearch/CommonSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
import { findDetail, activityRefound } from '@/api/marketing/microAct.js'
import { exportFile } from '@/utils/exportFile.js'
// import { fetchList } from '@/api/marketing'
export default {
  components: {
    CommonSearch,
    CommonTable
  },
  props: {
    'visible': {
      type: Boolean,
      default: true
    },
    'dataDetailTable': {
      type: Object,
      default: true
    },
    'tableShow': {
      type: Boolean,
      default: true
    },
    'searchShow': {
      type: Boolean,
      default: true
    }
  },
  // props: {
  //   id: {
  //     type: String,
  //     required: true
  //   }

  // },
  data() {
    return {
      visible2: false,
      visible3: false,
      // isVisible: this.visible,
      isVisible: false,
      formInline: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'select',
            placeholder: '请选择支付状态',
            modelValue: 'payStatus',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            selectOption: [
              {
                label: '未支付',
                value: '0'
              }, {
                label: '已支付',
                value: '1'
              }, {
                label: '已退款',
                value: '2'
              }
            ]
          }, {
            itemType: 'input',
            placeholder: '请填写学员姓名',
            modelValue: 'babyName',
            isClearable: true
          }
        ]
      },
      columns: [
        {
          label: '提交时间',
          prop: 'createTime',
          width: '170px'
        }, {
          label: '学员姓名',
          prop: 'nickname',
          isShowTooltip: true
        }, {
          label: '学员生日',
          prop: 'birthday',
          width: '150px'

        }, {
          label: '手机号',
          prop: 'mobile',
          isShowSet: true,
          width: '150px'
        }, {
          label: '备注',
          prop: 'note',
          isShowSet: true,
          isShowTooltip: true
        }, {
          label: '支付金额',
          prop: 'payAmount',
          isShowSet: true,
          isShowTooltip: true
        }, {
          label: '支付状态',
          prop: 'payStatus',
          isShowSet: true,
          formatter: (row) => {
            if (row.payStatus === '0') {
              return `<span>未支付</span>`
            } else if (row.payStatus === '1') {
              return `<span>已支付</span>`
            } else if (row.payStatus === '2') {
              return `<span>已退款</span>`
            }
          }
        }],
      options: {
        isSettingShow: true,
        index: true// 是否出现设置
      },
      tableHeight: 'calc(100vh - 208px)',
      operates: {
        width: '150',
        fixed: 'right',
        list: [
          {
            label: '退款',
            type: 'singleCancel',
            prop: 'payStatus',
            popoverCon: [
              {
                contentText: '确定要退款吗？',
                status: '1'
              }
            ],
            method: (row) => {
              this.refound(row)
            }
          }
        ]
      },
      listQuery: {
        show: true // 是否显示
      },
      id: ''
    }
  },
  watch: {
    'visible'(val) {
      this.isVisible = val
      console.log(val)
    },
    'isVisible'(val) {
      this.$emit('update:visible', val)
    }
  },
  methods: {
    close() {
      this.isVisible = false
      this.visible2 = false
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      const params = {
        'id': this.dataDetailTable.id,
        'payStatus': '',
        'babyName': ''
      }

      this.options.apiService = findDetail
      this.$refs.dataDetailTableCommon.getList(params)
    },
    searchHandle(formValue) {
      this.formValue = formValue
      const params = {
        ...formValue,
        'id': this.dataDetailTable.id
      }
      this.options.apiService = findDetail
      this.$refs.dataDetailTableCommon.getList(params)
    },

    zsbexportXsml() {
      const path = '/ss-mic-provider/mic/MicroActivityService/zsbexportXsml'
      const params = {
        id: this.dataDetailTable.id
      }
      exportFile(path, params)
    },
    dataDetailShow() {
      this.isVisible = true
      if (this.dataDetailTable.id) {
        this.options.apiService = findDetail
        this.$refs.dataDetailTableCommon.getList({ id: this.dataDetailTable.id })
      }
    },

    /** 退款 */
    refound(row) {
      const params = {
        dataId: row.id
      }

      activityRefound(params).then(res => {
        if (res.data && res.data.errorCode === 0) {
          this.$message.success('退款成功')
          this.$refs.dataDetailTableCommon.getList({ id: this.dataDetailTable.id })
        } else {
          this.$message.error(res.data && res.data.errorMessage || '退款失败')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-popper {
  z-index: 10001 !important;
  p {
    font-size: 12px;
    color: #666;
  }
}
.side-dialog {
  top: 40px;
  right: 0px;
  z-index: 1000;
  width: calc(100% - 165px);
  position: fixed;
  margin-left: -20px;
  height: calc(100%);
  background-color: #ffffff;
  -moz-box-shadow: 2px 2px 5px #333333;
  -webkit-box-shadow: 2px 2px 5px #333333;
  box-shadow: 2px 2px 5px #333333;
  .top {
    width: 100%;
    justify-content: space-between;
    display: flex;
    padding: 20px;
    border: 0;
    .top-left {
      display: flex;
      align-items: center;
      margin: 0;
      img {
        margin-right: 10px;
        width: 35px;
        height: 35px;
      }
      span {
        font-size: 14px;
        color: rgb(89, 89, 89);
      }
    }
  }
  .search {
    width: 100%;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
  }
  // .main {
  // padding: 0 20px;
  // }
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

