<template>
  <div class="recycleBin_container">
    <!-- 搜索栏 -->
    <div class="search">
      <div>
        <CommonSearch
          :is-inline="true"
          :params="formInline"
          :forms="formInline"
          @toParent="resetFieldHanle"
        />
        <advanced-search v-bind="superSearch" />
      </div>
    </div>
    <!-- 已选数据操作 -->
    <div class="checked_data">
      <span class="checked_text">已选<i>{{ checkNum || '0' }}</i>条数据</span>
      <Confirm
        :text="'还原'"
        :placement="'top'"
        :content="'确定要还原吗？'"
        :confirm="()=>{restoreBtn()}"
        :select-data="checkNum"
        :is-visible-fun="true"
        :is-button="true"
        :btn-class="'cancel_btn edit_btn'"
      />
      <Confirm
        :text="'彻底删除'"
        :placement="'top'"
        :content="'确定要彻底删除吗？'"
        :confirm="()=>{deleteBtn()}"
        :select-data="checkNum"
        :is-visible-fun="true"
        :is-button="true"
        :btn-class="'cancel_btn edit_btn'"
      />
    </div>
    <!-- 表格 -->
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      table-key="crm_studentInfo_recycle"
      @handleSelectionChange="selectionChange"
    />
  </div>
</template>

<script>
import CommonTable from './../../../../components/CommonTable/CommonTable'
import CommonSearch from './../../../../components/CommonSearch/CommonSearch'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
import Confirm from '@/components/MiniCommon/Confirm'
import { queryClueStuList, dictGetByKey, recycle } from '@/api/crm/studentInfo/recycleBin'
export default {
  components: {
    CommonTable,
    CommonSearch,
    AdvancedSearch,
    Confirm
  },
  data() {
    return {
      listQuery: {
        show: true // 是否显示
      },
      columns: [
        {
          label: '名单姓名',
          prop: 'name',
          isShowTooltip: true
        },
        {
          label: '家长姓名',
          prop: 'parentName',
          width: 150,
          isShowTooltip: true,
          render: (h, params) => {
            return h('span', {}, [
              h(
                'span',
                params.row.list && params.row.list.length > 1
                  ? [
                    h(
                      'el-popover',
                      {
                        props: { placement: 'top', trigger: 'hover' }
                      },
                      [
                        h(
                          'div',
                          params.row.list &&
                            params.row.list.map(item => {
                              return h('span', { style: 'margin-right:10px' }, item.parentName)
                            })
                        ),
                        h(
                          'span', { slot: 'reference' }, [
                            h(
                              'span', { style: 'margin-right:5px' },
                              params.row.list[0].parentName + ' '
                            ),
                            h(
                              'a',
                              { style: 'margin: 0 0 0 5px' },
                              '共' + params.row.list.length + '人'
                            )
                          ]
                        )
                      ]
                    )
                  ]
                  : params.row.list &&
                      params.row.list.map((item, index) => {
                        return h('span', item.parentName)
                      })
              )
            ])
          }
        },
        {
          label: '家长手机号',
          prop: 'parentMobile',
          isShowTooltip: true,
          width: 110,
          render: (h, params) => {
            return h('span', {}, [
              params.row.list && params.row.list.length > 0
                ? h(
                  'el-popover',
                  {
                    props: { placement: 'top', trigger: 'hover' }
                  },
                  [
                    h(
                      'div',
                      [
                        params.row.list.map(item => {
                          return h('div', [
                            h(
                              'span', item.parentName + '：' + item.parentMobile
                            ),
                            h('a', { style: 'margin:0 0 0 10px' }, '拨打')
                          ])
                        })
                      ]
                    ),
                    h('a', { slot: 'reference' }, '查看')
                  ]
                )
                : ''
            ])
          }
        },
        {
          label: '一级来源',
          prop: 'channelName',
          isShowTooltip: true
        },
        {
          label: '二级来源',
          prop: 'secondChannelName',
          isShowTooltip: true
        },
        {
          label: '跟进状态',
          prop: 'studentFollowStateName',
          isShowTooltip: true
        },
        {
          label: '重要程度',
          prop: 'importance',
          isShowTooltip: true,
          width: 100
        },
        {
          label: '回收原因',
          prop: 'recycleResonName',
          isShowTooltip: true,
          width: 100
        },
        {
          label: '备注',
          prop: 'remark',
          isShowTooltip: true,
          width: 120
        },
        {
          label: '性别',
          prop: 'sex',
          isShowTooltip: true,
          formatter: (row) => {
            if (row.sex == '2') { //eslint-disable-line
              return `<img src="https://img.ishanshan.com/gimg/n/20190318/03fdc2ea05f27c74f5d8c706ef4f03c0">`
            } else {
              return `<img src="https://img.ishanshan.com/gimg/n/20190318/d56924830405313c7dc47fbc1763f10e">`
            }
          }
        },
        {
          label: '生日',
          prop: 'birthday',
          isShowTooltip: true,
          width: 120,
          isColShow: false
        },
        {
          label: '年龄(月龄)',
          prop: 'age',
          isShowTooltip: true,
          isColShow: false,
          formatter: (row) => {
            if (row.age != null || row.month != null) {
              return `${row.age}(${row.month})`
            } else {
              return ``
            }
          }
        },
        {
          label: '创建时间',
          prop: 'createTime',
          isShowTooltip: true,
          isColShow: false,
          width: 120
        },
        {
          label: '分配时间',
          prop: 'allotTime',
          isShowTooltip: true,
          width: 120
        },
        {
          label: '最后跟进时间',
          prop: 'followRecordTime',
          isShowTooltip: true,
          width: 120
        },
        {
          label: '下次跟进时间',
          prop: 'nextFollowTime',
          isShowTooltip: true,
          width: 120
        },
        {
          label: '负责销售',
          prop: 'sellerName',
          isShowTooltip: true,
          width: 160
        },
        {
          label: '收集者',
          prop: 'collecterName',
          isShowTooltip: true,
          width: 150,
          isColShow: false
        },
        {
          label: '推荐人',
          prop: 'recommenderName',
          isShowTooltip: true,
          width: 150,
          isColShow: false
        }
      ],
      options: {
        mutiSelect: true, // 是否多选
        apiService: queryClueStuList, // 表格的数据请求接口
        params: {
          status: '3'
        },
        isSettingShow: true // 是否出现设置
      },
      tableHeight: 'calc(100vh - 265px)',
      formInline: {
        searchMethod: formValue => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '名单姓名/家长手机号',
            modelValue: 'nameOrMobile',
            itemStyle: 'width:180px',
            isFilterable: true,
            isClearable: true
          }, {
            itemType: 'select',
            placeholder: '一级来源',
            modelValue: 'firstChannel',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            valueKey: 'key',
            labelKey: 'value',
            apiService: dictGetByKey,
            params: {
              dictkey: 'firstChannel'
            }
          }, {
            itemType: 'select',
            placeholder: '跟进状态',
            modelValue: 'studentFollowState',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            valueKey: 'key',
            labelKey: 'value',
            apiService: dictGetByKey,
            params: {
              dictkey: 'studentFollowState'
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
            key: 'importance',
            label: '重要程度',
            optionValue: 'key',
            optionLabel: 'value',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/dict/dictGetByKey`,
            asyncParams: {
              dictkey: 'importance'
            }
          }, {
            type: 'select',
            key: 'secondChannel',
            label: '二级来源',
            optionValue: 'key',
            optionLabel: 'value',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/dict/dictGetByKey`,
            asyncParams: {
              dictkey: 'secondChannel'
            }
          }, {
            type: 'input',
            key: 'parentName',
            label: '家长姓名'
          }, {
            type: 'select',
            key: 'recycleReson',
            label: '回收原因',
            optionValue: 'key',
            optionLabel: 'value',
            options: [
              { key: '1', value: '名单删除' },
              { key: '2', value: '名单重复' }
            ]
          }, {
            type: 'select',
            key: 'sex',
            label: '性别',
            optionValue: 'id',
            optionLabel: 'name',
            options: [
              { id: '1', name: '男' },
              { id: '2', name: '女' }
            ]
          }, {
            type: 'input',
            key: 'month',
            label: '月龄'
          }, {
            type: 'datePicker',
            key: 'birthday',
            label: '生日',
            dateType: 'daterange'
          }, {
            type: 'datePicker',
            key: 'createTime',
            label: '创建日期',
            dateType: 'daterange'
          }, {
            type: 'dateTimePicker',
            key: 'nextFollowTime',
            label: '下次跟进时间',
            isRange: true,
            format: 'yyyy-MM-dd HH:mm',
            valueFormat: 'yyyy-MM-dd HH:mm'
          }, {
            type: 'dateTimePicker',
            key: 'finalFollowTime',
            label: '最后跟进时间',
            isRange: true,
            format: 'yyyy-MM-dd HH:mm',
            valueFormat: 'yyyy-MM-dd HH:mm'
          }, {
            type: 'input',
            key: 'collecterName',
            label: '收集者'
          }, {
            type: 'input',
            key: 'recommenderName',
            label: '推荐人'
          }, {
            type: 'input',
            key: 'remarks',
            label: '备注'
          }
        ]
      },
      checkedData: [], // 选中的数据
      checkNum: 0, // 选中的条数
      superValue: {}, // 高级搜索内容
      formValue: {} // 搜索栏数据
    }
  },
  methods: {
    /* 还原 */
    restoreBtn() {
      let stuIds = ''
      const stuArr = []
      this.checkedData && this.checkedData.map(item => {
        stuArr.push(item.id)
      })
      stuIds = stuArr.join(',')
      const params = {
        stauts: '1',
        stuIds: stuIds,
        gain: '1'
      }
      recycle(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.$message.success(data.errorMessage)
          this.getUpdateTable()
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 彻底删除 */
    deleteBtn() {
      let stuIds = ''
      const stuArr = []
      this.checkedData && this.checkedData.map(item => {
        stuArr.push(item.id)
      })
      stuIds = stuArr.join(',')
      const params = {
        stauts: '0',
        stuIds: stuIds
      }
      recycle(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.$message.success(data.errorMessage)
          this.getUpdateTable()
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 选择数据条数操作 */
    selectionChange(val) {
      this.checkedData = val
      this.checkNum = val.length
    },
    /* 表格数据的更新 */
    getUpdateTable() {
      const payload = {
        pageIndex: 0,
        status: '3'
      }
      this.$refs.tableCommon.getList(payload)
    },
    /* 时间处理 */
    getTimeSearch(params) {
      if (this.superValue.birthday && this.superValue.birthday.length > 0) {
        params.startBirthday = this.superValue.birthday[0]
        params.endBirthday = this.superValue.birthday[1]
      }
      if (this.superValue.createTime && this.superValue.createTime.length > 0) {
        params.startCreateTime = this.superValue.createTime[0]
        params.endCreateTime = this.superValue.createTime[1]
      }
      if (this.superValue.nextFollowTime && this.superValue.nextFollowTime.length > 0) {
        params.startNextFollowTime = this.superValue.nextFollowTime[0]
        params.endNextFollowTime = this.superValue.nextFollowTime[1]
      }
      if (this.superValue.finalFollowTime && this.superValue.finalFollowTime.length > 0) {
        params.startFinalFollowTime = this.superValue.finalFollowTime[0]
        params.startFinalFollowTime = this.superValue.finalFollowTime[1]
      }
      delete params.birthday
      delete params.createTime
      delete params.nextFollowTime
      delete params.finalFollowTime
    },
    /* 搜索 */
    searchHandle(formValue) {
      this.formValue = formValue
      // 搜索的入参
      const params = {
        status: '3',
        ...this.formValue,
        ...this.superValue
      }
      for (const i in params) {
        if (!params[i]) {
          delete params[i]
        }
      }
      this.getTimeSearch(params)
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle() {
      // 重置的入参
      const params = {
        pageIndex: 0,
        status: '3',
        ...this.superValue
      }
      for (const i in params) {
        if (!params[i]) {
          delete params[i]
        }
      }
      this.formValue = {}
      this.getTimeSearch(params)
      this.$refs.tableCommon.getList(params)
    },
    /** 高级搜索 */
    onSearch(superValue) {
      this.superValue = superValue
      const params = {
        status: '3',
        ...this.formValue,
        ...this.superValue
      }
      for (const i in params) {
        if (!params[i]) {
          delete params[i]
        }
      }
      this.getTimeSearch(params)
      this.$refs.tableCommon.getList(params)
    },
    /** 高级清除 */
    onClear() {
      const params = {
        pageIndex: 0,
        status: '3',
        ...this.formValue
      }
      for (const i in params) {
        if (!params[i]) {
          delete params[i]
        }
      }
      this.superValue = {}
      this.getTimeSearch(params)
      this.$refs.tableCommon.getList(params)
    }
  }
}
</script>

<style lang="scss" scoped>
.recycleBin_container {
  .search {
    display: flex;
    justify-content: space-between;
    height: 48px;
  }
  .checked_data {
    margin: 0px 0 16px;
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

