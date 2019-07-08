import { mapState, mapActions } from 'vuex'
import { getStock } from '@/api/crm/market/stock'
import CommonTable from '../../../../../components/CommonTable/CommonTable'
import CommonSearch from '../../../../../components/CommonSearch/CommonSearch'
export default {
  components: {
    CommonTable,
    CommonSearch
  },
  data() {
    return {
      listQuery: {
        show: true // 是否显示
      },
      columns: [
        {
          label: '日期',
          prop: 'date',
          isShowTooltip: true,
          isShowSet: false,
          render: (h, params) => {
            return h(
              'div',
              {
                class: 'date',
                on: {
                  click: () => {
                    this.editNewDialog(params.row)
                  }
                }
              },
              params.row.date
            )
          }
        },
        {
          label: '创建人',
          prop: 'createName',
          isShowTooltip: true
        },
        {
          label: '备注',
          prop: 'remark',
          isShowTooltip: true
        },
        {
          label: '操作时间',
          prop: 'modifyTime',
          isShowTooltip: true
        }
      ],
      options: {
        mutiSelect: 'selection', // 是否多选
        apiService: getStock, // 表格的数据请求接口
        isSettingShow: true, // 是否出现设置
        params: { type: '8' }
      },
      tableHeight: 'calc(100vh - 266px)',
      formInline: {
        searchMethod: formValue => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '创建人',
            modelValue: 'createName',
            isClearable: true,
            itemStyle: 'width: 140px'
          },
          {
            itemType: 'datePicker',
            datePickerType: 'daterange',
            rangeSeparator: '~',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            valueFormat: 'yyyy-MM-dd',
            modelValue: 'date',
            itemStyle: 'width: 220px',
            isClearable: true
          }
        ]
      },
      formValue: {},
      checkedData: [],
      visible2: false,
      addNewDialogShow: false, // 是否显示新增弹框
      dialogTitle: '新增',
      rules: {
        date: [
          { required: true, message: '请输入库存调整日期', trigger: 'change' }
        ]
      },
      addNewData: {
        date: '',
        allTotal: 0,
        remark: ''
      },
      addDataTble: [
        {
          product: {},
          id: '',
          unit: '',
          num: 1,
          purPrice: 0,
          total: 0
        }
      ],
      rowId: ''
    }
  },

  computed: {
    ...mapState('stock', [
      'loading',
      'goodList',
      'stockDetail',
      'dialogLoading'
    ])
  },

  methods: {
    ...mapActions('stock', [
      'deleteStock',
      'getGoods',
      'addStock',
      'getStockDetail',
      'editStock'
    ]),

    /** 删除库存 */
    deleteStockAction() {
      this.visible2 = false
      const ids = []
      this.checkedData.forEach(item => {
        ids.push(item.id)
      })
      this.deleteStock({
        ids,
        callback: this.searchHandle.bind(this, { type: '8', pageIndex: 0 })
      })
    },

    /* 新增弹框显示 */
    addNewDialog() {
      this.dialogTitle = '新增'
      this.rowId = ''
      this.addNewDialogShow = !this.addNewDialogShow
      this.getGoods()
    },
    /* 关闭新增弹框 */
    cancelDialog(formName) {
      this.addNewDialogShow = false
      this.$refs[formName].resetFields()
      this.addDataTble = [
        {
          product: {},
          id: '',
          unit: '',
          num: 1,
          purPrice: 0,
          total: 0
        }
      ]
    },

    /** 选择物品名称 */
    nameChange(index, value) {
      let count = 0
      const newData = [...this.addDataTble]
      newData[index].unit = value.unit
      newData[index].purPrice = parseFloat(value.price)
      newData[index].total = parseFloat(value.price)
      newData[index].num = 1
      newData.forEach(item => {
        count += parseFloat(item.total)
      })
      this.addDataTble = newData
      this.addNewData.allTotal = count
    },
    /** 数量变化 */
    numChange(index, value) {
      let count = 0
      const newData = [...this.addDataTble]
      newData[index].total = value * newData[index].purPrice
      newData.forEach(item => {
        count += item.total
      })
      this.addDataTble = newData
      this.addNewData.allTotal = count
    },
    /** 单价变化 */
    priceChange(index, value) {
      let count = 0
      const newData = [...this.addDataTble]
      newData[index].total = value * newData[index].num
      newData.forEach(item => {
        count += item.total
      })
      this.addDataTble = newData
      this.addNewData.allTotal = count
    },

    /* 确认提交新增 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const list = []
          const newValues = { ...this.addNewData }
          const newData = [...this.addDataTble]
          let proListFlag = false
          newData.forEach(item => {
            if (item.product && !item.product.id) {
              this.$message.error('请选择物品！')
              proListFlag = true
            }
            list.push({
              createName: this.formInline.createName,
              proId: item.product.id,
              purPrice: item.purPrice,
              num: item.num
            })
          })
          if (proListFlag) {
            return
          }
          newValues.list = list
          newValues.type = '8'
          if (this.dialogTitle === '编辑') {
            newValues.id = this.rowId
          }

          const params = {
            name: this.formInline.createId,
            beginTime: this.formInline.date && this.formInline.date[0],
            endTime: this.formInline.date && this.formInline.date[1],
            pageIndex: 0
          }
          const payload = {
            values: newValues,
            refresh: this.searchHandle.bind(this, params),
            close: this.cancelDialog.bind(this, 'addNewForm')
          }

          if (this.dialogTitle === '新增') {
            this.addStock(payload)
          } else {
            this.editStock(payload)
          }
        } else {
          return false
        }
      })
    },
    /* 弹框中新增表格行 */
    addTableRow() {
      const rowData = {
        product: {},
        id: '',
        unit: '',
        num: 1,
        purPrice: 0,
        total: 0
      }
      this.addDataTble.push(rowData)
    },

    /* 编辑弹框表单赋值 */
    setDialog() {
      this.addNewData = {
        date: this.stockDetail.date,
        allTotal: this.stockDetail.totalMoney,
        remark: this.stockDetail.remark
      }

      const editList = [...this.stockDetail.list]
      const newList = []
      editList.forEach(item => {
        const product = {
          id: item.proId,
          name: item.proName,
          price: parseFloat(item.purPrice),
          unit: item.unit
        }
        newList.push({
          product,
          id: item.id,
          unit: item.unit,
          num: parseFloat(item.num),
          purPrice: parseFloat(item.purPrice),
          total: parseFloat(item.totalMoney)
        })
      })
      this.addDataTble = newList
    },
    /* 编辑弹框显示 */
    editNewDialog(row) {
      this.dialogTitle = '编辑'
      this.rowId = row.id
      this.addNewDialogShow = !this.addNewDialogShow
      this.getGoods()
      this.getStockDetail({ id: row.id, set: this.setDialog })
    },

    /* 弹框表格删除一行 */
    deleteTableRow(val) {
      const rowIndex = this.addDataTble.indexOf(val)
      const count = this.addNewData.allTotal - parseInt(val.total)
      this.addNewData.allTotal = count
      this.addDataTble.splice(rowIndex, 1)
    },

    /* 搜索 */
    searchHandle(formValue) {
      this.formValue = formValue
      const params = {
        type: '8',
        ...this.formValue
        // createName: this.formInline.createName,
        // beginTime: this.formInline.date && this.formInline.date[0],
        // endTime: this.formInline.date && this.formInline.date[1],
        // ...searchValue
      }
      if (params && params.date && params.date.length > 0) {
        params.beginTime = params.date && params.date[0]
        params.endTime = params.date && params.date[1]
      }
      delete params.date
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      const params = {
        pageIndex: 0,
        type: '8'
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 选择数据条数操作 */
    selectionChange(val) {
      this.checkedData = val
    }
  }
}
