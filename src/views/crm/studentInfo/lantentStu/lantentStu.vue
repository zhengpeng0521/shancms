<template>
  <div class="lantentStu_container">
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
          ref="CommonSearch"
          :is-inline="true"
          :params="formInline"
          :forms="formInline"
          @toParent="resetFieldHanle"
        />
        <advanced-search
          ref="superSearch"
          v-bind="superSearch"
        />
      </div>
      <div>
        <el-button
          v-log="{compName:'潜在学员',eventName:'web-【学员CRM】-学员信息-潜在学员-新建潜在学员'}"
          v-if="hasBtn('402000001')"
          type="primary"
          size="mini"
          @click="addLantentDialog()"
        >新建潜在学员</el-button>
        <el-button
          v-log="{compName:'潜在学员',eventName:'web-【学员CRM】-学员信息-潜在学员-导入'}"
          v-if="hasBtn('402000004')"
          class="cancel_btn"
          size="mini"
          @click="nameImportDialog()"
        >导入</el-button>
        <el-button
          v-log="{compName:'潜在学员',eventName:'web-【学员CRM】-学员信息-潜在学员-导出'}"
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
        v-log="{compName:'潜在学员',eventName:'web-【学员CRM】-学员信息-潜在学员-放入回收站'}"
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
    <ApplyDialog
      ref="applyDialog"
      @toUpdateStuList="getTurnOtherUpdateTable"
    />
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
import { queryClueStuList, dictGetByKey, recycle, querySubName } from '@/api/crm/studentInfo/lantentStu'
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
import SubUserSelect from './../../../../components/SubUserSelect/SubUserSelect.vue'

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
    StuExcistDialog, // 存在重复学员的提示
    SubUserSelect // 用户下拉树
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
          label: '最后到访时间',
          prop: 'lastVisitTime',
          isShowTooltip: true,
          width: 170
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
          label: this.$t('firstChannel.label'),
          prop: 'channelName',
          isShowTooltip: true,
          isColShow: false
        },
        {
          label: this.$t('secondChannel.label'),
          prop: 'secondChannelName',
          isShowTooltip: true,
          isColShow: false
        },
        {
          label: this.$t('thirdChannel.label'),
          prop: 'subSecondChannelStr',
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
        noMount: true,
        mutiSelect: true, // 是否多选
        apiService: queryClueStuList, // 表格的数据请求接口
        params: {
          commonalityLeads: '2',
          operatorType: '0'
        },
        isSettingShow: true // 是否出现设置
      },
      tableHeight: 'calc(100vh - 313px)',
      operates: {
        width: '162',
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
          { label: '学校', key: 'schaddress' },
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
      formValue: {}, // 搜索的数据
      userBranchOptions: [],
      userBranchSelected: '0',
      operatorType: 0, // 操作类型, 0.全部,1.我的, 2.我的下属
      operatorUser: '' // 查询用户
    }
  },
  mounted() {
    this.querySubUser()
    // 默认查询当天的跟进条数
    this.getTodayCount()
    // 根据路由默认查询
    const route = this.$router.history.current.params
    const routerDateType = route && route.routerDateType
    if (route.activeTab === 'lantentStu') {
      const action = route && route.action
      // 打开新建窗口
      if (action === 'addStu' && this.hasBtn('402000001')) {
        this.addLantentDialog()
      }
      // 今日待跟进默认查询
      if (action === 'touchGoal') {
        this.$refs.commonDatePicker.todayClick()
        this.$refs.commonDatePicker.checkedIndex = 'today'
        return
      }
      //  跟进状态查询
      if (action === 'followState') {
        this.$refs.CommonSearch.formValue.studentFollowState = route.followState || ''
        console.log('this.formValue', this.formValue)
        this.searchHandle(this.formValue)
        return
      }
      // 首页机构概况数据跳入，查看创建时间为今日、本周、本月的学员
      if (routerDateType) {
        if (routerDateType === 'today') {
          this.$refs.superSearch.ruleForm.createTime = [this.$moment().format('YYYY-MM-DD'), this.$moment().format('YYYY-MM-DD')]
        } else if (routerDateType === 'thisWeek') {
          const weekOfday = this.$moment().format('d') // 计算今天是这周第几天
          const monday = this.$moment()
            .subtract(weekOfday - 1, 'days')
            .format('YYYY-MM-DD')
          const sunday = this.$moment()
            .add(7 - weekOfday, 'days')
            .format('YYYY-MM-DD') // 周日日期
          this.$refs.superSearch.ruleForm.createTime = [monday, sunday]
        } else if (routerDateType === 'thisMonth') {
          // 返回本月
          const start = this.$moment()
            .month(this.$moment().month())
            .startOf('month')
            .format('YYYY-MM-DD')
          const end = this.$moment()
            .month(this.$moment().month())
            .endOf('month')
            .format('YYYY-MM-DD')
          this.$refs.superSearch.ruleForm.createTime = [start, end]
        }
        this.$refs.superSearch.submitForm()
        return
      }
    }
    this.searchHandle(this.formValue)
    // this.$refs.commonDatePicker.todayClick()
    // this.$refs.commonDatePicker.checkedIndex = 'today'
  },
  methods: {
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
            schaddress: this.detail.schaddress,
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
    /* 获取当天的跟进记录条数 （仅仅显示今日跟进条数）*/
    getTodayCount() {
      const params = {
        pageIndex: 0,
        pageSize: 20,
        startNextFollowTime: this.$moment().format('YYYY-MM-DD'),
        endNextFollowTime: this.$moment().format('YYYY-MM-DD'),
        commonalityLeads: '2',
        operatorType: '0'
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
      // 跟进记录更新后要保留搜索参数
      // const params = {
      //   ...this.formValue,
      //   ...this.superValue,
      //   pageIndex: this.$refs.tableCommon.pageIndex - 1
      // }
      // this.$refs.tableCommon.getList(params)
      const params = {
        ...this.formValue,
        pageIndex: this.$refs.tableCommon.pageIndex - 1
      }
      this.searchHandle(params)
      this.openSideDetail(row)
    },
    /* 更新表格数据 */
    getUpdateTable() {
      const params = {
        ...this.formValue,
        pageIndex: 0
      }
      this.searchHandle(params)
    },
    /* 转给他人更新 */
    getTurnOtherUpdateTable() {
      this.$refs.crmDetailModal.visible = false
      const params = {
        ...this.formValue,
        pageIndex: 0
      }
      this.searchHandle(params)
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
      // 搜索的入参
      this.formValue = formValue
      const params = {
        ...formValue,
        ...this.superValue,
        ...userBranchParams
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
      // // 重置的入参
      // const params = {
      //   pageIndex: 0,
      //   ...this.superValue
      // }
      // this.formValue = {}
      // this.getTimeSearch(params)
      // this.commonDateReset()
      // this.$refs.tableCommon.getList(params)
      this.userBranchSelected = '0'
      this.$refs.commonDatePicker.commonDateReset()
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
      // const params = {
      //   pageIndex: 0,
      //   ...this.formValue
      // }
      // this.superValue = {}
      // if (this.commonDateOptions.pickerDateArr && this.commonDateOptions.pickerDateArr.length > 0) {
      //   params.startNextFollowTime = this.commonDateOptions.pickerDateArr[0]
      //   params.endNextFollowTime = this.commonDateOptions.pickerDateArr[1]
      // }
      // this.getTimeSearch(params)
      // this.$refs.tableCommon.getList(params)
      this.onSearch({})
    },

    /** 导入后刷新列表 */
    refresh() {
      // const params = {
      //   ...this.superValue,
      //   ...this.formValue
      // }
      // if (this.commonDateOptions.pickerDateArr && this.commonDateOptions.pickerDateArr.length > 0) {
      //   params.startNextFollowTime = this.commonDateOptions.pickerDateArr[0]
      //   params.endNextFollowTime = this.commonDateOptions.pickerDateArr[1]
      // }
      // for (const i in params) {
      //   if (!params[i]) {
      //     delete params[i]
      //   }
      // }
      // this.getTimeSearch(params)
      // this.$refs.tableCommon.getList(params)
      this.searchHandle(this.formValue)
    },

    /* 导出 */
    exportContent() {
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
      const params = {
        ...this.superValue,
        ...this.formValue,
        ...userBranchParams
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
    cursor: pointer;
    &:hover {
      color: #56c0f5;
    }
  }
  .subUserSelect {
    vertical-align: top;
    float: left;
    margin-right: 10px;
  }
}
</style>
