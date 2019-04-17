<template>
  <div class="callRecords_container">
    <!-- 搜索栏 -->
    <div class="search">
      <div>
        <CommonSearch
          :is-inline="true"
          :params="formInline"
          :forms="formInline"
          @toParent="resetFieldHanle"
        />
      </div>
      <div style="line-height: 34px;">
        <span class="search_right_text">剩余可分配通讯币: 9342.0</span>
      </div>
    </div>
    <!-- 已选数据操作 -->
    <div class="checked_data">
      <span class="checked_text">已选<i>{{ checkedData || '0' }}</i>条数据</span>
      <el-button
        type="text"
        size="mini"
        @click="giveCurrencyDialog()"
      >分配通讯币</el-button>
      <el-button
        type="text"
        size="mini"
        @click="backCurrencyDialog()"
      >回收通讯币</el-button>
    </div>
    <!-- 表格 -->
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      @handleSelectionChange="selectionChange"
    />
    <!-- 分配通讯币弹框 -->
    <GiveCurrencyDialog ref="giveCurrencyDialog" />
    <!-- 回收通讯币弹框 -->
    <BackCurrencyDialog ref="backCurrencyDialog" />
    <!-- 是否开通呼叫中心弹框 -->
    <div class="isOpenCallDialog_style">
      <el-dialog
        :visible.sync="isOpenCallDialogShow"
        title="未开通"
        @close="submitFormClose()"
      >
        <el-form
          ref="mgrAccessoryForm"
          style="margin-bottom: 20px;"
        >
          当前机构暂未开通呼叫系统~，请联系闪闪客服进行开通~
        </el-form>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            type="primary"
            @click="submitFormClose()"
          >我知道了</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getCenterSeatList, // 坐席列表
  getManageDuration, // 剩余可分配时长
  getIsOpen // 是否开通呼叫中心
} from '@/api/addServices/addServices.js'
import CommonTable from './../../../components/CommonTable/CommonTable'
import CommonSearch from './../../../components/CommonSearch/CommonSearch'
import GiveCurrencyDialog from './components/giveCurrencyDialog.vue'
import BackCurrencyDialog from './components/backCurrencyDialog.vue'
export default {
  components: {
    CommonTable,
    CommonSearch,
    GiveCurrencyDialog, // 分配通讯币弹框
    BackCurrencyDialog // 回收通讯币弹框
  },
  data() {
    return {
      isOpenCallDialogShow: false,
      listQuery: {
        show: true // 是否显示
      },
      columns: [
        {
          label: '员工编号',
          prop: 'userId',
          isShowTooltip: true
        },
        {
          label: '姓名',
          prop: 'userName',
          isShowTooltip: true
        },
        {
          label: '手机号',
          prop: 'mobile',
          isShowTooltip: true
        },
        {
          label: '角色',
          prop: 'userRole',
          isShowTooltip: true
        },
        {
          label: '剩余可用通讯币',
          prop: 'title',
          isShowTooltip: true,
          width: '130px'
        },
        {
          label: '到期时间',
          prop: 'endTime',
          isShowTooltip: true
        },
        {
          label: '坐席状态',
          prop: 'status',
          isShowTooltip: true
        },
        {
          label: '服务开通情况',
          prop: 'groupName',
          isShowTooltip: true,
          width: '120'
        },
        {
          label: '呼叫软件账号',
          prop: 'accCallOut',
          isShowTooltip: true,
          width: '145'
        }
      ],
      options: {
        mutiSelect: true, // 是否多选
        isSettingShow: true // 是否出现设置
      },
      tableHeight: 'calc(100vh - 260px)',
      formInline: {
        searchMethod: () => {
          this.searchHandle('formInline')
        },
        forms: [
          {
            itemType: 'select',
            placeholder: '姓名',
            modelValue: 'region',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            selectOption: [
              {
                label: '已开通',
                value: '1'
              }, {
                label: '已停用',
                value: '0'
              }
            ]
          }, {
            itemType: 'input',
            placeholder: '角色',
            modelValue: 'region',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px'
          }, {
            itemType: 'select',
            placeholder: '开通状态',
            modelValue: 'region',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            selectOption: [
              {
                label: '已开通',
                value: '1'
              }, {
                label: '已停用',
                value: '0'
              }
            ]
          }
        ]
      },
      checkedData: ''
    }
  },
  created() {
    this.getIsOpenFun()
  },
  methods: {
    /* 是否开通呼叫系统 */
    getIsOpenFun() {
      const params = {
        status: '1'
      }
      getIsOpen(params).then(res => {
        if (res.data.errorCode === 0) {
          console.log('res-开通-->', res)
          // eslint-disable-next-line
          if(res.data.isOpen == '0') {
            this.isOpenCallDialogShow = true
          } else {
            this.isOpenCallDialogShow = false
            this.$refs.tableCommon.options.apiService = getCenterSeatList // 表格的数据请求接口
            this.$refs.tableCommon.getList({ pageIndex: 0 })
            this.getManageDurationFun()
          }
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 关闭未开通弹框 */
    submitFormClose() {
      this.isOpenCallDialogShow = false
    },
    /* 剩余可分配时长数据 */
    getManageDurationFun() {
      getManageDuration().then(res => {
        if (res.data.errorCode === 0) {
          console.log('res 外呼 可分配时长--->', res)
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 分配通讯币弹框 */
    giveCurrencyDialog() {
      const checkLength = this.checkedData
      if (checkLength > 0) {
        this.$refs.giveCurrencyDialog.showDialog()
      }
    },
    /* 回收通讯币弹框 */
    backCurrencyDialog() {
      const checkLength = this.checkedData
      if (checkLength > 0) {
        this.$refs.backCurrencyDialog.showDialog()
      }
    },
    /* 选择数据条数操作 */
    selectionChange(val) {
      console.info('val--->', val.length)
      this.checkedData = val.length
    },
    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      const params = {
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      const params = {
        pageIndex: 1
      }
      this.$refs.tableCommon.getList(params)
    },
    /** 高级搜索 */
    onSearch(superValue) {
      console.log('onSearch', superValue)
    },
    /** 高级清除 */
    onClear() {
      console.log('onClear')
    }
  }
}
</script>

<style lang="scss" scoped>
.callRecords_container /deep/ {
  .isOpenCallDialog_style {
    .el-dialog {
      width: 450px;
    }
  }
  .search {
    display: flex;
    justify-content: space-between;
    .search_right_text {
      padding: 5px 16px;
      border-radius: 6px;
      color: #666;
      font-size: 12px;
      line-height: 16px;
      border: 1px solid #d5f1fd;
      background-color: #eaf8fe;
    }
  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 5px;
  }
  .checked_data {
    margin-bottom: 8px;
    .checked_text {
      margin-right: 10px;
    }
    i {
      font-style: normal;
      color: #46b6ee;
      padding: 0 5px;
    }
  }
}
</style>

