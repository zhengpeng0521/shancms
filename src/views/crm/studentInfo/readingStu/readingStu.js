import {
  getZjlCRMStuList, // 在读学员列表
  getStuMsg, // 学员详情
  querySubName // 用户下拉树
} from '@/api/crm/studentInfo/readingStu.js'
import CommonTable from './../../../../components/CommonTable/CommonTable'
import CommonSearch from './../../../../components/CommonSearch/CommonSearch'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
import CommonDateSearch from '../../../../components/CommonDateSearch/CommonDateSearch'
import DistributeDialog from './components/distributeDialog.vue'
import TeachDistributeDialog from './components/teachDistributeDialog.vue'
import serviceDistributeDialog from './components/serviceDistributeDialog.vue' // 分配给客服
import VisitDialog from './../lantentStu/components/visitDialog.vue'
import ListenDialog from './../../auditionMgr/components/addAuditionDialog.vue'
import ApplyDialog from './../../contractMgr/components/contractOrderDialog.vue'
import CrmDetailModal from '@/components/CrmDetailModal'
import AddLantentStuDialog from './../lantentStu/components/addLantentStuDialog.vue'
import TurnOtherDialog from './../lantentStu/components/turnOtherDialog.vue'
import { exportFile } from '@/utils/exportFile'
import ParentBindWX from './components/parentBindWX.vue'
import NameImportDialog from './components/nameImportDialog.vue'
import SubUserSelect from './../../../../components/SubUserSelect/SubUserSelect.vue'
import bindingFace from './components/bindingFace.vue' // 绑定人脸的弹窗
export default {
  components: {
    CommonTable,
    CommonSearch,
    AdvancedSearch,
    CommonDateSearch,
    ParentBindWX, // 家长绑定微信
    CrmDetailModal, // 侧边详情弹框
    DistributeDialog, // 分配转给他人弹框
    TeachDistributeDialog, // 教师分配在读学员
    serviceDistributeDialog, // 分配给客服
    VisitDialog, // 到访弹框
    ListenDialog, // 试听弹框
    ApplyDialog, // 报名弹框
    AddLantentStuDialog, // 侧边新建潜在学员 报名 弹框
    TurnOtherDialog, // 转给他人弹框
    NameImportDialog, // 导入
    SubUserSelect, // 用户下拉树
    bindingFace
  },
  data() {
    return {
      listQuery: {
        show: true // 是否显示
      },
      columns: [
        {
          label: '学员姓名',
          prop: 'name',
          isShowTooltip: true,
          width: '120',
          render: (h, params) => {
            // eslint-disable-next-line
            if (params.row.sex == "2") {
              return h(
                'div',
                {
                  on: {
                    click: () => {
                      this.openSideDetail(params.row)
                    }
                  }
                },
                [
                  h(
                    'div',
                    {
                      style: 'margin-right:10px;float:left;max-width: 80px;',
                      class: 'stuName'
                    },
                    params.row.name
                  ),
                  h('img', {
                    attrs: {
                      src:
                        'https://img.ishanshan.com/gimg/n/20190318/03fdc2ea05f27c74f5d8c706ef4f03c0'
                    }
                  })
                ]
              )
              // eslint-disable-next-line
            } else if (params.row.sex == "1") {
              return h(
                'div',
                {
                  on: {
                    click: () => {
                      this.openSideDetail(params.row)
                    }
                  }
                },
                [
                  h(
                    'div',
                    {
                      style: 'margin-right:10px;float:left;max-width: 80px;',
                      class: 'stuName'
                    },
                    params.row.name
                  ),
                  h('img', {
                    attrs: {
                      src:
                        'https://img.ishanshan.com/gimg/n/20190318/d56924830405313c7dc47fbc1763f10e'
                    }
                  })
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
                },
                params.row.name
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
                params.row.parents &&
                  params.row.parents.map((item, index) => {
                    return h('span', item.name + ' ')
                  })
              )
            ])
          }
        },
        {
          label: '手机号',
          prop: 'title',
          isShowTooltip: true,
          render: (h, params) => {
            return h('span', {}, [
              h(
                'el-popover',
                {
                  props: { placement: 'top', trigger: 'hover' }
                },
                [
                  h(
                    'span',
                    params.row.parents &&
                      params.row.parents.length > 0 &&
                      params.row.parents.map(item => {
                        return h(
                          'span',
                          item.name + ':' + item.mobile + ' ' + ','
                        )
                      })
                  ),
                  h('a', ' ' + '拨打'),
                  h('a', { slot: 'reference' }, '查看')
                ]
              )
            ])
          }
        },
        {
          label: '绑定微信',
          prop: 'open_id',
          isShowTooltip: true,
          render: (h, params) => {
            return h('span', {}, [
              h(
                'span',
                params.row.parents &&
                  params.row.parents.map((item, index) => {
                    // eslint-disable-next-line
                    if (item.open_id == "" || item.open_id == null) {
                      return h('span', ' ')
                    } else {
                      return h('span', '已绑定' + ' ')
                    }
                  })
              )
            ])
          }
        },
        {
          label: '绑定人脸',
          align: 'center',
          prop: 'bindingFace',
          isShowTooltip: true,
          width: '120px;',
          render: (h, params) => {
            // eslint-disable-next-line
            if (params.row.faceBindingNum >= '1') {
              return h(
                'div',
                {
                  on: {
                    click: () => {
                      this.bindingFace(params.row)
                    }
                  }
                },
                [
                  h(
                    'span',
                    {
                      style: 'display:inline-block;width:8px;height:8px;background-color: rgb(136, 199, 10);border-radius: 50px;margin-right: 5px;margin-top: 7px;float:left;'
                    }
                  ),
                  h(
                    'div',
                    {
                      style: 'float:left;',
                      class: 'stuName'
                    },
                    '已绑定'
                  ),
                  h(
                    'span',
                    {
                      style: 'display:inline-block;text-overflow:ellipsis;float:left;color:#409EFF;'
                    },
                    params.row.faceBindingNum + '/' + params.row.canFaceBindingNum
                  )
                ]
              )
            // eslint-disable-next-line
            } else {
              return h(
                'div',
                {
                  on: {
                    click: () => {
                      this.bindingFace(params.row)
                    }
                  }
                },
                [
                  h(
                    'span',
                    {
                      style: 'display:inline-block;width:8px;height:8px;background-color: rgb(255, 127, 117);border-radius: 50px;margin-right: 5px;margin-top: 7px;float:left;'
                    }
                  ),
                  h(
                    'div',
                    {
                      style: 'float:left;',
                      class: 'stuName'
                    },
                    '未绑定'
                  ),
                  h(
                    'span',
                    {
                      style: 'display:inline-block;text-overflow:ellipsis;float:left;color:#409EFF;'
                    },
                    params.row.faceBindingNum + '/' + params.row.canFaceBindingNum
                  )
                ]
              )
            }
          }
        },
        {
          label: '昵称',
          prop: 'nickName',
          isShowTooltip: true
        },
        {
          label: '生日',
          prop: 'birthday',
          isShowTooltip: true
        },
        {
          label: '年龄(月龄)',
          prop: 'age',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            const age = row.age || '0'
            const month = row.month || '0'
            return `<div style="text-overflow:ellipsis;overflow:hidden">${age +
              ' (' +
              month +
              ')'}</div>`
          }
        },
        {
          label: '学员账户',
          prop: 'stuCardId',
          isShowTooltip: true
        },
        {
          label: '最后跟进时间',
          prop: 'followRecordTime',
          isShowTooltip: true,
          isColShow: false,
          width: 120
        },
        {
          label: '最后跟进记录',
          prop: 'content',
          isShowTooltip: true,
          isColShow: false,
          width: 120
        },
        {
          label: '下次跟进时间',
          prop: 'nextFollowTime',
          isShowTooltip: true,
          isColShow: false,
          width: 120
        },
        {
          label: '负责销售',
          prop: 'sellerName',
          isShowTooltip: true
        },
        {
          label: '负责老师',
          prop: 'counselorName',
          isShowTooltip: true
        },
        {
          label: '负责客服',
          prop: 'waiterName',
          isShowTooltip: true
        },
        {
          label: '一级来源',
          prop: 'channel',
          isShowTooltip: true,
          isColShow: false
        },
        {
          label: '二级来源',
          prop: 'secondChannel',
          isShowTooltip: true,
          isColShow: false
        }
      ],
      options: {
        noMount: true,
        mutiSelect: true, // 是否多选
        apiService: getZjlCRMStuList, // 表格的数据请求接口
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
            method: row => {
              this.openVisitDialog(row)
            }
          },
          {
            label: '试听',
            type: 'normal',
            method: row => {
              this.openListenDialog(row)
            }
          },
          {
            label: '报名',
            type: 'normal',
            method: row => {
              this.openApplyDialog(row)
            }
          }
        ]
      },
      formInline: {
        searchMethod: formValue => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '学员姓名/电话号码',
            modelValue: 'mobileOrStuName',
            isFilterable: true,
            isClearable: true
          },
          {
            itemType: 'select',
            placeholder: '微信绑定状态',
            modelValue: 'wxBind',
            isClearable: true,
            itemStyle: 'width:140px',
            selectOption: [
              {
                label: '已绑定',
                value: '1'
              },
              {
                label: '未绑定',
                value: '0'
              }
            ]
          }
        ]
      },
      // 高级搜索
      superSearch: {
        onClear: () => {
          this.onClear()
        },
        onSearch: superValue => {
          this.onSearch(superValue)
        },
        fields: [
          {
            type: 'select',
            key: 'isBindFace',
            label: '人脸绑定状态',
            optionValue: 'id',
            optionLabel: 'name',
            options: [{ id: '0', name: '未绑定' }, { id: '1', name: '已绑定' }]
          },
          {
            type: 'select',
            key: 'waiterId',
            label: '负责客服',
            optionValue: 'id',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`
          },
          {
            type: 'select',
            key: 'counselorName',
            label: '负责老师',
            optionValue: 'name',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`
          },
          {
            type: 'select',
            key: 'channel',
            label: '一级来源',
            optionValue: 'key',
            optionLabel: 'value',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/dict/dictGetByKey`,
            asyncParams: {
              dictkey: 'firstChannel'
            }
          },
          {
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
          },
          {
            type: 'input',
            key: 'cardId',
            label: '学员账户'
          },
          {
            type: 'input',
            key: 'nickName',
            label: '昵称'
          },
          {
            type: 'input',
            key: 'age',
            label: '年龄'
          },
          {
            type: 'input',
            key: 'month',
            label: '月龄'
          },
          {
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
            type: 'dateTimePicker',
            key: 'nextFollowTime',
            label: '下次跟进时间',
            dateType: 'datetime',
            defaultTime: ['00:00:00', '23:59:59'],
            isRange: true,
            format: 'yyyy-MM-dd HH:mm',
            valueFormat: 'yyyy-MM-dd HH:mm'
          },
          {
            type: 'dateTimePicker',
            key: 'finalFollowTime',
            label: '最后跟进时间',
            defaultTime: ['00:00:00', '23:59:59'],
            isRange: true,
            format: 'yyyy-MM-dd HH:mm',
            valueFormat: 'yyyy-MM-dd HH:mm'
          },
          {
            type: 'select',
            key: 'sex',
            label: '性别',
            optionValue: 'id',
            optionLabel: 'name',
            options: [{ id: '1', name: '男' }, { id: '2', name: '女' }]
          }
        ]
      },

      idObj: {},
      superValue: {}, // 高级搜索内容
      checkedData: '',
      commonDateOptions: {
        mainText: '学员生日:',
        defaultDate: [],
        options: ['today', 'thisMonth'],
        markText: { today: '0', thisMonth: '0' },
        pickerDateArr: []
      },
      // 侧边内容详情
      detailProps: {
        btns: [
          {
            type: 'primary',
            label: '报名',
            clickHandle: this.clickOne.bind(this, '1')
          },
          {
            class: 'cancel_btn',
            label: '编辑',
            btnId: '402000003',
            clickHandle: this.clickOne.bind(this, '2')
          },
          {
            class: 'cancel_btn',
            label: '转给他人',
            clickHandle: this.clickOne.bind(this, '3')
          }
        ],
        headerInfo: [{ label: '负责销售', key: 'saler' }],
        // 在读学员学员详情弹窗基础信息内容
        baseInfo: [
          { label: '姓名', key: 'name' },
          { label: '性别', key: 'sex' },
          { label: '生日', key: 'birthday' },
          { label: '年龄', key: 'age' },
          { label: '月龄', key: 'month' },
          { label: '年级', key: 'grade' },
          { label: '星座', key: 'constellation' },
          { label: '民族', key: 'nation' },

          { label: '人脸', key: 'isFaceBiding' },

          { label: '特长', key: 'speciality' },
          { label: '爱好', key: 'hobby' },
          { label: '血型', key: 'bloodType' },
          { label: '学校', key: 'schaddress' },
          { label: '社保号码', key: 'socialSecurityNum' },
          { label: '学员类型', key: 'stuReading' },
          { label: '联系地址', key: 'conaddress' },
          { label: '一级来源', key: 'first' },
          { label: '二级来源', key: 'second' },
          { label: '备注', key: 'remark' }
        ],
        defaultTab: 'leadsRecord'
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
      studentName: '',
      detail: {},
      checkedRowlist: [],
      rowInfo: {},
      userBranchOptions: [],
      userBranchSelected: '0',
      operatorType: 0, // 操作类型, 0.全部,1.我的, 2.我的下属
      operatorUser: '' // 查询用户
    }
  },
  mounted() {
    // 根据路由默认查询
    const route = this.$router.history.current.params
    if (route.activeTab === 'readingStu') {
      if (route.action === 'thisMonthBirthday') {
        this.$refs.commonDatePicker.thisMonthClick()
        this.$refs.commonDatePicker.checkedIndex = 'thisMonth'
      }
    }
    const routerDateType = route && route.routerDateType
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

    this.querySubUser()
    this.getZjlCRMStuListFun()
  },
  methods: {
    /** 查询下属 */
    querySubUser() {
      const userBranchOptions = [
        { id: '0', type: 0, name: '全部', children: [] },
        { id: '1', type: 1, name: '我的', children: [] }
      ]
      const children = []
      const self = this
      querySubName().then(res => {
        if (res.data.errorCode === 0) {
          const results = res.data.data
          if (results && results.length > 0) {
            results.map(item => {
              children.push({
                pid: '2',
                id: item.id,
                name: item.name,
                type: 2
              })
            })
            userBranchOptions.push({
              id: '2',
              type: 2,
              name: '我的下属',
              children: children
            })
            self.userBranchOptions = userBranchOptions
          }
        }
      })
      this.userBranchSelected = '0'
      this.userBranchOptions = userBranchOptions
    },
    /* 在读学员列表数据 */
    getZjlCRMStuListFun() {
      const self = this
      getZjlCRMStuList().then(res => {
        if (res.data.errorCode === 0) {
          self.commonDateOptions.markText = {
            today: res.data.dayCount || 0,
            thisMonth: res.data.monthCount || 0
          }
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 侧边详情弹框 */
    openSideDetail(row) {
      this.rowInfo = row
      const params = {
        stuId: row.id
      }
      getStuMsg(params).then(res => {
        if (res.data.errorCode === 0) {
          this.detail = res.data.data
          this.idObj = {
            ...row,
            source: '1',
            stuId: row.id,
            stuName: this.detail.name
          }
          this.studentName = this.detail.name
          this.headerData = {
            saler: this.detail.sellerName,
            followStatus: this.detail.studentFollowStateName
          }
          this.baseData = {
            name: this.detail.name,
            sex:
              // eslint-disable-next-line
              this.detail.sex == "1"
                ? '男'
                : this.detail.sex === '2'
                  ? '女'
                : "", // eslint-disable-line
            birthday: this.detail.birthday,
            isFaceBiding:
              // eslint-disable-line
              this.detail.isFaceBiding === '0' || ''
                ? '未绑定'
                : this.detail.isFaceBiding === '1'
                  ? '已绑定' : '未绑定',
            age: this.detail.age,
            month: this.detail.month,
            nation: this.detail.nation,
            hobby: this.detail.hobby,
            grade: this.detail.grade,
            constellation: this.detail.constellation,
            speciality: this.detail.speciality,
            bloodType: this.detail.bloodType,
            schaddress: this.detail.schaddress,
            socialSecurityNum: this.detail.socialSecurityNum,
            stuReading: '在读',
            remark: this.detail.remark,
            conaddress: this.detail.conaddress,
            first: this.detail.channelName,
            second: this.detail.secondChannelName
          }
          this.$refs.crmDetailModal.show()
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 在读学员导入弹框 */
    nameImportDialog() {
      this.$refs.nameImportDialog.showDialog()
    },
    /* 详情按钮 */
    clickOne(type) {
      // 学员报名弹框
      // eslint-disable-next-line
      if (type == "1") {
        this.$refs.applyDialog.showDialog('add', this.rowInfo)
      }
      // 编辑学员信息
      // eslint-disable-next-line
      if (type == "2") {
        this.$refs.addLantentStuDialog.showDialog('editRead', this.detail)
      }
      // 转给他人弹框
      // eslint-disable-next-line
      if (type == "3") {
        this.$refs.distributeDialog.showDialog('returnInfo', this.rowInfo)
      }
    },
    /* 选择数据条数操作 */
    selectionChange(val) {
      this.checkedData = val.length
      this.checkedRowlist = val
    },
    /* 更新在读学员列表 */
    getReadingStuList() {
      this.$refs.crmDetailModal.visible = false
      const params = {
        ...this.formValue,
        pageIndex: 0
      }
      this.searchHandle(params)
    },
    /* 合同导出 */
    exportReadingStu() {
      const params = {
        mobileOrStuName: this.formInline.mobileOrStuName,
        wxBind: this.formInline.wxBind,
        ...this.superValue
      }
      for (const key in params) {
        if (!params[key]) {
          delete params[key]
        }
      }
      if (this.$refs.tableCommon.totalCount > 0) {
        exportFile(
          `${window.SS_CRM}/crm/stuInfo/stu/exportCrmStudentInfo`,
          params
        )
      } else {
        this.$message.error('暂无数据导出')
      }
    },
    // 绑定人脸弹窗
    bindingFace(row) {
      this.$refs.bindingFace.showDialog(row)
    },

    /* 微信家长绑定弹框 */
    parentBindWX() {
      this.$refs.parentBindWX.showDialog()
    },
    /* 分配弹框 */
    distributeDialog(num) {
      this.$refs.distributeDialog.showDialog(num, this.checkedRowlist)
    },
    /* 老师分配学员 */
    teachDistributeDialog() {
      this.$refs.teachDistribute.showDialog(this.checkedRowlist)
    },

    // 分配客服
    serviceDistributeDialog() {
      this.$refs.serviceDistributeDialog.showDialog(this.checkedRowlist)
    },

    /* 清除多选 */
    getClearData() {
      this.$refs.tableCommon.clearSelection()
    },
    /* 到访弹框 */
    openVisitDialog(row) {
      this.$refs.visitDialog.showDialog(row)
    },
    /* 试听弹框 */
    openListenDialog(row) {
      row.stuId = row.id
      row.source = '1'
      this.$refs.listenDialog.showDialog('edit', row)
    },
    /* 更新表格数据 */
    getUpdateTable() {
      const params = {
        ...this.formValue,
        pageIndex: 0
      }
      this.searchHandle(params)
    },

    /** 详情变动更新表格 */
    detailUpdateTable() {
      const params = {
        ...this.formValue,
        pageIndex: this.$refs.tableCommon.pageIndex - 1
      }
      this.searchHandle(params)
    },

    /* 更新详情数据 */
    getUpdateDetailData(row) {
      this.openSideDetail(row)
    },
    /* 报名弹框 */
    openApplyDialog(row) {
      this.$refs.applyDialog.showDialog('add', row, '1')
    },
    /* 公用日期选择改变事件 */
    commonDatePickerChange(arr) {
      const params = {}
      this.commonDateOptions.pickerDateArr = arr
      if (
        this.commonDateOptions.pickerDateArr &&
        this.commonDateOptions.pickerDateArr.length > 0
      ) {
        params.startBirthday = this.commonDateOptions.pickerDateArr[0]
        params.endBirthday = this.commonDateOptions.pickerDateArr[1]
      }
      this.$refs.tableCommon.getList(params)
    },
    /** 公用日期选择重置事件 */
    commonDateReset() {
      this.$refs.commonDatePicker.commonDateReset()
    },
    /* 搜索时间处理 */
    getTimeSearch(params) {
      if (this.superValue.birthday && this.superValue.birthday.length > 0) {
        params.startBirthday = this.superValue.birthday[0]
        params.endBirthday = this.superValue.birthday[1]
      }
      if (
        this.superValue.nextFollowTime &&
        this.superValue.nextFollowTime.length > 0
      ) {
        params.startNextFollowTime = this.superValue.nextFollowTime[0]
        params.endNextFollowTime = this.superValue.nextFollowTime[1]
      }
      if (
        this.superValue.finalFollowTime &&
        this.superValue.finalFollowTime.length > 0
      ) {
        params.startLastFollowTime = this.superValue.finalFollowTime[0]
        params.endLastFollowTime = this.superValue.finalFollowTime[1]
      }
      if (
        this.superValue.createTime &&
        this.superValue.createTime.length > 0
      ) {
        params.startCreateTime = this.superValue.createTime[0]
        params.endCreateTime = this.superValue.createTime[1]
      }
      delete params.birthday
      delete params.createTime
      delete params.nextFollowTime
      delete params.finalFollowTime
    },
    /* 搜索 */
    searchHandle(formValue) {
      // 用户权限选择
      const userBranchParams = {}
      if (this.userBranchSelected === '0' || this.userBranchSelected === '1') {
        // 全部、我的
        userBranchParams.operatorType = this.userBranchSelected
      } else if (parseFloat(this.userBranchSelected) > 1) {
        // 我的下属
        userBranchParams.operatorType = '2'
        if (this.userBranchSelected !== '2') {
          // 选择的下属
          userBranchParams.uids = this.userBranchSelected
        }
      }
      this.formValue = formValue
      // 搜索的入参
      const params = {
        ...this.formValue,
        ...this.superValue,
        ...userBranchParams
      }
      const dateArr = this.commonDateOptions.pickerDateArr || []
      if (dateArr && dateArr.length > 0) {
        params.startBirthday = dateArr[0]
        params.endBirthday = dateArr[1]
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
      // this.commonDateReset()
      // this.formValue = {}
      // this.$refs.tableCommon.getList(params)
      this.userBranchSelected = '0'
      this.$refs.commonDatePicker.commonDateReset()
      this.searchHandle({})
    },
    /** 高级搜索 */
    onSearch(superValue) {
      // 用户权限选择
      const userBranchParams = {}
      if (this.userBranchSelected === '0' || this.userBranchSelected === '1') {
        // 全部、我的
        userBranchParams.operatorType = this.userBranchSelected
      } else if (parseFloat(this.userBranchSelected) > 1) {
        // 我的下属
        userBranchParams.operatorType = '2'
        if (this.userBranchSelected !== '2') {
          // 选择的下属
          userBranchParams.uids = this.userBranchSelected
        }
      }
      this.superValue = superValue
      const params = {
        ...this.superValue,
        ...this.formValue,
        ...userBranchParams
      }
      const dateArr = this.commonDateOptions.pickerDateArr || []
      if (dateArr && dateArr.length > 0) {
        params.startBirthday = dateArr[0]
        params.endBirthday = dateArr[1]
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
      // const dateArr = this.commonDateOptions.pickerDateArr || []
      // if (dateArr && dateArr.length > 0) {
      //   params.startBirthday = dateArr[0]
      //   params.endBirthday = dateArr[1]
      // }
      // this.superValue = {}
      // this.$refs.tableCommon.getList(params)
      this.onSearch({})
    },
    /** 导入后刷新列表 */
    refresh() {
      // const params = {
      //   ...this.superValue,
      //   ...this.formValue
      // }
      // if (
      //   this.commonDateOptions.pickerDateArr &&
      //   this.commonDateOptions.pickerDateArr.length > 0
      // ) {
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
    }
  }
}
