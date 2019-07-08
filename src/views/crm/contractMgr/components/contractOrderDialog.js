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
  parentList, // 潜在学员根据id获取家长信息
  checkRenew // 查询续约
} from '@/api/crm/contract/contract.js'
import {
  getParentList,
  parentSummary
} from '@/api/crmDetail/crmDetail'
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
    // const vaildAmount = (rule, value, callback) => {
    //   if (value === '' || value === undefined) {
    //     callback()
    //   } else {
    //     const reg = /^(\d+|\d+\.\d{1,2})$/
    //     if (!reg.test(value)) {
    //       callback(new Error('非负数，可精确到小数点后2位'))
    //     } else {
    //       callback()
    //     }
    //   }
    // }
    return {
      dateOptions: {
        disabledDate: this.disabledDate
      },
      targetStuId: '',
      readStuName: '',
      isSelectReadingStu: false,
      contractOrderDialogShow: false,
      isShowCardNum: true, // 显示学员账户id
      isShowGoodsClass: true, // 商品课时包模块的显隐
      isShowGoodsMate: false, // 商品物资模块显隐
      isGiveInfoShow: false, // 赠送课时包的赠课显示
      isGiveInfoFalse: false, // 托班的赠课显示
      isSelectClassShow: false,
      isShowzhuanjie: false, // 新签转介绍按钮的显隐
      isShowContract: true, // 续约的显影
      studentType: '1', // 1-学员类型为在读,0-学员类型为潜在
      contractOrderData: {
        stuId: '', // 学员id
        orderType: '2', // 合同类型
        orderNum: '', // 合同编号
        stuCardId: '', // 会员卡号 学员账户
        parentId: '', // 签约家长id
        introduce: '', // 转介绍人id
        signType: '0', // 签约类型
        shopTableList: [
          {
            pid: '',
            price: '0.00',
            aTotalPrice: '0.00',
            preferentialPrice: '0.0元/0.0折',
            amount: 1,
            money: '0',
            singleMoney: '0' // 实收单价
          }
        ], // 商品课时
        goodsTableList: [
          // 物资数据
          {
            taId: '',
            price: '0.00',
            aTotalPrice: '0.00',
            preferentialPrice: '0.0元/0.0折',
            amount: 1,
            money: '0',
            singleMoney: '0' // 实收单价
          }
        ],
        atotalPrice: '', // 总金额
        atotalRealPrice: '', // 总实收
        sellTableList: [
          // 关联销售数据
          {
            userId: '',
            rate: 100
          }
        ],
        // goodsClass: true, // 商品课时套餐选框
        // goodsMate: false, // 商品物资套餐选框
        // giveClass: false, // 赠送课时选框
        giveDatas: '', // 赠送天数
        giveType: '1', // 赠课类型
        giveTime: '0', // 赠送课时
        giveAllPrice: 0, // 赠课总成本
        giveBeacuse: '', // 赠课原因
        imgUrl: '', // 上传图片
        data: '', // 合同签订日
        picker: '', // 课时包合同期限
        expireCheck: '', // 过期课时自动作废 单选框
        detail: '', // 备注
        selectClasses: '', // 选择课程
        startTime: '', // 托班开始时间
        endTime: '' // 托班结束时间
      },
      rules: {
        picker: [
          { required: true, message: '请输入合同期限', trigger: 'change' }
        ],
        orderType: [
          { required: true, message: '请选择订单类型', trigger: 'change' }
        ],
        orderNum: [
          { required: true, message: '请输入合同编号', trigger: 'change' }
        ],
        stuId: [
          { required: true, message: '请选择学员', trigger: 'change' }
        ],
        parentId: [
          { required: true, message: '请输入家长姓名或手机号', trigger: 'change' }
        ],
        signType: [
          { required: true, message: '请选择签约类型', trigger: 'change' }
        ],
        introduce: [
          { required: true, message: '请输入家长姓名或手机号', trigger: 'change' }
        ],
        data: [
          { required: true, message: '请输入合同签订日', trigger: 'change' }
        ],
        giveTime: [
          { type: 'number', min: 0.01, message: '请输入大于0的正数', trigger: 'change' },
          { pattern: /^[+]{0,1}(\d+)$/, message: '请输入大于0的正数', trigger: 'change' }
        ],
        giveAllPrice: [
          { type: 'number', min: 0, message: '请输入大于0的正数', trigger: 'change' }
        ],
        giveDatas: [
          { type: 'number', min: 0.01, message: '请输入大于0的正数', trigger: 'change' },
          { pattern: /^[+]{0,1}(\d+)$/, message: '请输入大于0的正数', trigger: 'change' }
        ]
        // sellInfo: [{ type: 'number', min: 0, max: 100 },
        //   { validator: (rule, value, callback) => {
        //     let rateAll = 0
        //     this.contractOrderData.sellTableList.forEach(item => {
        //       if (!item.userId) {
        //         return callback(new Error('请选择销售'))
        //       }
        //       rateAll += item.rate
        //     })
        //     if (rateAll !== 100) {
        //       return callback(new Error('总占比应等于100%'))
        //     }
        //     return callback()
        //   }, trigger: 'blur' }
        // ]
      },
      shopTableListRules: {
        shopTableListAmount: [
          { type: 'number', min: 0.01, message: '请输正整数', trigger: 'change' },
          { pattern: /^[+]{0,1}(\d+)$/, message: '请输正整数', trigger: 'change' }
        ]
      },
      goodsTableListRules: {
        goodsTableListAmount: [
          { type: 'number', min: 0.01, message: '请输正整数', trigger: 'change' },
          { pattern: /^[+]{0,1}(\d+)$/, message: '请输正整数', trigger: 'change' }
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
      everyParentList: [], // 转介绍家长
      allTeachList: [], // 所有物资下拉数据
      allClassesList: [], // 所有课时包下拉数据
      allTenantUserList: [], // 所有销售下拉数据
      allCourseDataList: [], // 所有课程下拉数据
      imgVisible: false, // 图片上传显隐
      classImgVisible: false,
      disabledType: false, // 编辑订单类型时禁用
      disabledsignType: true, // 编辑是否可以续约显隐
      disabledsignTypeToolTip: false, // 续约不符合规则提示框是否显示
      disabledSaveMoneyType: false, // 只选择赠送课时包时保存并付款按钮置灰
      fileList: [], // 图片列表
      rowlistData: '', // 是否新增编辑
      rowInfo: {}, // 潜在学员点击某个学员获取的数据
      checkedCities: [], // 课时套餐的选择
      checkedCitiesBefore: [], // 课时套餐的选择前的数组
      delSellTableRowHidden: false // 关联销售必须有一行，只有一行隐藏
    }
  },
  methods: {
    /** 禁选日期 */
    disabledDate(date) {
      const now = new Date()
      return date > now
    },

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

    // 合同订单
    checkedCitiesChange(value) {
      // if (this.contractOrderData.orderType === '3') {
      // 当是托班时，0代表托班套餐，1代表物资，2代表赠送课时和原因
      if (value.indexOf('0') < 0 && value.indexOf('2') >= 0) { // 现在选择2没有选择0的时候
        if (this.checkedCitiesBefore.indexOf('0') >= 0) { // 之前有选择了0
          if (value.indexOf('0') < 0) { // 现在点击不选择0
            value.splice(value.indexOf('2'), 1) // 把2也要去掉
            this.isGiveInfoFalse = false // 隐藏2的内容
          }
          if (this.checkedCitiesBefore.indexOf('1') < 0) { // 同时没有选择1的时候
            value.push('1')
            this.goodsMateChange(value) // 显示1的内容
          }
        } else { // 现在选择0没有选择2的时候，只选择0就可以
          value.push('0')
          this.goodsClassChange(value) // 显示0的内容
        }
      }
      // }
      this.checkedCitiesBefore = value
      return value
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
      if (rowlist && (rowlist == "add" || rowlist == "readAdd")) {
        this.isExpireCheckShow = false
        this.contractOrderData.expireCheck = false
        this.contractOrderData.giveDatas = ''
        // this.contractOrderData.goodsClass = true // 课时套餐选框选中
        // this.contractOrderData.goodsMate = false // 物资选框没有选中
        // this.contractOrderData.giveClass = false // 赠送课时没有选中
        this.disabledsignType = true // 编辑是否可以续约显隐
        this.isGiveInfoFalse = false
        this.isShowzhuanjie = false // 潜在学员转介绍按钮显示
        this.isShowContract = true // 潜在学员续约按钮显影
        this.disabledsignTypeToolTip = false // 续约提示框是否显示
        this.checkedCities = ['0'] // 课时套餐的选择
        this.checkedCitiesBefore = ['0']
        this.contractOrderData.giveBeacuse = ''
        this.contractOrderData.picker = ''
        this.isShowGoodsClass = true // 课时套餐部分显示
        this.isShowGoodsMate = false // 物资部分隐藏
        this.isGiveInfoShow = false // 赠送课时部分隐藏
        this.giveClassStopSaveMoney() // 保存和付款按钮的显隐
        this.delSellTableRowHidden = false
        this.contractOrderData.goodsTableList = [] // 置空物资选项
        this.contractOrderData.giveType = '1'
        if (this.rowInfo) {
          this.contractOrderData.stuId = this.rowInfo.id
          const params = {
            stuId: this.rowInfo.id
          }
          const paramsForIntroducer = {
            introduce: this.rowInfo.recommender
          }
          this.checkRenewFun(params) // 续约按钮是否可以点击
          this.parentSummaryFun(paramsForIntroducer)
          if (this.studentType === '0') { // 0-学员类型为潜在,1-学员类型为在读
            this.isShowzhuanjie = true // 潜在学员转介绍按钮显示
            this.isShowContract = false // 续约按钮不显示
            this.getParentByStuList(params) // 潜在学员获取家长信息
            if (this.rowInfo.recommender !== undefined && this.rowInfo.recommender !== null) { // 如果有转介绍人
              this.contractOrderData.signType = '2'
              // this.parentSummaryFun(paramsForIntroducer)
              this.contractOrderData.introduce = this.rowInfo.recommender
              // this.parentSummaryFun(paramsForIntroducer)
            }
          } else { // 在读学员
            this.isShowzhuanjie = false
            this.isShowContract = true
            this.checkRenewFun(params)
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
        if (rowlist.imgUrl && rowlist.imgUrl.length > 0) {
          imgArray = rowlist.imgUrl.split(',')
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
            orderType: rowlist.orderType || '2', // 合同类型，2是课时包，3是托班
            orderNum: rowlist.orderNum || '', // 合同编号
            stuCardId: rowlist.stuCardId || '', // 会员卡号 学员账户
            parentId: rowlist.parentId || '', // 签约家长id
            introduce: rowlist.introduce || '', // 转介绍id
            signType: rowlist.signType || '0', // 签约类型

            shopTableList: JSON.parse(rowlist.classpkg), // 商品课时
            goodsTableList: JSON.parse(rowlist.teachToolsSale), // 物资数据

            atotalPrice: rowlist.taOriMoney + rowlist.oriMoney || '0.0', // 总金额
            atotalRealPrice: rowlist.taMoney + rowlist.dictMoney || '0.0', // 总实收
            sellTableList: saleUserList, // 关联销售数据
            // giveClass: true, // 赠送课时选框
            giveType: rowlist.extType || '1', // 赠课类型
            giveTime: rowlist.extPeriod || '0', // 赠送课时
            giveAllPrice: rowlist.extPeriodMoney || '0', // 赠课总成本
            giveBeacuse: rowlist.extPeriodReason || '', // 赠课原因
            imgUrl: this.fileList || '', // 上传图片
            data: rowlist.signTime || '', // 合同签订日
            picker: [rowlist.startTime, rowlist.endTime], // 合同期限
            // expireCheck: rowlist.expireInvalid || '', // 过期课时自动作废 单选框
            detail: rowlist.remark || '', // 备注
            selectClasses: rowlist.courseId || '', // 选择课程
            startTime: rowlist.startTime,
            endTime: rowlist.endTime
          }

          // const paramsIntroduce = {
          //   introduce: rowlist.introduce
          // }
          // this.contractOrderData.introduce = this.parentSummaryFun(paramsIntroduce)

          // 判断是否有转介绍
          if (rowlist.orderType === '2') {
            this.isShowzhuanjie = true
          }
          const params = {
            stuId: rowlist.stuId,
            id: rowlist.parentId
          }
          this.getParentListFun(params)
          // 补上实收单价
          const classpkg = JSON.parse(rowlist.classpkg)
          const teachToolsSale = JSON.parse(rowlist.teachToolsSale)
          const shopTableList = []
          const goodsTableList = []
          classpkg &&
            classpkg.length > 0 &&
            classpkg.forEach(item => {
              this.classPriceTotal += Number(item.aTotalPrice)
              this.classRealPriceTotal += Number(item.money)
              if (item.pid !== '' && !item.singleMoney) {
                const singleMoney = Number(item.money) / Number(item.amount)
                shopTableList.push({
                  ...item,
                  singleMoney
                })
              } else {
                shopTableList.push(item)
              }
            })

          teachToolsSale &&
            teachToolsSale.length > 0 &&
            teachToolsSale.forEach(item => {
              this.materialPriceAll += Number(item.aTotalPrice)
              this.materialRealPriceAll += Number(item.money)
              if (item.taId !== '' && !item.singleMoney) {
                const singleMoney = Number(item.money) / Number(item.amount)
                goodsTableList.push({
                  ...item,
                  singleMoney
                })
              } else {
                goodsTableList.push(item)
              }
            })
          this.contractOrderData.shopTableList = shopTableList
          this.contractOrderData.goodsTableList = goodsTableList

          if (rowlist.startTime && rowlist.endTime) {
            this.isExpireCheckShow = true
            // eslint-disable-next-line
            if (rowlist.expireInvalid == "1") {
              this.contractOrderData.expireCheck = true
            } else {
              this.contractOrderData.expireCheck = false
            }
          } else {
            this.isExpireCheckShow = false
          }
        })
        // eslint-disable-next-line
        if (rowlist.orderType == "2") { //课时套餐类型
          this.$nextTick(() => {
            if (rowlist.purchaseType === '2') { // 判断是不是正式合同和赠送合同隐藏和显示内容,1
              this.checkedCities = ['2'] // 赠送合同选择按钮
              if (rowlist.extType === '1') { // 判断赠送的是通用还是专用，1是普通，2是专用
                this.isGiveInfoShow = true
              } else if (rowlist.extType === '2') {
                this.contractOrderData.giveType = rowlist.extType
                this.isGiveInfoShow = true
              }
              this.isShowGoodsClass = false
              this.isShowGoodsMate = false
            } else if (rowlist.purchaseType === '1' || rowlist.purchaseType === '3') {
              this.isShowGoodsMate = true
              this.isShowGoodsClass = true
              this.isGiveInfoShow = false
            }

            this.selectFrama(rowlist)

            this.isGiveInfoFalse = false
            this.contractOrderData.giveTime = rowlist.extPeriod
            this.contractOrderData.giveAllPrice = rowlist.extPeriodMoney
            this.contractOrderData.giveBeacuse = rowlist.extPeriodReason
            // this.contractOrderData.picker = []
            // this.contractOrderData.picker = [rowlist.startTime, rowlist.endTime]
            if (
              this.contractOrderData.picker &&
              this.contractOrderData.picker.length > 0
            ) {
              this.isExpireCheckShow = true
              // eslint-disable-next-line
              if (rowlist.expireInvalid == "1") {
                this.contractOrderData.expireCheck = true
              } else {
                this.contractOrderData.expireCheck = false
              }
            } else {
              this.isExpireCheckShow = false
            }
          })
          // eslint-disable-next-line
        } else if (rowlist.orderType == "3") { // 托班类型
          this.$nextTick(() => {
            if (rowlist.purchaseType === '2') { // 判断是不是正式合同和赠送合同隐藏和显示内容
              this.isGiveInfoFalse = true
              this.isShowGoodsClass = false
              this.isShowGoodsMate = false
            } else if (rowlist.purchaseType === '3') {
              this.isShowGoodsClass = true
              this.isShowGoodsMate = true
              this.isGiveInfoFalse = false
            } else if (rowlist.purchaseType === '1') {
              this.isShowGoodsMate = true
              this.isShowGoodsClass = true
              if (rowlist.orderType === '3') {
                this.isGiveInfoFalse = true
              } else if (rowlist.orderType === '2') {
                this.isGiveInfoFalse = false
              }
            }
            this.selectFrama(rowlist) // 判断选择框
            this.isGiveInfoShow = false
            this.contractOrderData.giveDatas = rowlist.extNursery
            this.contractOrderData.giveAllPrice = rowlist.extNurseryMoney
            this.contractOrderData.giveBeacuse = rowlist.extNurseryReason
          })
        }
        // eslint-disable-next-line
        let orderTypeChange = rowlist.orderType == "2" ? "1" : "3"
        this.queryContractProductFun(orderTypeChange) // 课时包下拉数据查询
      }
      this.queryPurchaseConfFun() // 合同规则数据
      this.queryCRMStuListFun() // 学员下拉数据查询
      this.queryTeachingAidFun() // 物资下拉数据查询
      this.summaryQueryTenantUserFun() // 关联销售下拉数据查询
      this.summaryQueryFun() // 课程下拉数据
      // this.queryPaymentAccountListFun() // 收款方式列表查询
      if (!rowlist.orderId) {
        this.getOrderNumFun() // 自动生成合同编号
      }
    }, // showDialog

    // 判断选择框
    selectFrama(rowlist) {
      if (rowlist.purchaseType === '3') { // 只是正式合同
        if (rowlist.existPack === 'true' && rowlist.existTool === 'false') {
          this.checkedCities = ['0']
        } else if (rowlist.existPack === 'false' && rowlist.existTool === 'true') {
          this.checkedCities = ['1']
        } else if (rowlist.existPack === 'true' && rowlist.existTool === 'true') {
          this.checkedCities = ['0', '1']
        }
      } else if (rowlist.purchaseType === '2') { // 只是赠送合同
        this.checkedCities = ['2']
      } else if (rowlist.purchaseType === '1') { // 正式合同和赠送合同都有
        if (rowlist.existPack === 'true' && rowlist.existTool === 'false' && rowlist.existExt === 'false') {
          this.checkedCities = ['0']
        } else if (rowlist.existPack === 'false' && rowlist.existTool === 'true' && rowlist.existExt === 'false') {
          this.checkedCities = ['1']
        } else if (rowlist.existPack === 'true' && rowlist.existTool === 'true' && rowlist.existExt === 'false') {
          this.checkedCities = ['0', '1']
        } else if (rowlist.existPack === 'false' && rowlist.existTool === 'false' && rowlist.existExt === 'true') {
          this.checkedCities = ['2']
        } else if (rowlist.existPack === 'true' && rowlist.existTool === 'false' && rowlist.existExt === 'true') {
          this.checkedCities = ['0', '2']
        } else if (rowlist.existPack === 'false' && rowlist.existTool === 'true' && rowlist.existExt === 'true') {
          this.checkedCities = ['1', '2']
        } else if (rowlist.existPack === 'true' && rowlist.existTool === 'true' && rowlist.existExt === 'true') {
          this.checkedCities = ['0', '1', '2']
        }
      }
    },

    /* 潜在学员根据id获取家长信息 */
    getParentByStuList(params) {
      parentList(params).then(res => {
        if (res.data.errorCode === 0) {
          this.allParentList = res.data.results
          this.allParentList &&
            this.allParentList.map(item => {
              item.id = item.parentId
              item.mobile = item.parentMobile
              item.parentName = item.parentName
            })
          this.contractOrderData.parentId =
            this.allParentList && this.allParentList[0]
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    /* 在读学员根据id获取家长信息 */
    getParentListFun(params) {
      getParentList(params).then(res => {
        if (res.data.errorCode === 0) {
          this.allParentList = res.data.results
          if (params.id) { // 有家长id就是编辑过来展示
            this.allParentList &&
            this.allParentList.filter(item => {
              if (item.id === params.id) {
                item.id = item.id
                item.mobile = item.mobile
                item.parentName = item.name
              }
            })
          } else { // 没有家长id就是在在读学员进行报名
            this.allParentList &&
            this.allParentList.filter(item => {
              if (item.stuId === params.stuId) {
                item.id = item.id
                item.mobile = item.mobile
                item.parentName = item.name
              }
            })
            this.contractOrderData.parentId =
            this.allParentList && this.allParentList[0]
          }
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    // 新签-转介绍获取转介绍人信息
    parentSummaryFun(params) {
      parentSummary(params).then(res => {
        if (res.data.errorCode === 0) {
          this.everyParentList = res.data.results
          // if (params.introduce === '') { // 当introduce为空时
          //   console.log(params.introduce, '--------------')
          //   this.everyParentList &&
          //     this.everyParentList.map(item => {
          //       item.id = item.id
          //       item.mobile = item.mobile
          //       item.parentName = item.name
          //     })
          //   this.contractOrderData.introduce =
          //     this.everyParentList && this.everyParentList[0] && this.everyParentList[0].id
          // } else if (params.introduce !== '') { // 当introduce不为空时
          this.everyParentList &&
            this.everyParentList.map(item => {
              if (item.id === params.introduce) {
                item.id = item.id
                item.mobile = item.mobile
                item.parentName = item.name
              } else {
                item.id = item.id
                item.mobile = item.mobile
                item.parentName = item.name
              }
            })
          // }
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    //  点击按钮商品课时包显隐
    goodsClassChange(value) {
      const shopTableListNum = this.contractOrderData.shopTableList
      if (value) {
        this.isShowGoodsClass = true
        if (shopTableListNum && shopTableListNum.length <= 0) {
          this.addShopClass()
        }
      } else {
        // this.giveClassChange(value)
        this.isShowGoodsClass = false
        this.contractOrderData.shopTableList = []
        this.shopTotalPriceChange()
      }
      this.giveClassStopSaveMoney()
    },

    //  点击按钮商品物资显隐
    goodsMateChange(value) {
      const goodsTableListNum = this.contractOrderData.goodsTableList
      if (value) {
        this.isShowGoodsMate = true
        if (goodsTableListNum && goodsTableListNum.length <= 0) {
          this.addGoodsClass()
        }
      } else {
        this.isShowGoodsMate = false
        this.contractOrderData.goodsTableList = []
        this.materialTotalPriceChange()
      }
      this.giveClassStopSaveMoney()
    },

    // 赠送课时选框勾选处理
    giveClassChange(value) {
      if (value) {
        if (this.contractOrderData.orderType === '2') { // 课时包
          this.isGiveInfoShow = true
          this.contractOrderData.giveType = '1'
          this.contractOrderData.selectClasses = ''
          this.contractOrderData.giveTime = '0'
          this.contractOrderData.giveAllPrice = '0'
        } else if (this.contractOrderData.orderType === '3') { // 如果是托班选择赠送天数
          this.contractOrderData.giveDatas = ''
          this.contractOrderData.giveBeacuse = ''
          this.isGiveInfoFalse = true
        }
      } else {
        // this.contractOrderData.giveClass = false
        if (this.contractOrderData.orderType === '2') {
          this.contractOrderData.giveType = '1'
          this.contractOrderData.selectClasses = ''
          this.contractOrderData.giveTime = '0'
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
      this.giveClassStopSaveMoney()
    },

    // 只选择赠送课时的时候无法点击保存并收款按钮
    giveClassStopSaveMoney() {
      if (this.isShowGoodsClass === false && this.isShowGoodsMate === false && this.isGiveInfoShow === true) {
        this.disabledSaveMoneyType = true
      } else {
        this.disabledSaveMoneyType = false
      }
    },

    /* 关闭弹框 */
    cancelDialog(formName) {
      this.checkedCities = []
      this.$refs[formName].resetFields()
      this.classPriceTotal = 0
      this.classRealPriceTotal = 0
      this.materialPriceAll = 0
      this.materialRealPriceAll = 0
      this.contractOrderData.stuId = ''
      this.contractOrderData.orderNum = ''
      this.contractOrderData.stuCardId = ''
      this.contractOrderData.parentId = ''
      this.contractOrderData.introduce = ''
      this.contractOrderData.signType = '0'
      this.contractOrderData.giveDatas = ''
      this.contractOrderData.giveType = '1'
      this.contractOrderData.giveTime = '0'
      this.contractOrderData.giveAllPrice = 0
      this.contractOrderData.giveBeacuse = ''
      this.contractOrderData.imgUrl = ''
      this.contractOrderData.data = ''
      this.contractOrderData.picker = ''
      this.contractOrderData.expireCheck = ''
      this.contractOrderData.detail = ''
      this.contractOrderData.selectClasses = ''
      this.contractOrderData.startTime = ''
      this.contractOrderData.endTime = ''
      this.contractOrderData.shopTableList = [
        {
          pid: '',
          price: '0.00',
          aTotalPrice: '0.00',
          preferentialPrice: '0.0元/0.0折',
          amount: 1,
          money: '0',
          singleMoney: '0' // 实收单价
        }
      ]
      this.contractOrderData.goodsTableList = [
        // 物资数据
        {
          taId: '',
          price: '0.00',
          aTotalPrice: '0.00',
          preferentialPrice: '0.0元/0.0折',
          amount: 1,
          money: '0',
          singleMoney: '0' // 实收单价
        }
      ]
      this.clearFromArrayData()
      this.contractOrderDialogShow = false
    },
    /* 确定提交弹框表单内容 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // eslint-disable-next-line
          if (this.rowlistData && this.rowlistData == "add") {
            this.addClassOrderFun('save')
          } else {
            this.updateClassOrderFun('save')
          }
        } else {
          setTimeout(() => {
            const isError = document.getElementsByClassName('is-error')
            isError[0].querySelector('input').focus()
          }, 1)
          return false
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
        introduce: this.contractOrderData.introduce, // 转介绍家长id
        signType: this.contractOrderData.signType, // 签约类型
        classpkg: JSON.stringify(this.contractOrderData.shopTableList), // 课时包数据
        teachTools: JSON.stringify(this.contractOrderData.goodsTableList), // 物资数据
        oriMoney: this.classPriceTotal || 0, // 原价
        taOriMoney: this.materialPriceAll || 0, // 教具原价
        dictMoney: this.classRealPriceTotal || 0, // 折扣价
        saleUser: JSON.stringify(this.contractOrderData.sellTableList), // 销售占比
        taMoney: this.materialRealPriceAll || 0, // 教具总价
        remark: this.contractOrderData.detail || '', // 备注
        // startTime: this.contractOrderData.picker[0] || '', // 合同开始时间
        // endTime: this.contractOrderData.picker[1] || '', // 合同结束时间
        expireInvalid: this.contractOrderData.expireCheck ? 1 : 0, // 合同到期是否作废
        payway: '', // 收款单信息
        // bExtMoney: '', // 余额支付金额
        // extPeriod: Number(this.contractOrderData.giveTime) || '', // 赠送课时数量
        // extPeriodMoney: Number(this.contractOrderData.giveAllPrice) || '', // 赠送课时成本
        signTime: this.contractOrderData.data || '', // 合同签订日期
        // extPeriodReason: this.contractOrderData.giveBeacuse || '', // 赠课原因
        imgUrl: imgArray.join(',') || '', // 合同附件
        extType: this.contractOrderData.giveType || '', // 赠课类型
        courseId: this.contractOrderData.selectClasses || '' // 课程id
      }

      // 没有选择转介绍的时候，转介绍传入为空
      if (this.contractOrderData.signType !== '2') {
        params.introduce = ''
      }

      // eslint-disable-next-line
      if (this.contractOrderData.orderType == "2") {
        params.extPeriod = Number(this.contractOrderData.giveTime) || ''
        params.extPeriodMoney =
          Number(this.contractOrderData.giveAllPrice) || ''
        params.extPeriodReason = this.contractOrderData.giveBeacuse || ''
        params.startTime =
          this.contractOrderData.picker && this.contractOrderData.picker[0]
        params.endTime =
          this.contractOrderData.picker && this.contractOrderData.picker[1]
        // eslint-disable-next-line
      } else if (this.contractOrderData.orderType == "3") {
        params.extNursery = Number(this.contractOrderData.giveDatas) || 0
        params.extNurseryMoney =
          Number(this.contractOrderData.giveAllPrice) || 0
        params.extNurseryReason = this.contractOrderData.giveBeacuse || ''
        params.startTime = this.contractOrderData.startTime
        params.endTime = this.contractOrderData.endTime
      }

      // 提交的时间
      if (this.contractOrderData.orderType === '2') {
        params.startTime = this.contractOrderData.picker[0] // 合同开始时间
        params.endTime = this.contractOrderData.picker[1] // 合同结束时间
      } else {
        params.startTime = this.contractOrderData.startTime // 合同开始时间
        params.endTime = this.contractOrderData.endTime // 合同结束时间
      }

      // 赠送课时的数量和成本
      if (this.contractOrderData.orderType === '2') {
        params.extPeriod = Number(this.contractOrderData.giveTime) || ''
        params.extPeriodMoney =
          Number(this.contractOrderData.giveAllPrice) || ''
        params.extPeriodReason = this.contractOrderData.giveBeacuse || ''
        // eslint-disable-next-line
      } else if (this.contractOrderData.orderType === '3') {
        params.extNursery = Number(this.contractOrderData.giveDatas) || 0
        params.extNurseryMoney =
          Number(this.contractOrderData.giveAllPrice) || 0
        params.extNurseryReason = this.contractOrderData.giveBeacuse || ''
      }

      // 商品部分没有填写全局报错
      let isCountinue = true
      this.contractOrderData.shopTableList.forEach(item => {
        // eslint-disable-next-line
        if (!item.pid && item.pid == "") {
          const text =
            this.contractOrderData.orderType === '3'
              ? '请选择托班套餐; 如果不需要请删除托班套餐输入项'
              : '请选择课时包; 如果不需要请删除课时包输入项'
          this.$message.error(text)
          isCountinue = false
        }
      })

      // 物资部分没有填写全局报错
      this.contractOrderData.goodsTableList.forEach(item => {
        // eslint-disable-next-line
        if (!item.taId && item.taId == "") {
          this.$message.error('请选择物资; 如果不需要请删除物资输入项')
          isCountinue = false
        }
      })
      // 关联销售判断
      let rateAll = 0
      this.contractOrderData.sellTableList.forEach(item => {
        if (!item.userId || !item.rate || item.userId === '' || item.rate === '') {
          isCountinue = false
          this.$message.error('请完善关联销售信息')
          return
        }
        rateAll += item.rate
      })
      if (!isCountinue) {
        return
      }
      if (rateAll !== 100) {
        this.$message.error('关联销售总占比应为100%')
        isCountinue = false
      }

      if (!isCountinue) {
        return
      }

      // eslint-disable-next-line
      if (type == "save") {
        updateClassOrder(params).then(res => {
          if (res.data.errorCode === 0) {
            this.$message.success(res.data.errorMessage)
            this.contractOrderDialogShow = false
            this.$emit('toContractList')
          } else {
            this.$message.error(res.data.errorMessage || '合同保存失败')
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

    /* 保存新增合同 */
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
        introduce: this.contractOrderData.introduce, // 转介绍家长id
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
        extPeriod: Number(this.contractOrderData.giveTime) || '', // 赠送课时数量
        extPeriodMoney: Number(this.contractOrderData.giveAllPrice) || '', // 赠送课时成本
        signTime: this.contractOrderData.data || '', // 合同签订日期
        // extPeriodReason: this.contractOrderData.giveBeacuse || '', // 赠课原因
        imgUrl: imgArray.join(',') || '', // 合同附件
        extType: this.contractOrderData.giveType || '', // 赠课类型
        courseId: this.contractOrderData.selectClasses || '', // 课程id
        studentType: this.studentType || '',
        targetStuId: this.targetStuId || '',
        checkedCities: this.checkedCities // 套餐类型选择
      }

      if (this.contractOrderData.signType !== '2') {
        params.introduce = ''
      }

      // 提交的时间
      if (this.contractOrderData.orderType === '2') {
        params.startTime = this.contractOrderData.picker[0] // 合同开始时间
        params.endTime = this.contractOrderData.picker[1] // 合同结束时间
      } else {
        params.startTime = this.contractOrderData.startTime // 合同开始时间
        params.endTime = this.contractOrderData.endTime // 合同结束时间
      }

      // 赠送课时的数量和成本
      if (this.contractOrderData.orderType === '2') {
        params.extPeriod = Number(this.contractOrderData.giveTime) || ''
        params.extPeriodMoney =
          Number(this.contractOrderData.giveAllPrice) || ''
        params.extPeriodReason = this.contractOrderData.giveBeacuse || ''
        // eslint-disable-next-line
      } else if (this.contractOrderData.orderType === '3') {
        params.extNursery = Number(this.contractOrderData.giveDatas) || 0
        params.extNurseryMoney =
          Number(this.contractOrderData.giveAllPrice) || 0
        params.extNurseryReason = this.contractOrderData.giveBeacuse || ''
      }

      // 商品部分没有填写全局报错
      let isCountinue = true
      this.contractOrderData.shopTableList.forEach(item => {
        // eslint-disable-next-line
        if (!item.pid && item.pid == "") {
          const text =
            this.contractOrderData.orderType === '3'
              ? '请选择托班套餐; 如果不需要请删除托班套餐输入项'
              : '请选择课时包; 如果不需要请删除课时包输入项'
          this.$message.error(text)
          isCountinue = false
        }
      })

      // 物资部分没有填写全局报错
      this.contractOrderData.goodsTableList.forEach(item => {
        // eslint-disable-next-line
        if (!item.taId && item.taId == "") {
          this.$message.error('请选择物资; 如果不需要请删除物资输入项')
          isCountinue = false
        }
      })
      // 关联销售判断
      let rateAll = 0
      this.contractOrderData.sellTableList.forEach(item => {
        if (!item.userId || !item.rate || item.userId === '' || item.rate === '') {
          isCountinue = false
          this.$message.error('请完善关联销售信息')
          return
        }
        rateAll += item.rate
      })
      if (!isCountinue) {
        return
      }

      if (rateAll !== 100) {
        this.$message.error('关联销售总占比应为100%')
        isCountinue = false
      }

      if (!isCountinue) {
        return
      }

      // 保存选项
      if (type === 'save') {
        addClassOrder(params).then(res => {
          if (res.data.errorCode === 0) {
            this.$message.success(res.data.errorMessage)
            this.contractOrderDialogShow = false
            this.$emit('toContractList')
            this.$emit('toUpdateStuList')
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
          if (this.rowlistData && this.rowlistData === 'add') {
            this.addClassOrderFun('repice')
          } else {
            this.updateClassOrderFun('repice')
          }
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
          amount: 1,
          money: '0'
        }
      ]
      this.contractOrderData.goodsTableList = [
        {
          taId: '',
          price: '0.00',
          aTotalPrice: '0.00',
          preferentialPrice: '0.0元/0.0折',
          amount: 1,
          money: '0'
        }
      ]
      this.contractOrderData.sellTableList = [
        {
          userId: '',
          rate: 100
        }
      ]
      this.contractOrderData.atotalPrice = 0
      this.contractOrderData.atotalRealPrice = 0
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
          } else {
            // alert('请先选托班套餐')
            this.$message.error('请先选择托班套餐')
          }
        })
        // 赠送天数处理
        if (
          this.contractOrderData.giveDatas &&
          this.contractOrderData.giveDatas > 0
        ) {
          endDate = endDate.add(this.contractOrderData.giveDatas, 'days')
        }
        this.contractOrderData.endTime = endDate.format('YYYY-MM-DD')
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
          if (this.packageStatus && this.packageStatus == "0") {
            this.disabledClass = true
          } else {
            this.disabledClass = false
          }
          // eslint-disable-next-line
          if (this.materialStatus && this.materialStatus == "0") {
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
      this.signTypetwo()
    },

    // 查询是否可以续约
    signTypetwo() {
      const params = {
        stuId: this.contractOrderData.stuId
      }
      this.checkRenewFun(params)
    },

    // 获取查询是否可以续约的借口
    checkRenewFun(params) {
      checkRenew(params).then(res => {
        if (res.data.renewEnable === 'true') {
          this.disabledsignType = false // 续约按钮可以点击
          this.disabledsignTypeToolTip = true // 续约气泡不展示
        } else {
          this.disabledsignType = true // 续约按钮不可点击
          this.disabledsignTypeToolTip = false // 续约气泡展示
          // this.contractOrderData.signType = '0' // 不能续约选中新签约按钮
        }
      })
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
    materailChangeValue(value, index) {
      this.contractOrderData.goodsTableList[index].amount = 1
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
                itemTeach.singleMoney =
                  Number(itemTeach.money) / Number(itemTeach.amount)
              }
            })
          }
        })
      this.materialTotalPriceChange()
    },
    /* 物资中数量值改变 */
    materialAmount(value, child) {
      // this.allTeachList &&
      //   this.allTeachList.length > 0 &&
      //   this.allTeachList.map(item => {
      //     // eslint-disable-next-line
      //     if (child.taId == item.id) {
      //       child.money = value * item.realPrice
      //       child.aTotalPrice = value * item.price
      //       child.downPrice = (
      //         Number(child.aTotalPrice) - Number(child.money)
      //       ).toFixed(2)
      //       child.prePrice = (
      //         (Number(child.money) * 10) /
      //         Number(child.aTotalPrice)
      //       ).toFixed(2)
      //       child.preferentialPrice =
      //         child.downPrice + '元' + '/' + child.prePrice + '折'
      //     }
      //   })

      // eslint-disable-next-line eqeqeq
      if (!value && value == '') {
        return
      } else if (value && isNaN(value)) {
        this.$message.error('请输入数字！')
        child.amount = '1'
        return
      }
      this.contractOrderData.goodsTableList[child].amount = 1
      child.money = (value * child.singleMoney).toFixed(2)
      child.aTotalPrice = (value * child.price).toFixed(1)
      child.downPrice = (
        Number(child.aTotalPrice) - Number(child.money)
      ).toFixed(2)
      child.prePrice = (
        (Number(child.money) * 10) /
        Number(child.aTotalPrice)
      ).toFixed(2)
      child.preferentialPrice =
        child.downPrice + '元' + '/' + child.prePrice + '折'
      this.materialTotalPriceChange()
    },

    /** 实收价格change */
    priceChange(index, type) {
      let totalMoney = 0
      let classRealPriceTotal = 0
      let materialPriceAll = 0
      let offPrice = 0
      let offPre = 0

      if (type === 'class') {
        // 课时包/托班
        offPrice =
          Number(this.contractOrderData.shopTableList[index].aTotalPrice) -
          Number(this.contractOrderData.shopTableList[index].money)
        offPre =
          (Number(this.contractOrderData.shopTableList[index].money) /
            Number(this.contractOrderData.shopTableList[index].amount) /
            Number(this.contractOrderData.shopTableList[index].price)) *
          10
        this.contractOrderData.shopTableList[index].preferentialPrice =
          offPrice.toFixed(2) + '元/' + offPre.toFixed(2) + '折'
        this.contractOrderData.shopTableList[index].singleMoney =
          Number(this.contractOrderData.shopTableList[index].money) /
          Number(this.contractOrderData.shopTableList[index].amount)
      } else {
        // 物资
        offPrice =
          Number(this.contractOrderData.goodsTableList[index].aTotalPrice) -
          Number(this.contractOrderData.goodsTableList[index].money)
        offPre =
          (Number(this.contractOrderData.goodsTableList[index].money) /
            Number(this.contractOrderData.goodsTableList[index].amount) /
            Number(this.contractOrderData.goodsTableList[index].price)) *
          10
        this.contractOrderData.goodsTableList[index].preferentialPrice =
          offPrice.toFixed(2) + '元/' + offPre.toFixed(2) + '折'
        this.contractOrderData.goodsTableList[index].singleMoney =
          Number(this.contractOrderData.goodsTableList[index].money) /
          Number(this.contractOrderData.goodsTableList[index].amount)
      }

      this.contractOrderData.shopTableList.forEach(item => {
        classRealPriceTotal += Number(item.money)
        totalMoney += Number(item.money)
      })
      this.contractOrderData.goodsTableList.forEach(item => {
        materialPriceAll += Number(item.money)
        totalMoney += Number(item.money)
      })

      this.classRealPriceTotal = classRealPriceTotal
      this.materialRealPriceAll = materialPriceAll
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
    classChangeValue(value, index) {
      this.contractOrderData.shopTableList[index].amount = 1
      this.allClassesList &&
        this.allClassesList.length > 0 &&
        this.allClassesList.map(item => {
          // eslint-disable-next-line
          if (value == item.id) {
            this.contractOrderData.shopTableList.map(itemClass => {
              // eslint-disable-next-line
              if (itemClass.pid == item.id) {
                itemClass.price = item.price
                itemClass.singleMoney = item.realPrice
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
      // this.allClassesList &&
      //   this.allClassesList.length > 0 &&
      //   this.allClassesList.map(item => {
      //     // eslint-disable-next-line
      //     if (child.pid == item.id) {
      //       child.money = value * item.realPrice
      //       child.aTotalPrice = value * item.price
      //       child.downPrice = (
      //         Number(child.aTotalPrice) - Number(child.money)
      //       ).toFixed(2)
      //       child.prePrice = (
      //         (Number(child.money) * 10) /
      //         Number(child.aTotalPrice)
      //       ).toFixed(2)
      //       child.preferentialPrice =
      //         child.downPrice + '元' + '/' + child.prePrice + '折'
      //     }
      //   })

      // eslint-disable-next-line eqeqeq
      if (!value && value == '') {
        return
      } else if (value && isNaN(value)) {
        this.$message.error('请输入数字！')
        child.amount = 1
        return
      }

      child.money = (value * child.singleMoney).toFixed(2)
      child.aTotalPrice = (value * child.price).toFixed(1)
      child.downPrice = (
        Number(child.aTotalPrice) - Number(child.money)
      ).toFixed(2)
      child.prePrice = (
        (Number(child.money) * 10) /
        Number(child.aTotalPrice)
      ).toFixed(2)
      child.preferentialPrice =
        child.downPrice + '元' + '/' + child.prePrice + '折'

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
        amount: 1,
        money: '0',
        singleMoney: '0'
      }
      this.contractOrderData.shopTableList.push(tempData)
    },
    /* 删除商品表格行 */
    delShopTableRow(index) {
      this.contractOrderData.shopTableList.splice(index, 1)
      this.shopTotalPriceChange()
    },
    /* 物资添加表格行 */
    addGoodsClass() {
      const tempData = {
        taId: '',
        price: '0.00',
        aTotalPrice: '0.00',
        preferentialPrice: '0.0元/0.0折',
        amount: 1,
        money: '0',
        singleMoney: '0'
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
        rate: 100
      }
      this.contractOrderData.sellTableList.push(tempData)
      this.addSellInfoOne()
    },
    // 销售信息表格有一行
    addSellInfoOne() {
      if (this.contractOrderData.sellTableList.length <= 1) {
        this.delSellTableRowHidden = false
      } else {
        this.delSellTableRowHidden = true
      }
    },
    /* 删除销售表格行 */
    delSellTableRow(index) {
      this.contractOrderData.sellTableList.splice(index, 1)
      this.addSellInfoOne()
    },
    /* 精确查找弹框 */
    openSearchDialog() {
      this.$refs.exactSearchDialog.showDialog('contract')
    },
    /* 上传照片 */
    handleRemove(file, fileList) {
      const newFileList = []
      // eslint-disable-next-line
      if (file.status == "success") {
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
      if (file.status == "success") {
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
      this.contractOrderData.data = ''
      this.contractOrderData.picker = ''
      this.contractOrderData.startTime = ''
      this.contractOrderData.endTime = ''
      if (value === '3') {
        this.isExpireCheckShow = false
        this.isShowCardNum = false
        this.isGiveInfoShow = false
        this.isGiveInfoFalse = false // 赠课天数和原因不显示
        this.checkedCities = ['0'] // 课时套餐的选择
        this.isShowGoodsClass = true // 课时包或者托班套餐内容显示
        this.isShowGoodsMate = false // 物资内容不显示
        this.isGiveInfoShow = false // 赠课类型内容不显示
        this.isGiveInfoFalse = false // 赠课天数内容不显示
        this.queryContractProductFun(value)
        this.clearFromArrayData()
        this.contractOrderData.goodsTableList = [] // 置空物资选项
      }
      // eslint-disable-next-line
      if (value == "2") {
        this.isExpireCheckShow = false
        this.isShowCardNum = true
        this.isGiveInfoFalse = false
        this.isGiveInfoShow = false
        this.checkedCities = ['0'] // 课时套餐的选择
        this.isShowGoodsClass = true // 课时包或者托班套餐内容显示
        this.isShowGoodsMate = false // 物资内容不显示
        this.isGiveInfoShow = false // 赠课类型内容不显示
        this.isGiveInfoFalse = false // 赠课天数内容不显示
        this.queryContractProductFun('1')
        this.clearFromArrayData()
      }
      this.contractOrderData.giveDatas = ''
    },
    /* 赠课类型单选框改变 */
    giveTypeValue(value) {
      // eslint-disable-next-line
      if (value == "1") {
        this.isSelectClassShow = false
      }
      // eslint-disable-next-line
      if (value == "2") {
        this.contractOrderData.selectClasses = ''
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
