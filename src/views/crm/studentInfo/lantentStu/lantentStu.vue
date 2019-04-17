<template>
  <div class="lantentStu_container">
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
      <div>
        <el-button
          v-if="hasBtn('402000001')"
          type="primary"
          size="mini"
          @click="addLantentDialog()"
        >新建潜在学员</el-button>
        <el-button
          v-if="hasBtn('402000004')"
          class="cancel_btn"
          size="mini"
          @click="nameImportDialog()"
        >导入</el-button>
        <el-button
          v-if="hasBtn('402000005')"
          class="cancel_btn"
          size="mini"
          @click="exportContent"
        >导出</el-button>
      </div>
    </div>
    <!-- 日期搜索 -->
    <CommonDateSearch
      ref="commonDatePicker"
      :common-date-options="commonDateOptions"
      @datePickerChange="commonDatePickerChange"
    />
    <!-- 已选数据操作 -->
    <div class="checked_data">
      <span class="checked_text">已选<i>{{ checkNum || '0' }}</i>条数据</span>
      <el-button
        size="mini"
        class="cancel_btn edit_btn"
        style="margin-right:5px"
        @click="distributeDialog()"
      >分配</el-button>
      <Confirm
        :text="'放入回收站'"
        :placement="'top'"
        :content="'确定要放入回收站吗'"
        :confirm="()=>{putRecycleBtn()}"
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
      :operation="operates"
      table-key="crm_studentInfo_lantent"
      @toChildData="getCheckCol"
      @handleSelectionChange="selectionChange"
    />
    <!-- 侧边详情 -->
    <CrmDetailModal
      ref="crmDetailModal"
      v-bind="detailProps"
      :name="stuName"
      :header-data="headerData"
      :base-data="baseData"
      :params="paramsObj"
      @toUpdateLeadsTable="getUpdateSideAndTable"
    />
    <!-- 分配弹框 -->
    <DistributeDialog
      ref="distributeDialog"
      @toUpdateTable="getUpdateTable"
      @toParent="getClearData"
    />
    <!-- 到访弹框 -->
    <VisitDialog
      ref="visitDialog"
      @toUpdateTable="getUpdateTable"
    />
    <!-- 试听弹框 -->
    <ListenDialog
      ref="listenDialog"
      @toOfflinePage="getUpdateTable"
    />
    <!-- 报名弹框 -->
    <ApplyDialog ref="applyDialog" />
    <!-- 添加潜在学员弹框 -->
    <AddLantentStuDialog
      ref="addLantentStuDialog"
      @toUpdateFollow="getUpdateTable"
      @toOpenApply="getOpenApply"
      @toUpdateDetailData="getUpdateDetailData"
      @toOpenTip="openStuExcist"
      @toUpdateTable="getTurnOtherUpdateTable"
    />
    <!-- 名单批量导入弹框 -->
    <NameImportDialog
      ref="nameImportDialog"
      :refresh="refresh"
    />
    <!-- 转给他人弹框 -->
    <TurnOtherDialog
      ref="turnOtherDialog"
      @toUpdateTable="getTurnOtherUpdateTable"
    />
    <!-- 退回公海弹框 -->
    <BackHighSeaDialog
      ref="backHighSeaDialog"
      @toUpdateTable="getTurnOtherUpdateTable"
    />
    <!-- 删除放入回收站弹框 -->
    <DeleteStuDialog
      ref="deleteStuDialog"
      @toUpdateTable="getTurnOtherUpdateTable"
    />
    <!--重复学员提示-->
    <StuExcistDialog ref="stuExcist" />
  </div>
</template>

<script>
import { queryClueStuList, dictGetByKey, recycle } from '@/api/crm/studentInfo/lantentStu'
import CommonTable from './../../../../components/CommonTable/CommonTable'
import CommonSearch from './../../../../components/CommonSearch/CommonSearch'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
import Confirm from '@/components/MiniCommon/Confirm'
import DistributeDialog from './components/distributeDialog.vue'
import VisitDialog from './components/visitDialog.vue'
import ListenDialog from './../../auditionMgr/components/addAuditionDialog.vue'
import ApplyDialog from './../../contractMgr/components/contractOrderDialog.vue'
import AddLantentStuDialog from './components/addLantentStuDialog.vue'
import NameImportDialog from './components/nameImportDialog.vue'
import CommonDateSearch from '../../../../components/CommonDateSearch/CommonDateSearch'
import CrmDetailModal from '@/components/CrmDetailModal'
import TurnOtherDialog from './components/turnOtherDialog.vue'
import BackHighSeaDialog from './components/backHighSeaDialog.vue'
import DeleteStuDialog from './components/deleteStuDialog.vue'
import StuExcistDialog from './components/stuExcistDialog.vue'

import { exportFile } from '@/utils/exportFile'
export default {
  components: {
    CommonTable,
    CommonSearch,
    AdvancedSearch,
    Confirm,
    CommonDateSearch,
    CrmDetailModal, // 侧边详情弹框
    DistributeDialog, // 分配弹框
    VisitDialog, // 到访弹框
    ListenDialog, // 试听弹框
    ApplyDialog, // 报名弹框
    AddLantentStuDialog, // 新建潜在学员弹框
    NameImportDialog, // 名单批量导入弹框
    TurnOtherDialog, // 转给他人弹框
    BackHighSeaDialog, // 退回公海弹框
    DeleteStuDialog, // 删除放入回收站弹框
    StuExcistDialog // 存在重复学员的提示
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
          width: '120',
          isShowTooltip: true,
          render: (h, params) => {
            if (params.row.sex == '2') { //eslint-disable-line
              return h(
                'div',
                {

                  on: {
                    click: () => {
                      this.openSideDetail(params.row)
                    }
                  }
                }, [
                  h('div', { style: 'margin-right:10px;float:left;max-width: 80px;', class: 'stuName' }, params.row.name),
                  h('img', { attrs: { src: 'https://img.ishanshan.com/gimg/n/20190318/03fdc2ea05f27c74f5d8c706ef4f03c0' }})
                ]
              )
            } else if (params.row.sex == '1') { //eslint-disable-line
              return h(
                'div',
                {
                  on: {
                    click: () => {
                      this.openSideDetail(params.row)
                    }
                  }
                }, [
                  h('div', { style: 'margin-right:10px;float:left;max-width: 80px;', class: 'stuName' }, params.row.name),
                  h('img', { attrs: { src: 'https://img.ishanshan.com/gimg/n/20190318/d56924830405313c7dc47fbc1763f10e' }})
                ]
              )
            } else {
              return h(
                'div',
                {
                  class: 'stuName',
                  on: {
                    click: () => {
                      this.openSideDetail(params.row)
                    }
                  }
                }, params.row.name
              )
            }
          }
        },
        {
          label: '家长姓名',
          prop: 'parentName',
          width: 200,
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
                          'div', { slot: 'reference' }, [
                            h(
                              'div', { style: 'margin-right:5px;display:inline-block' },
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
          label: '昵称',
          prop: 'nickName',
          isShowTooltip: true,
          isColShow: false
        },
        {
          label: '年龄(月龄)',
          prop: 'age',
          isShowTooltip: true,
          formatter: (row) => {
            if (row.age != null || row.month != null) {
              return `${row.age}(${row.month})`
            } else {
              return ``
            }
          }
        },
        {
          label: '跟进状态',
          prop: 'studentFollowStateName',
          isShowTooltip: true
        },
        {
          label: '最后跟进时间',
          prop: 'followRecordTime',
          isShowTooltip: true,
          width: 120
        },
        {
          label: '最后跟进记录',
          prop: 'followRecord',
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
          isShowTooltip: true
        },
        {
          label: '重要程度',
          prop: 'importance',
          isShowTooltip: true,
          width: 120
        },
        {
          label: '一级来源',
          prop: 'channelName',
          isShowTooltip: true,
          isColShow: false
        },
        {
          label: '二级来源',
          prop: 'secondChannelName',
          isShowTooltip: true,
          isColShow: false
        },
        {
          label: '创建人',
          prop: 'createName',
          isShowTooltip: true,
          isColShow: false
        },
        {
          label: '生日',
          prop: 'birthday',
          isShowTooltip: true,
          width: 120,
          isColShow: false
        },
        {
          label: '创建时间',
          prop: 'createTime',
          isShowTooltip: true,
          width: 140,
          isColShow: false
        },
        {
          label: '分配时间',
          prop: 'allotTime',
          isShowTooltip: true,
          width: 120,
          isColShow: false
        },
        {
          label: '收集者',
          prop: 'collecterName',
          isShowTooltip: true,
          isColShow: false
        },
        {
          label: '推荐人',
          prop: 'recommenderName',
          isShowTooltip: true,
          width: '110',
          isColShow: false
        }
      ],
      options: {
        mutiSelect: true, // 是否多选
        apiService: queryClueStuList, // 表格的数据请求接口
        params: {
          commonalityLeads: '2'
        },
        isSettingShow: true // 是否出现设置
      },
      tableHeight: 'calc(100vh - 327px)',
      operates: {
        width: '160',
        fixed: 'right',
        list: [
          {
            label: '到访',
            type: 'normal',
            method: (row) => {
              this.openVisitDialog(row)
            }
          },
          {
            label: '试听',
            type: 'normal',
            method: (row) => {
              this.openListenDialog(row)
            }
          },
          {
            label: '报名',
            type: 'normal',
            method: (row) => {
              this.openApplyDialog(row)
            }
          }
        ]
      },
      formInline: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'select',
            placeholder: '全部潜在学员',
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
            placeholder: '学员姓名/电话号码',
            modelValue: 'nameOrMobile',
            isFilterable: true,
            isClearable: true
          }, {
            itemType: 'select',
            placeholder: '请选择跟进状态',
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
            key: 'firstChannel',
            label: '一级来源',
            optionValue: 'key',
            optionLabel: 'value',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/dict/dictGetByKey`,
            asyncParams: {
              dictkey: 'firstChannel'
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
          },
          {
            type: 'datePicker',
            key: 'allotTime',
            label: '分配日期',
            dateType: 'daterange'
          },
          {
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
      commonDateOptions: {
        mainText: '下次跟进时间:',
        defaultDate: [],
        options: ['today', 'tomorrow', 'thisWeek', 'nextWeek'],
        markText: {},
        pickerDateArr: [],
        clickIndex: ''
      },
      // 详情
      detailProps: {
        btns: [
          { type: 'primary', label: '报名', clickHandle: this.clickOne.bind(this, '1') },
          { class: 'cancel_btn', label: '编辑', clickHandle: this.clickOne.bind(this, '2'), btnId: '402000003' },
          { class: 'cancel_btn', label: '转给他人', clickHandle: this.clickOne.bind(this, '3') },
          { class: 'cancel_btn', label: '退回公海', clickHandle: this.clickOne.bind(this, '4') },
          { class: 'cancel_btn', label: '删除', clickHandle: this.clickOne.bind(this, '5'), btnId: '402000002' }
        ],
        headerInfo: [
          { label: '最后跟进时间', key: 'finalTime' },
          { label: '下次跟进时间', key: 'nextTime' },
          { label: '负责销售', key: 'saler' },
          { label: '跟进状态', key: 'followStatus' }
        ],
        baseInfo: [
          { label: '姓名', key: 'name' },
          { label: '昵称', key: 'nickName' },
          { label: '性别', key: 'sex' },
          { label: '生日', key: 'birthday' },
          { label: '年龄(月龄)', key: 'month' },
          { label: '民族', key: 'nation' },
          { label: '爱好', key: 'hobby' },
          { label: '年级', key: 'grade' },
          { label: '特长', key: 'speciality' },
          { label: '血型', key: 'bloodType' },
          { label: '社保号码', key: 'socialSecurityNum' },
          { label: '备注', key: 'remark' },
          { label: '联系地址', key: 'conaddress' },
          { label: '一级来源', key: 'first' },
          { label: '二级来源', key: 'second' }
        ],
        defaultTab: 'leadsRecord',
        tabs: ['parent', 'leadsRecord', 'visiteRecord', 'listenRecord']
      },
      // 头部数据
      headerData: {
        last: '2018-01-01',
        next: null
      },
      // 基础信息数据
      baseData: {
        stuId: '111',
        name: '令狐冲',
        ageMonth: '10(1)'
      },
      superValue: {}, // 高级搜索内容
      checkedData: [], // 选中的数据
      checkNum: 0, // 选中的数据条数
      stuName: '',
      paramsObj: {},
      rowInfo: {},
      formValue: {} // 搜索的数据
    }
  },
  mounted() {
    this.getTableList()
  },
  methods: {
    /* 侧边详情弹框 */
    openSideDetail(row) {
      this.rowInfo = row
      let ageMonth = ''
      let parentId = ''
      let parentName = ''
      const params = {
        id: this.rowInfo.id
      }
      queryClueStuList(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.detail = data.results && data.results[0]
          if (this.detail.month != null || this.detail.age != null) {
            ageMonth = this.detail.age + '(' + this.detail.month + ')'
          } else {
            ageMonth = '--'
          }
          if (this.detail.list && this.detail.list.length > 0) {
            parentId = this.detail.list[0].parentId
            parentName = this.detail.list[0].parentName
          }
          this.paramsObj = {
            stuId: this.rowInfo.id,
            stuName: this.rowInfo.name,
            source: '2',
            parentId: parentId,
            parentName: parentName,
            ...this.detail
          }
          this.stuName = this.detail.name
          this.headerData = {
            finalTime: this.detail.followRecordTime,
            nextTime: this.detail.nextFollowTime,
            saler: this.detail.sellerName,
            followStatus: this.detail.studentFollowStateName
          }
          this.baseData = {
            name: this.detail.name,
            nickName: this.detail.nickName,
            sex: this.detail.sex == '1' ? '男' : this.detail.sex == '2' ? '女' : '', //eslint-disable-line
            birthday: this.detail.birthday,
            month: ageMonth,
            nation: this.detail.nation,
            hobby: this.detail.hobby,
            grade: this.detail.grade,
            speciality: this.detail.speciality,
            bloodType: this.detail.bloodType,
            socialSecurityNum: this.detail.socialSecurityNum,
            remark: this.detail.remark,
            conaddress: this.detail.conaddress,
            first: this.detail.channelName,
            second: this.detail.secondChannelName
          }
          this.$refs.crmDetailModal.show()
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 获取表格当天的数据条数 */
    getTableList() {
      const params = {
        pageIndex: 0,
        pageSize: 20,
        startNextFollowTime: this.$moment().format('YYYY-MM-DD'),
        endNextFollowTime: this.$moment().format('YYYY-MM-DD'),
        commonalityLeads: '2'
      }
      queryClueStuList(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.commonDateOptions.markText = {
            today: data.data && data.data.resultCount
          }
        }
      })
    },
    /* 详情按钮 */
    clickOne(type) {
      // 学员报名弹框
      if (type === '1') {
        this.openApplyDialog(this.rowInfo)
        // this.$refs.applyDialog.showDialog('add', this.rowInfo)
      }
      // 编辑学员信息
      if (type === '2') {
        this.$refs.addLantentStuDialog.showDialog('edit', this.detail)
      }
      // 转给他人弹框
      if (type === '3') {
        this.$refs.turnOtherDialog.showDialog(this.rowInfo)
      }
      // 退回公海弹框
      if (type === '4') {
        this.$refs.backHighSeaDialog.showDialog(this.rowInfo)
      }
      // 删除放入回收站弹框
      if (type === '5') {
        this.$refs.deleteStuDialog.showDialog(this.rowInfo)
      }
    },
    /* 放入回收站 */
    putRecycleBtn() {
      let stuIds = ''
      const stuArr = []
      this.checkedData && this.checkedData.map(item => {
        stuArr.push(item.id)
      })
      stuIds = stuArr.join(',')
      const params = {
        stauts: '3',
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
    /* 更新详情数据 */
    getUpdateDetailData(row) {
      this.openSideDetail(row)
    },
    /* 更新表格和侧边栏数据 */
    getUpdateSideAndTable(row) {
      this.getUpdateTable()
      this.openSideDetail(row)
    },
    /* 更新表格数据 */
    getUpdateTable() {
      const params = {
        pageIndex: 0
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 转给他人更新 */
    getTurnOtherUpdateTable() {
      this.$refs.crmDetailModal.visible = false
      const params = {
        pageIndex: 0
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 打开存在学员的提示 */
    openStuExcist() {
      this.$refs.stuExcist.showDialog()
    },
    /* 清除多选 */
    getClearData() {
      this.$refs.tableCommon.clearSelection()
    },
    /* 选择数据条数操作 */
    selectionChange(val) {
      this.checkedData = val
      this.checkNum = val.length
    },
    /* 分配弹框 */
    distributeDialog() {
      this.$refs.distributeDialog.showDialog(this.checkedData)
    },
    /* 到访弹框 */
    openVisitDialog(row) {
      this.$refs.visitDialog.showDialog(row)
    },
    /* 试听弹框 */
    openListenDialog(row) {
      row.stuId = row.id
      row.source = '2'
      this.$refs.listenDialog.showDialog('edit', row)
    },
    /* 报名弹框 */
    openApplyDialog(row) {
      this.$refs.applyDialog.showDialog('add', row, '0')
    },
    /* 添加潜在学员成功，打开报名新建 */
    getOpenApply(row) {
      this.$refs.applyDialog.showDialog('add', row, '0')
    },
    getCheckCol(val) {
      console.info('val--->', val)
    },
    /* 新建潜在学员弹框 */
    addLantentDialog() {
      this.$refs.addLantentStuDialog.showDialog('add')
    },
    /* 名单导入弹框 */
    nameImportDialog() {
      this.$refs.nameImportDialog.showDialog()
    },
    /* 公用日期选择改变事件 */
    commonDatePickerChange(arr) {
      this.commonDateOptions.pickerDateArr = arr
      this.commonDateOptions.clickIndex = ''
      const params = {
        ...this.formValue,
        ...this.superValue
      }
      for (const i in params) {
        if (!params[i]) {
          delete params[i]
        }
      }
      if (this.commonDateOptions.pickerDateArr && this.commonDateOptions.pickerDateArr.length > 0) {
        params.startNextFollowTime = this.commonDateOptions.pickerDateArr[0]
        params.endNextFollowTime = this.commonDateOptions.pickerDateArr[1]
      }
      this.getTimeSearch(params)
      this.$refs.tableCommon.getList(params)
    },
    /** 公用日期选择重置事件 */
    commonDateReset() {
      this.$refs.commonDatePicker.commonDateReset()
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
      if (this.superValue.allotTime && this.superValue.allotTime.length > 0) {
        params.startAllotTime = this.superValue.allotTime[0]
        params.endAllotTime = this.superValue.allotTime[1]
      }
      if (this.superValue.finalFollowTime && this.superValue.finalFollowTime.length > 0) {
        params.startFinalFollowTime = this.superValue.finalFollowTime[0]
        params.endFinalFollowTime = this.superValue.finalFollowTime[1]
      }
      delete params.birthday
      delete params.createTime
      delete params.allotTime
      delete params.finalFollowTime
    },
    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      this.formValue = formValue
      const params = {
        ...formValue,
        ...this.superValue
      }
      if (this.commonDateOptions.pickerDateArr && this.commonDateOptions.pickerDateArr.length > 0) {
        params.startNextFollowTime = this.commonDateOptions.pickerDateArr[0]
        params.endNextFollowTime = this.commonDateOptions.pickerDateArr[1]
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
    resetFieldHanle(formName) {
      // 重置的入参
      const params = {
        pageIndex: 0,
        ...this.superValue
      }
      this.formValue = {}
      this.getTimeSearch(params)
      this.commonDateReset()
      // this.$refs.tableCommon.getList(params)
    },
    /** 高级搜索 */
    onSearch(superValue) {
      this.superValue = superValue
      const params = {
        ...this.formValue,
        ...this.superValue
      }
      if (this.commonDateOptions.pickerDateArr && this.commonDateOptions.pickerDateArr.length > 0) {
        params.startNextFollowTime = this.commonDateOptions.pickerDateArr[0]
        params.endNextFollowTime = this.commonDateOptions.pickerDateArr[1]
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
        ...this.formValue
      }
      this.superValue = {}
      if (this.commonDateOptions.pickerDateArr && this.commonDateOptions.pickerDateArr.length > 0) {
        params.startNextFollowTime = this.commonDateOptions.pickerDateArr[0]
        params.endNextFollowTime = this.commonDateOptions.pickerDateArr[1]
      }
      this.getTimeSearch(params)
      this.$refs.tableCommon.getList(params)
    },

    /** 导入后刷新列表 */
    refresh() {
      const params = {
        ...this.superValue,
        ...this.formValue
      }
      if (this.commonDateOptions.pickerDateArr && this.commonDateOptions.pickerDateArr.length > 0) {
        params.startNextFollowTime = this.commonDateOptions.pickerDateArr[0]
        params.endNextFollowTime = this.commonDateOptions.pickerDateArr[1]
      }
      for (const i in params) {
        if (!params[i]) {
          delete params[i]
        }
      }
      this.getTimeSearch(params)
      this.$refs.tableCommon.getList(params)
    },

    /* 导出 */
    exportContent() {
      const params = {
        ...this.superValue,
        ...this.formValue
      }
      const dateArr = this.commonDateOptions.pickerDateArr || []
      if (dateArr && dateArr.length > 0) {
        params.startNextFollowTime = dateArr[0]
        params.endNextFollowTime = dateArr[1]
      }
      for (const key in params) {
        if (!params[key]) {
          delete params[key]
        }
      }
      this.getTimeSearch(params)
      if (this.$refs.tableCommon.totalCount > 0) {
        exportFile(`${window.SS_CRM}/crm/stuInfo/clue/exportClueStuInfo`, params)
      } else {
        this.$message.error('暂无数据导出')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.lantentStu_container {
  min-width: 1060px;

  .search {
    display: flex;
    justify-content: space-between;
    height: 48px;
  }
  .checked_data {
    margin: 20px 0 16px;
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
<style lang="scss">
.lantentStu_container {
  .stuName {
    color: #1d9df2;
    text-overflow: ellipsis;
    overflow: hidden;
    &:hover {
      color: #56c0f5;
    }
  }
}
</style>
