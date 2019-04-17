import {
  getOrderNum, // 自动生成合同编号
  queryCRMStuList, // 学员精确查询
  queryTeachingAid, // 物资下拉数据查询
  queryContractProduct, // 课时包下拉数据查询
  summaryQueryTenantUser, // 关联销售下拉数据查询
  summaryQuery, // 课程下拉数据查询
  queryPaymentAccountList, // 收款方式列表查询
  queryPurchaseConf, // 合同规则查询
  addClassOrder, // 确定新增合同
  updateClassOrder, // 确定编辑合同
  parentList // 潜在学员根据id获取家长信息
} from '@/api/crm/contract/contract.js'
import { getParentList } from '@/api/crmDetail/crmDetail'
import ExactSearchDialog from './../../integralMgr/components/exactSearchDialog.vue'
import GatheringDialog from './gatheringDialog.vue'
import ReadingStuDialog from './../../studentInfo/readingStu/components/readingStuDialog.vue'
import moment from 'moment'
export default {
  components: {
    ExactSearchDialog, // 精确查找弹框
    GatheringDialog, // 保存收款弹框
    ReadingStuDialog // 在读学员列表弹窗
  },
  data() {
    return {
      targetStuId: '',
      readStuName: '',
      isSelectReadingStu: false,
      contractOrderDialogShow: false,
      isShowCardNum: true,
      isGiveInfoShow: true, // 课时包的赠课显示
      isGiveInfoFalse: false, // 托班的赠课显示
      isSelectClassShow: false,
      studentType: '1', // 1-学员类型为在读,0-学员类型为潜在
      contractOrderData: {
        stuId: '', // 学员id
        orderType: '2', // 合同类型
        orderNum: '', // 合同编号
        stuCardId: '', // 会员卡号 学员账户
        parentId: '', // 签约家长id
        signType: '0', // 签约类型
        shopTableList: [
          {
            pid: '',
            price: '0.00',
            aTotalPrice: '0.00',
            preferentialPrice: '0.0元/0.0折',
            amount: '1',
            money: '0'
          }
        ], // 商品课时
        goodsTableList: [
          // 物资数据
          {
            taId: '',
            price: '0.00',
            aTotalPrice: '0.00',
            preferentialPrice: '0.0元/0.0折',
            amount: '1',
            money: '0'
          }
        ],
        atotalPrice: '', // 总金额
        atotalRealPrice: '', // 总实收
        sellTableList: [
          // 关联销售数据
          {
            userId: '',
            rate: '100'
          }
        ],
        giveClass: true, // 赠送课时选框
        giveDatas: '', // 赠送天数
        giveType: '1', // 赠课类型
        giveTime: '0', // 赠送课时
        giveAllPrice: '0', // 赠课总成本
        giveBeacuse: '', // 赠课原因
        imgUrl: '', // 上传图片
        data: '', // 合同签订日
        picker: '', // 合同期限
        expireCheck: '', // 过期课时自动作废 单选框
        detail: '', // 备注
        selectClasses: '', // 选择课程
        startTime: '',
        endTime: ''
      },
      rules: {
        orderType: [
          { required: true, message: '请选择订单类型', trigger: 'change' }
        ],
        orderNum: [
          { required: true, message: '请输入合同编号', trigger: 'change' }
        ],
        stuId: [{ required: true, message: '请选择学员', trigger: 'change' }],
        parentId: [
          {
            required: true,
            message: '请输入家长姓名或手机号',
            trigger: 'change'
          }
        ],
        signType: [
          { required: true, message: '请选择签约类型', trigger: 'change' }
        ],
        data: [
          { required: true, message: '请输入合同签订日', trigger: 'change' }
        ]
      },
      giveClassBecause: [
        // 快速选择赠课原因
        {
          key: '1',
          value: '课时包赠送'
        },
        {
          key: '2',
          value: '转介绍赠课'
        },
        {
          key: '3',
          value: '活动奖励赠课'
        }
      ],
      expireCheck: false, // // 过期课时自动作废
      isExpireCheckShow: false, // 自动作废课时 显隐
      packageStatus: '0', // 课时套餐规则
      materialStatus: '0', // 物资规则
      classPriceTotal: 0, //
      classRealPriceTotal: 0,
      materialPriceAll: 0,
      materialRealPriceAll: 0,
      disabledClass: false, // 课时套餐 实收价格禁用
      disabledMaterial: false, // 物资套餐 实收价格禁用
      allStudentList: [], // 所有学员下拉数据
      allParentList: [], // 所有签约家长下拉数据
      allTeachList: [], // 所有物资下拉数据
      allClassesList: [], // 所有课时包下拉数据
      allTenantUserList: [], // 所有销售下拉数据
      allCourseDataList: [], // 所有课程下拉数据
      imgVisible: false, // 图片上传显隐
      classImgVisible: false,
      disabledType: false, // 订单类型是否禁用
      fileList: [], // 图片列表
      rowlistData: '', // 是否新增编辑
      rowInfo: {} // 潜在学员点击某个学员获取的数据
    }
  },
  methods: {
    afterReadingStuDialogSumit(val) {
      if (val) {
        this.isSelectReadingStu = true
        this.targetStuId = val.id
        this.readStuName = val.name
      } else {
        this.isSelectReadingStu = false
        this.targetStuId = ''
        this.readStuName = ''
      }
    },
    showReadingStuDialog() {
      this.$refs.readingStuDialog.showDialog()
    },

    /**
     *
     * @param {*} rowlist
     * @param {*} row
     * @param {*} studentType 0-潜在学员 1-在读学员
     */
    showDialog(rowlist, row, studentType = '1') {
      this.contractOrderDialogShow = true
      this.studentType = studentType
      this.rowlistData = rowlist
      this.rowInfo = row
      // this.clearFromArrayData()
      // this.$refs.contractOrderForm.resetFields()
      // eslint-disable-next-line
      if (rowlist && (rowlist == 'add' || rowlist == 'readAdd')) {
        this.isExpireCheckShow = false
        this.contractOrderData.expireCheck = false
        this.contractOrderData.giveDatas = ''
        this.contractOrderData.giveClass = true
        this.contractOrderData.giveBeacuse = ''
        this.contractOrderData.picker = ''
        this.isGiveInfoShow = true
        this.contractOrderData.giveType = '1'
        if (this.rowInfo) {
          this.contractOrderData.stuId = this.rowInfo.id
          const params = {
            stuId: this.rowInfo.id
          }
          if (this.studentType === '0') {
            this.getParentByStuList(params)
          } else {
            this.getParentListFun(params)
            this.contractOrderData.stuCardId = row.stuCardId
          }
          this.queryContractProductFun('1') // 课时包下拉数据查询
          this.contractOrderData.atotalPrice = '0.0'
          this.contractOrderData.atotalRealPrice = '0.0'
          this.disabledType = false
          this.isSelectClassShow = false
          this.fileList = []
        } else {
          this.queryContractProductFun('1') // 课时包下拉数据查询
          this.contractOrderData.atotalPrice = '0.0'
          this.contractOrderData.atotalRealPrice = '0.0'
          this.disabledType = false
          this.isSelectClassShow = false
          this.fileList = []
        }
        // eslint-disable-next-line
      } // eslint-disable-next-line
      // else if (rowlist && rowlist == "readAdd") {
      //   if (this.rowInfo) {
      //     this.contractOrderData.stuId = this.rowInfo.id
      //     const params = {
      //       stuId: this.rowInfo.id
      //     }
      //     this.getParentListFun(params)
      //     this.queryContractProductFun('1') // 课时包下拉数据查询
      //     this.contractOrderData.atotalPrice = '0.0'
      //     this.contractOrderData.atotalRealPrice = '0.0'
      //     this.disabledType = false
      //     this.isSelectClassShow = false
      //     this.fileList = []
      //   } else {
      //     this.queryContractProductFun('1') // 课时包下拉数据查询
      //     this.contractOrderData.atotalPrice = '0.0'
      //     this.contractOrderData.atotalRealPrice = '0.0'
      //     this.disabledType = false
      //     this.isSelectClassShow = false
      //     this.fileList = []
      //     this.contractOrderDialogShow = !this.contractOrderDialogShow
      //   }
      // }
      else {
        const saleUserList = JSON.parse(rowlist.saleUser)
        saleUserList &&
          saleUserList.map(item => {
            item.userId = item.id
          })
        this.disabledType = true
        this.fileList = []
        let imgArray = []
        imgArray = rowlist.imgUrl.split(',')
        if (imgArray && imgArray.length > 0) {
          imgArray.map(item => {
            const obj = {
              url: item
            }
            this.fileList.push(obj)
            if (this.fileList && this.fileList.length === 9) {
              this.imgVisible = true
            }
          })
        }
        this.$nextTick(() => {
          this.contractOrderData = {
            orderId: rowlist.orderId || '',
            stuId: rowlist.stuId || '', // 学员id
            orderType: rowlist.orderType || '2', // 合同类型
            orderNum: rowlist.orderNum || '', // 合同编号
            stuCardId: rowlist.stuCardId || '', // 会员卡号 学员账户
            parentId: rowlist.parentId || '', // 签约家长id
            signType: rowlist.signType || '0', // 签约类型
            shopTableList: JSON.parse(rowlist.classpkg), // 商品课时
            goodsTableList: JSON.parse(rowlist.teachToolsSale), // 物资数据
            atotalPrice: rowlist.taOriMoney + rowlist.oriMoney || '0.0', // 总金额
            atotalRealPrice: rowlist.taMoney + rowlist.dictMoney || '0.0', // 总实收
            sellTableList: saleUserList, // 关联销售数据
            giveClass: true, // 赠送课时选框
            giveType: rowlist.extType || '1', // 赠课类型
            giveTime: rowlist.extPeriod || '0', // 赠送课时
            giveAllPrice: rowlist.extPeriodMoney || '0', // 赠课总成本
            giveBeacuse: rowlist.extPeriodReason || '', // 赠课原因
            imgUrl: this.fileList || '', // 上传图片
            data: rowlist.signTime || '', // 合同签订日
            picker: rowlist.startTime || '', // 合同期限
            // expireCheck: rowlist.expireInvalid || '', // 过期课时自动作废 单选框
            detail: rowlist.remark || '', // 备注
            selectClasses: rowlist.courseId || '' // 选择课程
          }
          if (rowlist.startTime && rowlist.endTime) {
            this.contractOrderData.picker = []
            this.contractOrderData.picker = [rowlist.startTime, rowlist.endTime]
            if (
              this.contractOrderData.picker &&
              this.contractOrderData.picker.length > 0
            ) {
              this.isExpireCheckShow = true
              // eslint-disable-next-line
              if (rowlist.expireInvalid == '1') {
                this.contractOrderData.expireCheck = true
              } else {
                this.contractOrderData.expireCheck = false
              }
            }
          } else {
            this.isExpireCheckShow = false
          }
        })
        // eslint-disable-next-line
        if (rowlist.orderType == '2') {
          this.isGiveInfoShow = true
          this.isGiveInfoFalse = false
        }
        // eslint-disable-next-line
        if (rowlist.orderType == '3') {
          this.isGiveInfoFalse = true
          this.isGiveInfoShow = false
        }
        // eslint-disable-next-line
        let orderTypeChange = rowlist.orderType == '2' ? '1' : '3'
        this.queryContractProductFun(orderTypeChange) // 课时包下拉数据查询
      }
      this.getOrderNumFun() // 自动生成合同编号
      this.queryPurchaseConfFun() // 合同规则数据
      this.queryCRMStuListFun() // 学员下拉数据查询
      this.queryTeachingAidFun() // 物资下拉数据查询
      this.summaryQueryTenantUserFun() // 关联销售下拉数据查询
      this.summaryQueryFun() // 课程下拉数据
      this.queryPaymentAccountListFun() // 收款方式列表查询
    },
    /* 潜在学员根据id获取家长信息 */
    getParentByStuList(params) {
      params.studentType = this.studentType
      parentList(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.allParentList = data.results
          this.allParentList &&
            this.allParentList.map(item => {
              item.id = item.parentId
              item.mobile = item.parentMobile
            })
          this.contractOrderData.parentId =
            this.allParentList && this.allParentList[0]
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 在读学员根据id获取家长信息 */
    getParentListFun(params) {
      getParentList(params).then(res => {
        if (res.data.errorCode === 0) {
          this.allParentList = res.data.results
          this.allParentList &&
            this.allParentList.map(item => {
              item.id = item.id
              item.mobile = item.mobile
              item.parentName = item.name
            })
          this.contractOrderData.parentId =
            this.allParentList && this.allParentList[0]
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /**
     * 赠送课时勾选处理
     */
    giveClassChange(value) {
      if (value) {
        if (this.contractOrderData.orderType === '2') {
          this.isGiveInfoShow = true
        } else if (this.contractOrderData.orderType === '3') {
          this.isGiveInfoFalse = true
        }
      } else {
        this.contractOrderData.giveClass = false
        if (this.contractOrderData.orderType === '2') {
          this.contractOrderData.giveType = '1'
          this.contractOrderData.giveTime = '0'
          this.contractOrderData.selectClasses = ''
          this.contractOrderData.giveAllPrice = '0'
          this.contractOrderData.giveBeacuse = ''
          this.isSelectClassShow = false
          this.isGiveInfoShow = false
        } else if (this.contractOrderData.orderType === '3') {
          this.isGiveInfoFalse = false
          this.contractOrderData.giveDatas = ''
          this.contractOrderData.giveBeacuse = ''
        }
      }
    },
    /* 关闭弹框 */
    cancelDialog(formName) {
      this.$refs[formName].resetFields()
      this.clearFromArrayData()
      this.contractOrderDialogShow = false
    },
    /* 确定提交弹框表单内容 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // eslint-disable-next-line
          if (this.rowlistData && this.rowlistData == 'add') {
            this.addClassOrderFun('save')
          } else {
            this.updateClassOrderFun('save')
          }
        }
      })
    },
    /* 确定编辑合同 */
    updateClassOrderFun(type) {
      const imgArray = []
      this.contractOrderData.imgUrl &&
        this.contractOrderData.imgUrl.map(item => {
          imgArray.push(item.url)
        })
      this.contractOrderData.sellTableList.map(item => {
        delete item.id
      })
      const params = {
        orderId: this.contractOrderData.orderId || '', // 订单id
        stuId: this.contractOrderData.stuId, // 学员id
        // eslint-disable-next-line
        orderType: this.contractOrderData.orderType, // 合同类型
        orderNum: this.contractOrderData.orderNum, // 合同编号
        stuCardId: this.contractOrderData.stuCardId, // 学员账户
        parentId:
          this.contractOrderData.parentId.id || this.contractOrderData.parentId, // 签约家长
        signType: this.contractOrderData.signType, // 签约类型
        classpkg: JSON.stringify(this.contractOrderData.shopTableList), // 课时包数据
        teachTools: JSON.stringify(this.contractOrderData.goodsTableList), // 物资数据
        oriMoney: this.classPriceTotal || 0, // 原价
        taOriMoney: this.materialPriceAll || 0, // 教具原价
        dictMoney: this.classRealPriceTotal || 0, // 折扣价
        saleUser: JSON.stringify(this.contractOrderData.sellTableList), // 销售占比
        taMoney: this.materialRealPriceAll || 0, // 教具总价
        remark: this.contractOrderData.detail || '', // 备注
        startTime: this.contractOrderData.picker[0] || '', // 合同开始时间
        endTime: this.contractOrderData.picker[1] || '', // 合同结束时间
        expireInvalid: this.contractOrderData.expireCheck ? 1 : 0, // 合同到期是否作废
        payway: '', // 收款单信息
        // bExtMoney: '', // 余额支付金额
        extPeriod: Number(this.contractOrderData.giveTime) || '', // 赠送课时数量
        extPeriodMoney: Number(this.contractOrderData.giveAllPrice) || '', // 赠送课时成本
        signTime: this.contractOrderData.data || '', // 合同签订日期
        extPeriodReason: this.contractOrderData.giveBeacuse || '', // 赠课原因
        imgUrl: imgArray.join(',') || '', // 合同附件
        extType: this.contractOrderData.giveType || '', // 赠课类型
        courseId: this.contractOrderData.selectClasses || '' // 课程id
      }
      // eslint-disable-next-line
      if (type == 'save') {
        updateClassOrder(params).then(res => {
          if (res.data.errorCode === 0) {
            this.$message.success(res.data.errorMessage)
            this.contractOrderDialogShow = false
            this.$emit('toContractList')
          } else {
            this.$message.error(res.data.errorMessage)
          }
        })
      } else {
        updateClassOrder(params).then(res => {
          if (res.data.errorCode === 0) {
            this.$message.success(res.data.errorMessage)
            this.contractOrderDialogShow = false
            this.$emit('toContractList')
            const orderIdSuccess = {
              orderNumber: res.data.orderId
            }
            this.$refs.gatheringDialog.showDialog(orderIdSuccess)
          } else {
            this.$message.error(res.data.errorMessage)
          }
        })
      }
    },
    /* 确定新增合同 */
    addClassOrderFun(type) {
      const imgArray = []
      this.contractOrderData.imgUrl &&
        this.contractOrderData.imgUrl.map(item => {
          imgArray.push(item.url)
        })
      const params = {
        stuId: this.contractOrderData.stuId, // 学员id
        // eslint-disable-next-line
        orderType: this.contractOrderData.orderType, // 合同类型
        orderNum: this.contractOrderData.orderNum, // 合同编号
        stuCardId: this.contractOrderData.stuCardId, // 学员账户
        parentId:
          this.contractOrderData.parentId.id || this.contractOrderData.parentId, // 签约家长
        signType: this.contractOrderData.signType, // 签约类型
        classpkg: JSON.stringify(this.contractOrderData.shopTableList), // 课时包数据
        teachTools: JSON.stringify(this.contractOrderData.goodsTableList), // 物资数据
        oriMoney: this.classPriceTotal || 0, // 原价
        taOriMoney: this.materialPriceAll || 0, // 教具原价
        dictMoney: this.classRealPriceTotal || 0, // 折扣价
        saleUser: JSON.stringify(this.contractOrderData.sellTableList), // 销售占比
        taMoney: this.materialRealPriceAll || 0, // 教具总价
        remark: this.contractOrderData.detail, // 备注

        expireInvalid: this.contractOrderData.expireCheck ? 1 : 0, // 合同到期是否作废
        payway: '', // 收款单信息
        bExtMoney: '', // 余额支付金额
        // extPeriod: Number(this.contractOrderData.giveTime) || '', // 赠送课时数量
        // extPeriodMoney: Number(this.contractOrderData.giveAllPrice) || '', // 赠送课时成本
        signTime: this.contractOrderData.data || '', // 合同签订日期
        // extPeriodReason: this.contractOrderData.giveBeacuse || '', // 赠课原因
        imgUrl: imgArray.join(',') || '', // 合同附件
        extType: this.contractOrderData.giveType || '', // 赠课类型
        courseId: this.contractOrderData.selectClasses || '', // 课程id
        studentType: this.studentType || '',
        targetStuId: this.targetStuId || ''
      }
      if (this.contractOrderData.orderType === '2') {
        params.startTime = this.contractOrderData.picker[0] // 合同开始时间
        params.endTime = this.contractOrderData.picker[1] // 合同结束时间
      } else {
        params.startTime = this.contractOrderData.startTime // 合同开始时间
        params.endTime = this.contractOrderData.endTime // 合同结束时间
      }
      // eslint-disable-next-line
      if (this.contractOrderData.orderType == '2') {
        params.extPeriod = Number(this.contractOrderData.giveTime) || ''
        params.extPeriodMoney =
          Number(this.contractOrderData.giveAllPrice) || ''
        params.extPeriodReason = this.contractOrderData.giveBeacuse || ''
        // eslint-disable-next-line
      } else if (this.contractOrderData.orderType == '3') {
        params.extNursery = Number(this.contractOrderData.giveTime) || 0
        params.extNurseryMoney =
          Number(this.contractOrderData.giveAllPrice) || 0
        params.extNurseryReason = this.contractOrderData.giveBeacuse || ''
      }
      // eslint-disable-next-line
      if (type == 'save') {
        addClassOrder(params).then(res => {
          if (res.data.errorCode === 0) {
            this.$message.success(res.data.errorMessage)
            this.contractOrderDialogShow = false
            this.$emit('toContractList')
            if (this.rowInfo && this.comeFrom === '1') {
              this.$router.push({ path: '/crm/contractMgr' })
            }
          } else {
            this.$message.error(res.data.errorMessage)
          }
        })
      } else {
        let flag = true
        const arr = []
        if (
          this.contractOrderData.goodsTableList &&
          this.contractOrderData.goodsTableList.length > 0
        ) {
          for (const i in this.contractOrderData.goodsTableList) {
            if (this.contractOrderData.goodsTableList[i].taId) {
              arr.push(this.contractOrderData.goodsTableList[i])
            }
          }
          // eslint-disable-next-line
          if (arr.length != this.contractOrderData.goodsTableList.length) {
            flag = false
          } else {
            flag = true
          }
        }
        if (flag) {
          addClassOrder(params).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success(res.data.errorMessage)
              this.contractOrderDialogShow = false
              this.$emit('toContractList')
              const orderIdSuccess = {
                orderNumber: res.data.orderId
              }
              this.$refs.gatheringDialog.showDialog(orderIdSuccess)
            } else {
              this.$message.error(res.data.errorMessage)
            }
          })
        } else {
          this.$message.error('请选择物资或是删除物资')
        }
      }
    },
    /* 保存并收款 */
    saveGathingForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addClassOrderFun('repice')
        }
      })
    },
    /* 清空表单数组对象数据 */
    clearFromArrayData() {
      this.contractOrderData.shopTableList = [
        {
          pid: '',
          price: '0.00',
          aTotalPrice: '0.00',
          preferentialPrice: '0.0元/0.0折',
          amount: '1',
          money: '0'
        }
      ]
      this.contractOrderData.goodsTableList = [
        {
          taId: '',
          price: '0.00',
          aTotalPrice: '0.00',
          preferentialPrice: '0.0元/0.0折',
          amount: '1',
          money: '0'
        }
      ]
      this.contractOrderData.sellTableList = [
        {
          userId: '',
          rate: '100'
        }
      ]
    },
    /** 托班赠送天数变更 */
    giveDatasChange(value) {
      this.changeStartDate(this.contractOrderData.startTime)
    },
    /* 合同期限选择时间值改变 */
    conPickerChange(value) {
      if (value && value.length > 0) {
        this.isExpireCheckShow = true
      } else {
        this.isExpireCheckShow = false
      }
    },

    changeStartDate(value) {
      if (value) {
        const startDate = moment(value, 'YYYY-MM-DD')
        let endDate = startDate
        this.contractOrderData.shopTableList.map(item => {
          if (item.pid) {
            const num = parseInt(item.amount)
            switch (item.unitType) {
              case '年':
                endDate = startDate.add(1 * num, 'years')
                break
              case '半年':
                endDate = startDate.add(6 * num, 'month')
                break
              case '季':
                endDate = startDate.add(3 * num, 'month')
                break
              case '月':
                endDate = startDate.add(1 * num, 'month')
                break
              case '天':
                endDate = startDate.add(1 * num, 'days')
            }
            // 赠送天数处理
            if (
              this.contractOrderData.giveDatas &&
              this.contractOrderData.giveDatas > 0
            ) {
              endDate = endDate.add(this.contractOrderData.giveDatas, 'days')
            }
            this.contractOrderData.endTime = endDate.format('YYYY-MM-DD')
          } else {
            alert('请先选择课时包')
          }
        })
      } else {
        this.contractOrderData.endTime = ''
      }
    },

    /* 过期课时自动作废多选框 值改变 */
    expireCheckChange(value) {
      this.$forceUpdate()
      this.contractOrderData.expireCheck = value
    },
    /* 自动生成合同编号 */
    getOrderNumFun() {
      getOrderNum().then(res => {
        if (res.data.errorCode === 0) {
          this.contractOrderData.orderNum = res.data.orderNum
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 合同规则查询数据 */
    queryPurchaseConfFun() {
      queryPurchaseConf().then(res => {
        if (res.data.errorCode === 0) {
          this.packageStatus = res.data.packageSta // 课时套餐规则
          this.materialStatus = res.data.materialSta // 物资规则
          // eslint-disable-next-line
          if (this.packageStatus && this.packageStatus == '0') {
            this.disabledClass = true
          } else {
            this.disabledClass = false
          }
          // eslint-disable-next-line
          if (this.materialStatus && this.materialStatus == '0') {
            this.disabledMaterial = true
          } else {
            this.disabledMaterial = false
          }
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 学员下拉列表查询数据 */
    queryCRMStuListFun() {
      const params = {
        pageSize: 99999999
      }
      queryCRMStuList(params).then(res => {
        if (res.data.errorCode === 0) {
          this.allStudentList = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 学员下拉值改变 */
    stuIdChange(value) {
      if (value && value.length > 0) {
        this.allStudentList &&
          this.allStudentList.length > 0 &&
          this.allStudentList.map(item => {
            // eslint-disable-next-line
            if (item.id == value) {
              this.contractOrderData.stuCardId = item.stuCardId
              this.contractOrderData.parentId = item.parentList[0]
              this.allParentList = item.parentList
            }
          })
      } else {
        this.contractOrderData.stuCardId = '当前学员暂无会员卡'
        this.contractOrderData.parentId = ''
      }
    },
    /* 物资下拉数据查询 */
    queryTeachingAidFun() {
      const params = {
        pageSize: 999999,
        status: '1'
      }
      queryTeachingAid(params).then(res => {
        if (res.data.errorCode === 0) {
          this.allTeachList = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 物资下拉值改变 */
    materailChangeValue(value) {
      this.allTeachList &&
        this.allTeachList.length > 0 &&
        this.allTeachList.map(item => {
          // eslint-disable-next-line
          if (value == item.id) {
            this.contractOrderData.goodsTableList.map(itemTeach => {
              // eslint-disable-next-line
              if (itemTeach.taId == item.id) {
                itemTeach.price = item.price
                itemTeach.money = item.realPrice
                itemTeach.aTotalPrice = item.price
                itemTeach.downPrice = (
                  Number(itemTeach.aTotalPrice) - Number(itemTeach.money)
                ).toFixed(2)
                itemTeach.prePrice = (
                  (Number(itemTeach.money) * 10) /
                  Number(itemTeach.aTotalPrice)
                ).toFixed(2)
                itemTeach.preferentialPrice =
                  itemTeach.downPrice + '元' + '/' + itemTeach.prePrice + '折'
              }
            })
          }
        })
      this.materialTotalPriceChange()
    },
    /* 物资中数量值改变 */
    materialAmount(value, child) {
      this.allTeachList &&
        this.allTeachList.length > 0 &&
        this.allTeachList.map(item => {
          // eslint-disable-next-line
          if (child.taId == item.id) {
            child.money = value * item.realPrice
            child.aTotalPrice = value * item.price
            child.downPrice = (
              Number(child.aTotalPrice) - Number(child.money)
            ).toFixed(2)
            child.prePrice = (
              (Number(child.money) * 10) /
              Number(child.aTotalPrice)
            ).toFixed(2)
            child.preferentialPrice =
              child.downPrice + '元' + '/' + child.prePrice + '折'
          }
        })
      this.materialTotalPriceChange()
    },

    /** 实收价格change */
    priceChange() {
      let totalMoney = 0
      this.contractOrderData.shopTableList.forEach(item => {
        totalMoney += Number(item.money)
      })
      this.contractOrderData.goodsTableList.forEach(item => {
        totalMoney += Number(item.money)
      })

      this.contractOrderData.atotalRealPrice = totalMoney.toFixed(2)
    },

    /* 课时总价格和总实收处理 */
    shopTotalPriceChange() {
      this.classPriceTotal = 0
      this.classRealPriceTotal = 0
      this.contractOrderData.shopTableList &&
        this.contractOrderData.shopTableList.length > 0 &&
        this.contractOrderData.shopTableList.map(item => {
          this.classPriceTotal += Number(item.aTotalPrice)
          this.classRealPriceTotal += Number(item.money)
        })
      this.contractOrderData.atotalPrice = (
        this.classPriceTotal + this.materialPriceAll
      ).toFixed(2)
      this.contractOrderData.atotalRealPrice = (
        this.classRealPriceTotal + this.materialRealPriceAll
      ).toFixed(2)
    },
    /* 物资总价格和总实收处理 */
    materialTotalPriceChange() {
      this.materialPriceAll = 0
      this.materialRealPriceAll = 0
      this.contractOrderData.goodsTableList &&
        this.contractOrderData.goodsTableList.length > 0 &&
        this.contractOrderData.goodsTableList.map(item => {
          this.materialPriceAll += Number(item.aTotalPrice)
          this.materialRealPriceAll += Number(item.money)
        })
      this.contractOrderData.atotalPrice = (
        this.classPriceTotal + this.materialPriceAll
      ).toFixed(2)
      this.contractOrderData.atotalRealPrice = (
        this.classRealPriceTotal + this.materialRealPriceAll
      ).toFixed(2)
    },
    /* 课时包下拉数据查询 */
    queryContractProductFun(type) {
      const params = {
        type: type,
        pageSize: 99999,
        status: '1'
      }
      queryContractProduct(params).then(res => {
        if (res.data.errorCode === 0) {
          this.allClassesList = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 课时包值改变 */
    classChangeValue(value) {
      this.allClassesList &&
        this.allClassesList.length > 0 &&
        this.allClassesList.map(item => {
          // eslint-disable-next-line
          if (value == item.id) {
            this.contractOrderData.shopTableList.map(itemClass => {
              // eslint-disable-next-line
              if (itemClass.pid == item.id) {
                itemClass.price = item.price
                itemClass.money = item.realPrice
                itemClass.aTotalPrice = item.price
                itemClass.downPrice = (
                  Number(itemClass.aTotalPrice) - Number(itemClass.money)
                ).toFixed(2)
                itemClass.prePrice = (
                  (Number(itemClass.money) * 10) /
                  Number(itemClass.aTotalPrice)
                ).toFixed(2)
                itemClass.preferentialPrice =
                  itemClass.downPrice + '元' + '/' + itemClass.prePrice + '折'
                itemClass.unitType = item.unitType
              }
            })
          }
        })
      this.shopTotalPriceChange()
    },
    /* 课时数量值改变 */
    classAmountChange(value, child) {
      this.allClassesList &&
        this.allClassesList.length > 0 &&
        this.allClassesList.map(item => {
          // eslint-disable-next-line
          if (child.pid == item.id) {
            child.money = value * item.realPrice
            child.aTotalPrice = value * item.price
            child.downPrice = (
              Number(child.aTotalPrice) - Number(child.money)
            ).toFixed(2)
            child.prePrice = (
              (Number(child.money) * 10) /
              Number(child.aTotalPrice)
            ).toFixed(2)
            child.preferentialPrice =
              child.downPrice + '元' + '/' + child.prePrice + '折'
          }
        })
      this.shopTotalPriceChange()
    },
    /* 课程下拉列表数据查询 */
    summaryQueryFun() {
      summaryQuery().then(res => {
        // eslint-disable-next-line
        if (res.data.errorCode === 0) {
          this.allCourseDataList = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 收款方式列表查询 */
    queryPaymentAccountListFun() {
      const params = {
        pageSize: 99999
      }
      queryPaymentAccountList(params).then(res => {
        if (res.data.errorCode === 0) {
          console.log('res--->', res)
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 关联销售下拉数据查询 */
    summaryQueryTenantUserFun() {
      summaryQueryTenantUser().then(res => {
        if (res.data.errorCode === 0) {
          this.allTenantUserList = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 商品添加表格行 */
    addShopClass() {
      const tempData = {
        pid: '',
        price: '0.00',
        aTotalPrice: '0.00',
        preferentialPrice: '0.0元/0.0折',
        amount: '1',
        money: '0'
      }
      this.contractOrderData.shopTableList.push(tempData)
    },
    /* 删除商品表格行 */
    delShopTableRow(index) {
      this.contractOrderData.shopTableList.splice(index, 1)
    },
    /* 物资添加表格行 */
    addGoodsClass() {
      const tempData = {
        taId: '',
        price: '0.00',
        aTotalPrice: '0.00',
        preferentialPrice: '0.0元/0.0折',
        amount: '1',
        money: '0'
      }
      this.contractOrderData.goodsTableList.push(tempData)
    },
    /* 删除物资表格行 */
    delGoodsTableRow(index) {
      this.contractOrderData.goodsTableList.splice(index, 1)
      this.materialTotalPriceChange()
    },
    /* 销售信息表格新增 */
    addSellInfo() {
      const tempData = {
        userId: '',
        rate: '100'
      }
      this.contractOrderData.sellTableList.push(tempData)
    },
    /* 删除销售表格行 */
    delSellTableRow(index) {
      this.contractOrderData.sellTableList.splice(index, 1)
    },
    /* 精确查找弹框 */
    openSearchDialog() {
      this.$refs.exactSearchDialog.showDialog('contract')
    },
    /* 上传照片 */
    handleRemove(file, fileList) {
      const newFileList = []
      // eslint-disable-next-line
      if (file.status == 'success') {
        if (fileList && fileList.length > 0) {
          fileList.map(item => {
            if (item.response) {
              const obj = {
                url: item.response.url,
                status: 'success'
              }
              newFileList.push(obj)
            } else {
              newFileList.push(item)
            }
          })
        }
        this.contractOrderData.imgUrl = newFileList
        if (fileList.length < 9) {
          this.imgVisible = false
        } else {
          this.imgVisible = true
        }
      }
    },
    onChange(file, fileList) {
      const newFileList = []
      // eslint-disable-next-line
      if (file.status == 'success') {
        if (fileList && fileList.length > 0) {
          fileList.map(item => {
            if (item.response) {
              const obj = {
                url: item.response.url,
                status: 'success'
              }
              newFileList.push(obj)
            } else {
              newFileList.push(item)
            }
          })
        }
        this.contractOrderData.imgUrl = newFileList
        if (fileList.length === 9) {
          this.imgVisible = true
        }
      }
    },
    beforeAvatarUpload(file) {
      const imageSize = file.size / 1024 / 1024 < 5 // 上传图片大小不超过5M
      if (!imageSize) {
        this.$message.error('上传图片大小不能超过 5MB!')
      }
      return imageSize
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    /* 订单类型单选框改变 */
    orderTypeValue(value) {
      // eslint-disable-next-line
      if (value == '3') {
        this.isExpireCheckShow = false
        this.isShowCardNum = false
        this.isGiveInfoShow = false
        this.isGiveInfoFalse = true
        this.queryContractProductFun(value)
        this.clearFromArrayData()
      }
      // eslint-disable-next-line
      if (value == '2') {
        this.isExpireCheckShow = false
        this.isShowCardNum = true
        this.isGiveInfoShow = true
        this.isGiveInfoFalse = false
        this.queryContractProductFun('1')
        this.clearFromArrayData()
      }
      this.contractOrderData.giveDatas = ''
    },
    /* 赠课类型单选框改变 */
    giveTypeValue(value) {
      // eslint-disable-next-line
      if (value == '1') {
        this.isSelectClassShow = false
      }
      // eslint-disable-next-line
      if (value == '2') {
        this.isSelectClassShow = true
      }
    },
    /* 赠课原因 快速选择事件 */
    quickGiveClassFun(key) {
      this.giveClassBecause &&
        this.giveClassBecause.length > 0 &&
        this.giveClassBecause.map(item => {
          // eslint-disable-next-line
          if (item.key == key) {
            this.contractOrderData.giveBeacuse = item.value
          }
        })
    },
    /* 获取精确查找传的学员信息 */
    getStudentName(value) {
      this.allStudentList.map(item => {
        // eslint-disable-next-line
        if (value == item.name) {
          this.contractOrderData.stuId = item.id
          this.contractOrderData.stuCardId = item.stuCardId
          this.contractOrderData.parentId = item.parentList[0]
          this.allParentList = item.parentList
        }
      })
    }
  }
}
