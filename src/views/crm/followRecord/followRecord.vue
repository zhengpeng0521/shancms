<template>
  <div class="followRecord_container app-container">
    <div class="page_title_text">
      跟进记录
    </div>
    <!-- 搜索栏 -->
    <div class="search">
      <div>
        <div class="subUserSelect">
          <SubUserSelect
            :options="userBranchOptions"
            v-model="userBranchSelected"
            width="120"
          />
        </div>
        <CommonSearch
          ref="search"
          :is-inline="true"
          :params="formInline"
          :forms="formInline"
          @toParent="resetFieldHanle"
        />
        <advanced-search
          ref="advanced"
          v-bind="superSearch"
        />
      </div>
      <div>
        <div class="radio">
          <el-radio-group v-model="source">
            <el-radio-button label="2">潜在学员</el-radio-button>
            <el-radio-button label="1">在读学员</el-radio-button>
          </el-radio-group>
        </div>
        <el-button
          class="cancel_btn"
          size="mini"
          style="float:right"
          @click="exportContent"
        >导出</el-button>
        <el-button
          style="float:right;margin:0 10px"
          type="primary"
          size="mini"
          @click="addFollowDialog()"
        >新建跟进记录</el-button>
      </div>
    </div>
    <!-- 日期搜索 -->
    <!-- <CommonDateSearch
      ref="commonDatePicker"
      :common-date-options="commonDateOptions"
      @datePickerChange="commonDatePickerChange"
    /> -->
    <!-- 跟进记录主要页面 -->
    <div class="follow_content">
      <FollowRecordCon
        ref="tableCommon"
        :source="source"
      />
    </div>
    <!-- 新增跟进记录弹框 -->
    <AddFollowDialog
      ref="addFollowDialog"
      :source="source"
      @toUpdateTable="getUpdateTable"
    />
  </div>
</template>

<script>
import CommonSearch from './../../../components/CommonSearch/CommonSearch'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
import CommonDateSearch from '../../../components/CommonDateSearch/CommonDateSearch'
import FollowRecordCon from './components/followRecordCon.vue'
import AddFollowDialog from './components/addFollowDialog.vue'
import { dictGetByKey, querySubName } from '@/api/crm/followRecord/followRecord'
import SubUserSelect from './../../../components/SubUserSelect/SubUserSelect.vue'
import { exportFile } from '@/utils/exportFile'
export default {
  components: {
    CommonSearch,
    AdvancedSearch,
    CommonDateSearch,
    FollowRecordCon, // 跟进记录内容
    AddFollowDialog, // 新增跟进记录弹框
    SubUserSelect // 用户下拉树
  },
  data() {
    return {
      // commonDateOptions: {
      //   mainText: '跟进时间:',
      //   defaultDate: [],
      //   options: ['today', 'tomorrow', 'thisWeek', 'nextWeek'],
      //   markText: {},
      //   pickerDateArr: []
      // },
      formInline: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '学员姓名/电话号码',
            modelValue: 'name',
            isFilterable: true,
            isClearable: true
          }, {
            itemType: 'select',
            placeholder: '跟进方式',
            modelValue: 'type',
            isClearable: true,
            itemStyle: 'width:140px',
            valueKey: 'key',
            labelKey: 'value',
            apiService: dictGetByKey,
            params: {
              dictkey: 'studentFollowWay'
            }
          }
        ]
      },
      superSearch: {
        onClear: () => { this.onClear() },
        onSearch: (superValue) => { this.onSearch(superValue) },
        fields: [
          {
            type: 'select',
            key: 'uidName',
            label: '跟进人',
            optionValue: 'name',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`
          },
          {
            type: 'datePicker',
            key: 'followTime',
            label: '跟进时间',
            dateType: 'daterange'
          }
        ]
      },
      source: '2', // 潜在/在读
      superValue: {},
      formValue: {},
      userBranchOptions: [],
      userBranchSelected: '0',
      operatorType: 0, // 操作类型, 0.全部,1.我的, 2.我的下属
      operatorUser: '' // 查询用户
    }
  },
  watch: {
    source(val) {
      this.$refs.search.formValue.name = ''
      this.$refs.search.formValue.type = ''
      this.$refs.advanced.ruleForm.uidName = ''
      this.$refs.tableCommon.getList({ source: val })
    }
  },
  mounted() {
    this.querySubUser()
  },
  methods: {
    /* 公用日期选择改变事件 */
    // commonDatePickerChange(arr) {
    //   const params = {
    //     ...this.formValue,
    //     ...this.superValue
    //   }
    //   this.commonDateOptions.pickerDateArr = arr
    //   if (this.commonDateOptions.pickerDateArr && this.commonDateOptions.pickerDateArr.length > 0) {
    //     params.startTime = this.commonDateOptions.pickerDateArr[0]
    //     params.endTime = this.commonDateOptions.pickerDateArr[1]
    //   }
    //   for (const i in params) {
    //     if (!params[i]) {
    //       delete params[i]
    //     }
    //   }
    //   this.$refs.tableCommon.getList(params)
    // },
    /** 公用日期选择重置事件 */
    // commonDateReset() {
    //   this.$refs.commonDatePicker.commonDateReset()
    // },
    /* 新增跟进记录弹框 */
    addFollowDialog() {
      this.$refs.addFollowDialog.showDialog('add')
    },
    /* 搜索 */
    searchHandle(formValue) {
      // 用户权限选择
      const userBranchParams = {}
      if (this.userBranchSelected === '0' || this.userBranchSelected === '1') { // 全部、我的
        userBranchParams.operatorType = this.userBranchSelected
      } else if (parseFloat(this.userBranchSelected) > 1) { // 我的下属
        userBranchParams.operatorType = '2'
        if (this.userBranchSelected !== '2') { // 选择的下属
          userBranchParams.uids = this.userBranchSelected
        }
      }

      this.formValue = formValue
      this.$forceUpdate()
      const params = {
        ...this.formValue,
        ...this.superValue,
        ...userBranchParams
      }
      // const dateArr = this.commonDateOptions.pickerDateArr || []
      if (this.superValue.followTime && this.superValue.followTime.length > 0) {
        params.startTime = this.superValue.followTime[0]
        params.endTime = this.superValue.followTime[1]
      }
      for (const i in params) {
        if (!params[i]) {
          delete params[i]
        }
      }
      delete params.followTime
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle() {
      this.userBranchSelected = '0'
      this.searchHandle({})
    },
    /** 高级搜索 */
    onSearch(superValue) {
      // 用户权限选择
      const userBranchParams = {}
      if (this.userBranchSelected === '0' || this.userBranchSelected === '1') { // 全部、我的
        userBranchParams.operatorType = this.userBranchSelected
      } else if (parseFloat(this.userBranchSelected) > 1) { // 我的下属
        userBranchParams.operatorType = '2'
        if (this.userBranchSelected !== '2') { // 选择的下属
          userBranchParams.uids = this.userBranchSelected
        }
      }

      this.superValue = superValue
      const params = {
        ...this.formValue,
        ...this.superValue,
        ...userBranchParams
      }
      // const dateArr = this.commonDateOptions.pickerDateArr || []
      if (this.superValue.followTime && this.superValue.followTime.length > 0) {
        params.startTime = this.superValue.followTime[0]
        params.endTime = this.superValue.followTime[1]
      }
      for (const i in params) {
        if (!params[i]) {
          delete params[i]
        }
      }
      delete params.followTime
      this.$refs.tableCommon.getList(params)
    },
    /** 高级清除 */
    onClear() {
      this.onSearch({})
    },
    /* 刷新列表 */
    getUpdateTable() {
      const params = {
        pageIndex: 0
      }
      this.$refs.tableCommon.getList(params)
    },
    /** 查询下属 */
    querySubUser() {
      const userBranchOptions = [{ id: '0', type: 0, name: '全部', children: [] }, { id: '1', type: 1, name: '我的', children: [] }]
      const children = []
      const self = this
      querySubName().then(res => {
        if (res.data.errorCode === 0) {
          const results = res.data.data
          if (results && results.length > 0) {
            results.map((item) => {
              children.push({
                pid: '2',
                id: item.id,
                name: item.name,
                type: 2
              })
            })
            userBranchOptions.push({ id: '2', type: 2, name: '我的下属', children: children })
            self.userBranchOptions = userBranchOptions
          }
        }
      })
      this.userBranchSelected = '0'
      this.userBranchOptions = userBranchOptions
    },
    /* 导出 */
    exportContent() {
      const params = {
        ...this.superValue,
        ...this.formValue,
        source: this.source
      }
      // const dateArr = this.commonDateOptions.pickerDateArr || []
      if (this.superValue.followTime && this.superValue.followTime.length > 0) {
        params.startTime = this.superValue.followTime[0]
        params.endTime = this.superValue.followTime[1]
      }
      for (const key in params) {
        if (!params[key]) {
          delete params[key]
        }
      }
      if (this.$refs.tableCommon.resultCount > 0) {
        exportFile(`${window.SS_CRM}/crm/commRecord/export`, params)
      } else {
        this.$message.error('暂无数据导出')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  min-width: 1170px;
  .page_title_text {
    font-weight: 500;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(238, 238, 238, 1);
    margin-bottom: 20px;
    padding-left: 0;
    color: #333;
  }
}
.followRecord_container {
  .search {
    display: flex;
    justify-content: space-between;
    height: 48px;
  }
  .follow_content {
    border-top: 1px solid rgba(238, 238, 238, 1);
    height: calc(100vh - 185px);
  }
}
.radio /deep/ {
  display: inline-block;
  .el-radio-button--mini .el-radio-button__inner {
    // font-size: 14px;
  }
}
.subUserSelect {
  vertical-align: top;
  float: left;
  margin-right: 10px;
}
</style>

