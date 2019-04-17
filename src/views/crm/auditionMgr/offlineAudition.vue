<template>
  <div class="offlineAudition_container app-container">
    <div class="page_title_text">
      试听管理
    </div>
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
          type="primary"
          size="mini"
          @click="addAuditionDialog()"
        >新增试听</el-button>
      </div>
    </div>
    <!-- 快捷搜索 -->
    <CommonDateSearch
      ref="commonDatePicker"
      :common-date-options="commonDateOptions"
      @datePickerChange="commonDatePickerChange"
    />
    <!-- 已选 取消 -->
    <div class="table_checked_box">
      <span class="table_checked_text">已选
        <span class="checked_nums">{{ checkedDataNum || '0' }}</span>条数据
      </span>
      <el-button
        class="cancel_btn edit_btn"
        @click="cancelReason(checkedDataNum)"
      >取消</el-button>
      <!-- <span
        style="color:#46b6ee;cursor:pointer"
        @click="cancelReason(checkedDataNum)"
      >
        取消
      </span> -->
    </div>
    <!-- 表格 -->
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      table-key="crm_audition_offline"
      @handleSelectionChange="selectionChange"
    />
    <!-- 侧边详情 -->
    <CrmDetailModal
      ref="crmDetailModal"
      v-bind="detailProps"
      :name="studentName"
      :header-data="headerData"
      :base-data="baseData"
      :params="idObj"
      @toUpdateListenTable="getUpdateTable"
    />
    <!-- 新增预约试听弹框 -->
    <AddAuditionDialog
      ref="addAuditionDialog"
      @toOfflinePage="getOfflineList"
    />
    <!-- 取消预约弹框 -->
    <CancelReasonDialog
      ref="cancelReasonDialog"
      @toOfflinePage="getOfflineList"
    />
  </div>
</template>

<script>
import {
  qureyList,
  getSingleClueStu, // 名单学员详情信息
  getStuMsg // 学员学员详情信息
} from '@/api/crm/auditionMgr/auditionMgr.js'
import CommonTable from './../../../components/CommonTable/CommonTable'
import CommonSearch from './../../../components/CommonSearch/CommonSearch'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
import CrmDetailModal from '@/components/CrmDetailModal'
import AddAuditionDialog from './components/addAuditionDialog.vue'
import CommonDateSearch from '../../../components/CommonDateSearch/CommonDateSearch'
import CancelReasonDialog from './components/cancelReasonDialog.vue'
export default {
  components: {
    CommonTable,
    CommonSearch,
    AdvancedSearch,
    CommonDateSearch,
    CancelReasonDialog, // 取消预约弹框
    CrmDetailModal, // 侧边详情弹框
    AddAuditionDialog // 新增预约试听弹框
  },
  data() {
    return {
      listQuery: {
        show: true // 是否显示
      },
      columns: [
        {
          label: '学员姓名',
          prop: 'stuName',
          isShowSet: false,
          isShowTooltip: true,
          render: (h, params) => {
            return h(
              'div',
              {
                class: 'stuName',
                on: {
                  click: () => {
                    this.openAuditionSide(params.row)
                  }
                }
              }, params.row.stuName
            )
          }
        },
        {
          label: '适用家长',
          prop: 'parents',
          width: '140px;',
          render: (h, params) => {
            if (params.row.parents && params.row.parents.length > 1) {
              return h('span', {}, [
                h('span', params.row.parents[0].name + ''),
                h('el-popover', {
                  props: { placement: 'top', trigger: 'hover' }
                },
                [
                  h('div',
                    params.row.parents.map(item => {
                      return h('span', {}, item.name + ' ')
                    })
                  ),
                  h('a', { slot: 'reference' }, ' ' + '共' + params.row.parents.length + '人')
                ]
                )
              ]
              )
            } else if (params.row.parents && params.row.parents.length == 0) { //eslint-disable-line
              h('span', '')
            } else {
              return h('span', { slot: 'reference' }, params.row.parents && params.row.parents[0].name)
            }
          }
        },
        {
          label: '手机号',
          prop: 'mobile',
          isShowTooltip: true,
          render: (h, params) => {
            return h('span', {}, [
              h('el-popover', {
                props: { placement: 'top', trigger: 'click' }
              }, [
                h('span',
                  params.row.parents && params.row.parents.length > 0 && params.row.parents.map(item => {
                    return h('span', item.name + ':' + item.mobile + ' ' + ',')
                  })
                ),
                h('a', ' ' + '拨打'),
                h('a',
                  { slot: 'reference' }, '查看')
              ])
            ])
          }
        },
        {
          label: '跟进人',
          prop: 'sellerName',
          isShowTooltip: true
        },
        {
          label: '状态',
          prop: 'status',
          isShowTooltip: true,
          width: '120px',
          formatter: (row, column, cellValue) => {
            if(row.status == '0') { //eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(169, 180, 188);border-radius: 50px;margin-right: 5px;"></span>
                        ${'取消'}
                        <div>${row.reason && row.reason === '1' ? '操作有误' : row.reason === '2' ? '节假日放假' : row.reason === '3' ? '老师请假' : row.reason === '4' ? '学员调班' : row.reason === '5' ? '从班级移除' : row.reason === '6' ? '老师离职' : ''}</div>
                      </div>`
            }
            if(row.status == '1') { //eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(93, 156, 236);border-radius: 50px;margin-right: 5px;"></span>
                        ${'已预约'}
                      </div>`
            }
            if(row.status == '2') { //eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(93, 156, 236);border-radius: 50px;margin-right: 5px;"></span>
                        ${'已试听'}
                      </div>`
            }
            if(row.status == '3') { //eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(93, 156, 236);border-radius: 50px;margin-right: 5px;"></span>
                        ${'旷课'}
                      </div>`
            }
          }
        },
        {
          label: '试听课程',
          prop: 'courseName',
          isShowTooltip: true
        },
        {
          label: '预约时间',
          prop: 'auditionTime',
          isShowTooltip: true,
          formatter: (row) => {
            if (row.auditionTime || row.auditionEndTime) {
              return `${row.auditionTime} ~ ${row.auditionEndTime}`
            } else {
              return ``
            }
          }
        },
        {
          label: '备注',
          prop: 'remark',
          isShowTooltip: true
        },
        {
          label: '创建时间',
          prop: 'createTime',
          isShowTooltip: true,
          width: '150'
        }
      ],
      options: {
        mutiSelect: true, // 是否多选
        apiService: qureyList, // 表格的数据请求接口
        isSettingShow: true // 是否出现设置
      },
      tableHeight: 'calc(100vh - 320px)',
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
            isClearable: true,
            itemStyle: 'width:150px'
          }, {
            itemType: 'select',
            placeholder: '试听状态',
            modelValue: 'status',
            isClearable: true,
            itemStyle: 'width:140px',
            selectOption: [
              {
                label: '取消',
                value: '0'
              }, {
                label: '已预约',
                value: '1'
              }, {
                label: '已试听',
                value: '2'
              }, {
                label: '旷课',
                value: '3'
              }
            ]
          }
        ]
      },
      superSearch: {
        onClear: () => { this.onClear() },
        onSearch: (superValue) => { this.onSearch(superValue) },
        fields: [
          {
            type: 'input',
            key: 'sellerName',
            label: '跟进人'
          }, {
            type: 'select',
            key: 'source',
            label: '学员类型',
            optionValue: 'id',
            optionLabel: 'name',
            options: [{ id: '2', name: '潜在学员' }, { id: '1', name: '在读学员' }]
          }
          // {
          //   type: 'dateTimePicker',
          //   key: 'dateTimeRange',
          //   dateType: 'datetime',
          //   defaultTime: ['00:00:00', '23:59:59'],
          //   isRange: true,
          //   label: '时间'
          // }
        ]
      },
      pickerOptions: {
        firstDayOfWeek: 1,
        shortcuts: [{
          text: '今日',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime())
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '昨日',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24)
            end.setTime(end.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '近7日',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '近30日',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '本周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            const num = start.getDay() - 1
            start.setTime(start.getTime() - 3600 * 1000 * 24 * num)
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 6)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '本月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            const y = start.getFullYear()
            const m = start.getMonth()
            start.setTime(new Date(y, m, 1))
            end.setTime(new Date(y, m + 1, 0))
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '上月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            const y = start.getFullYear()
            const m = start.getMonth()
            start.setTime(new Date(y, m - 1, 1))
            end.setTime(new Date(y, m, 0))
            picker.$emit('pick', [start, end])
          }
        }]
      },
      commonDateOptions: {
        mainText: '试听时间:',
        defaultDate: [],
        options: ['today', 'tomorrow', 'thisWeek', 'nextWeek'],
        markText: { },
        pickerDateArr: []
      },
      // 详情
      detailProps: {
        btns: [],
        headerInfo: [
          { label: '负责销售', key: 'saler' },
          { label: '负责老师', key: 'counselorName' }
        ],
        baseInfo: [], // 学员基本信息
        defaultTab: 'listenRecord',
        tabs: ['listenRecord', 'parent']
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
      idObj: {},
      listenRecordList: [],
      checkedData: '',
      visible2: false,
      studentName: '',
      rowListListen: {},
      selectItemIds: [], // 被选数据的ids
      checkedDataNum: '' // 选择的数据
    }
  },
  methods: {
    /* 选择数据条数操作 */
    selectionChange(val) {
      this.checkedDataNum = val.length
      this.selectItemIds = []
      val && val.length > 0 && val.map(item => {
        this.selectItemIds.push(item.id)
      })
    },
    /* 取消原因 弹框显示 */
    cancelReason(val) {
      if (val && val > 0) {
        this.$refs.cancelReasonDialog.showDialog(this.selectItemIds)
      }
    },
    /* 预约试听记录列表 */
    qureyListFun() {
      this.getOfflineList()
    },
    /* 试听记录侧边弹框 */
    openAuditionSide(row) {
      this.rowListListen = row
      this.studentName = row.stuName
      const params = {
        stuId: row.stuId
      }
      row.name = row.stuName
      row.id = row.stuId
      this.idObj = {
        ...row
      }
      if(row.source == '2') { //eslint-disable-line
        getSingleClueStu(params).then(res => {
          if (res.data.errorCode === 0) {
            this.detailProps.baseInfo = [
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
              { label: '家长姓名', key: 'parentName' },
              { label: '家长手机号', key: 'parentMobile' },
              { label: '家长关系', key: 'relationName' },
              { label: '家长QQ', key: 'qqNumber' },
              { label: '家长行业', key: 'trade' },
              { label: '家长邮箱', key: 'email' },
              { label: '固定电话', key: 'tel' },
              { label: '一级来源', key: 'first' },
              { label: '二级来源', key: 'second' },
              { label: '校区名称', key: 'orgName' }
            ]
            this.headerData = {
              last: res.data.followRecordTime,
              next: res.data.nextFollowTime,
              saler: res.data.sellerName,
              status: res.data.studentFollowStateName
            }
            this.baseData = {
              name: res.data.name,
              nickName: res.data.nickName,
              sex: res.data.sex == '1' ? '男' : res.data.sex == '2' ? '女': '', //eslint-disable-line
              birthday: res.data.birthday,
              month: res.data.age + '(' + res.data.month + ')',
              nation: res.data.nation,
              hobby: res.data.hobby,
              grade: res.data.grade,
              speciality: res.data.speciality,
              bloodType: res.data.bloodType,
              socialSecurityNum: res.data.socialSecurityNum,
              remark: res.data.remark,
              conaddress: res.data.conaddress,
              parentName: res.data.parentName,
              parentMobile: res.data.parentMobile,
              relationName: res.data.relationName,
              qqNumber: res.data.qqNumber,
              trade: res.data.trade,
              email: res.data.email,
              tel: res.data.tel,
              first: res.data.channelName,
              second: res.data.secondChannelName,
              orgName: res.data.orgName
            }
            this.$refs.crmDetailModal.show()
          } else {
            this.$message.error(res.data.errorMessage)
          }
        })
      } else {
        this.detailProps.baseInfo = [
          { label: '姓名', key: 'name' },
          { label: '性别', key: 'sex' },
          { label: '生日', key: 'birthday' },
          { label: '年龄(月龄)', key: 'month' },
          { label: '年级', key: 'grade' },
          { label: '星座', key: 'constellation' },
          { label: '民族', key: 'nation' },
          { label: '爱好', key: 'hobby' },
          { label: '特长', key: 'speciality' },
          { label: '血型', key: 'bloodType' },
          { label: '社保号码', key: 'socialSecurityNum' },
          { label: '手机号', key: 'mobile', popover: 'true' },
          { label: '学员类型', key: 'intentionName' },
          { label: '地址', key: 'conaddress' },
          { label: '一级来源', key: 'first' },
          { label: '二级来源', key: 'second' },
          { label: '备注', key: 'remark' }
        ]
        getStuMsg(params).then(res => {
          const data = res.data
          if (data.errorCode === 0) {
            const result = data.data
            this.headerData = {
              saler: result.sellerName,
              counselorName: result.counselorName
            }
            this.baseData = {
              name: result.name,
              sex: result.sex == '1' ? '男' : '女', //eslint-disable-line
              birthday: result.birthday,
              month: result.age + '(' + result.month + ')',
              grade: result.grade,
              constellation: result.constellation,
              nation: result.nation,
              hobby: result.hobby,
              speciality: result.speciality,
              bloodType: result.bloodType,
              socialSecurityNum: result.socialSecurityNum,
              mobile: result.mobile,
              intentionName: result.intentionName,
              conaddress: result.conaddress,
              first: result.channelName,
              second: result.secondChannelName,
              remark: result.remark
            }
            this.$refs.crmDetailModal.show()
          } else {
            this.$message.error(data.errorMessage)
          }
        })
      }
    },
    /* 跟新刷新试听列表 */
    getOfflineList() {
      const params = {
        pageIndex: 0
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 详情按钮 */
    clickOne(type) {
      console.log('报名', type)
    },
    /* 新增预约试听弹框 */
    addAuditionDialog() {
      this.$refs.addAuditionDialog.showDialog()
    },
    /* 公用日期选择改变事件 */
    commonDatePickerChange(arr) {
      // this.commonDateOptions.pickerDateArr = arr
      const params = {}
      this.commonDateOptions.pickerDateArr = arr
      if (this.commonDateOptions.pickerDateArr && this.commonDateOptions.pickerDateArr.length > 0) {
        params.startAuditionTime = this.commonDateOptions.pickerDateArr[0]
        params.endAuditionTime = this.commonDateOptions.pickerDateArr[1]
      }
      this.$refs.tableCommon.getList(params)
    },
    /** 公用日期选择重置事件 */
    commonDateReset() {
      this.$refs.commonDatePicker.commonDateReset()
    },
    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      this.formValue = formValue
      const params = {
        // status: this.formInline.status,
        // nameOrMobile: this.formInline.nameOrMobile
        ...this.formValue,
        ...this.superValue
      }
      const dateArr = this.commonDateOptions.pickerDateArr || []
      if (dateArr && dateArr.length > 0) {
        params.startAuditionTime = dateArr[0]
        params.endAuditionTime = dateArr[1]
      }
      if (this.superValue && this.superValue.dateTimeRange && this.superValue.dateTimeRange.length > 0) {
        params.startAuditionTime = this.superValue.dateTimeRange && this.superValue.dateTimeRange[0]
        params.endAuditionTime = this.superValue.dateTimeRange && this.superValue.dateTimeRange[1]
      }
      delete params.dateTimeRange
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      this.commonDateReset()
      // 重置的入参
      const params = {
        pageIndex: 0,
        ...this.superValue
      }
      if (this.superValue && this.superValue.dateTimeRange && this.superValue.dateTimeRange.length > 0) {
        params.startAuditionTime = this.superValue.dateTimeRange && this.superValue.dateTimeRange[0]
        params.endAuditionTime = this.superValue.dateTimeRange && this.superValue.dateTimeRange[1]
      }
      delete params.dateTimeRange
      this.formValue = {}
      this.$refs.tableCommon.getList(params)
    },
    /** 高级搜索 */
    onSearch(superValue) {
      this.superValue = superValue
      const params = {
        ...this.superValue,
        ...this.formValue
        // sellerName: superValue.sellerName || '',
        // startAuditionTime: superValue.dateTimeRange && superValue.dateTimeRange[0],
        // endAuditionTime: superValue.dateTimeRange && superValue.dateTimeRange[1]
      }
      const dateArr = this.commonDateOptions.pickerDateArr || []
      if (dateArr && dateArr.length > 0) {
        params.startAuditionTime = dateArr[0]
        params.endAuditionTime = dateArr[1]
      }
      if (params.dateTimeRange && params.dateTimeRange.length > 0) {
        params.startAuditionTime = params.dateTimeRange && params.dateTimeRange[0]
        params.endAuditionTime = params.dateTimeRange && params.dateTimeRange[1]
      }
      delete params.dateTimeRange
      this.$refs.tableCommon.getList(params)
    },
    /** 高级清除 */
    onClear() {
      const params = {
        pageIndex: 0,
        ...this.formValue
      }
      const dateArr = this.commonDateOptions.pickerDateArr || []
      if (dateArr && dateArr.length > 0) {
        params.startAuditionTime = dateArr[0]
        params.endAuditionTime = dateArr[1]
      }
      this.superValue = {}
      this.$refs.tableCommon.getList(params)
    },
    getUpdateTable() {
      this.qureyListFun()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .page_title_text {
    font-weight: 500;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(238, 238, 238, 1);
    margin-bottom: 20px;
    padding-left: 0;
  }
}
.offlineAudition_container /deep/ {
  .search {
    display: flex;
    justify-content: space-between;
    height: 48px;
  }
  .quick_search {
    margin-bottom: 15px;
    span {
      color: rgba(102, 102, 102, 1);
      text-decoration: underline;
      margin-right: 20px;
      cursor: pointer;
    }
    span:nth-child(1) {
      text-decoration: none;
      color: rgba(51, 51, 51, 1);
    }
  }
  .table_checked_box {
    margin: 20px 0 16px;
    .table_checked_text {
      margin-right: 10px;
    }
    .checked_nums {
      margin: 0 3px;
      color: #46b6ee;
    }
  }
}
</style>
<style lang="scss">
.offlineAudition_container {
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
