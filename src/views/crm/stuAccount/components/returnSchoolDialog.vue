<template>
  <div class="returnSchoolDialog_container">
    <el-dialog
      :visible.sync="returnSchoolDialogShow"
      title="转校"
      @close="cancelDialog('returnSchoolForm')"
    >
      <el-form
        ref="returnSchoolForm"
        :model="returnSchoolData"
        label-width="90px"
      >
        <el-form-item
          label="学员账户号:"
          prop="auth"
        >
          <span>{{ stuAccountId }}</span>
        </el-form-item>
        <el-form-item
          label="转出学员:"
          prop="outStuId"
        >
          <el-select
            v-model="returnSchoolData.outStuId"
            clearable
            placeholder="请选择转出学员"
            style="width: 80%"
          >
            <el-option
              v-for="item in allReturnStuData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <span
            style="margin-left: 10px; color: #5d9cec; cursor: pointer;"
            @click="findTableDialog"
          >精确查找</span>
        </el-form-item>
        <el-form-item
          label="转出合同:"
          prop="outPurNum"
        >
          <el-select
            v-model="returnSchoolData.outPurNum"
            clearable
            placeholder="请选择转出合同"
            style="width: 100%"
            @change="returnContractChange"
          >
            <el-option
              v-for="item in allReturnContract"
              :key="item.id"
              :label="item.orderNum"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="转出课时:"
          prop="order"
        >
          <div class="returnClassTable">
            <table border="1">
              <tr style="background: #f5f6f8">
                <th>课程名称</th>
                <th>转出课时</th>
              </tr>
              <tr
                v-for="(item, index) of allRrturnClassDataList"
                :key="index + '_returnClassData'"
              >
                <td>{{ item.courseName }}</td>
                <td>{{ item.periodLeft }}</td>
              </tr>
              <tr>
                <td>总计</td>
                <td>{{ returnSchoolData.outNum || '0' }}</td>
              </tr>
            </table>
          </div>
        </el-form-item>
        <el-form-item
          label="转出金额:"
          prop="returnClassAllPrice"
        >
          <el-input
            v-model="returnClassAllPrice"
            clearable
            placeholder="请输入转出金额"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="转入校区:"
          prop="orgIdName"
        >
          <el-select
            v-model="returnSchoolData.orgIdName"
            clearable
            placeholder="请选择转入校区"
            style="width: 100%"
            @change="importSchoolChange"
          >
            <el-option
              v-for="item in allImportSchool"
              :key="item.orgId"
              :label="item.orgName"
              :value="item.orgId"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="转入课时:"
          prop="order"
        >
          <div class="joinTableRow">
            <el-table
              :data="addRowTable"
              style="width: 350px"
            >
              <el-table-column
                label="课程名称"
                prop="inCourseId"
                width="150"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.inCourseId"
                    size="small"
                    clearable
                    placeholder="请选择课程"
                  >
                    <el-option
                      v-for="item in allImportClass"
                      :key="item.id"
                      :label="item.title"
                      :value="item.id"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="转入课时"
                prop="inCourseNum"
                width="150"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model.number="scope.row.inCourseNum"
                    size="small"
                    clearable
                    placeholder="转入数量"
                    @change="importClassNumChange"
                  />
                </template>
              </el-table-column>
              <el-table-column width="50">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="deleteTableRow(scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <span
              style="color: #5d9cec; cursor: pointer"
              @click="addReturnRow"
            >新增</span>
            <div class="tableTotalRow">
              <table border="1">
                <tr>
                  <td style="width: 150px;">总计</td>
                  <td>{{ returnSchoolData.inNum || '0' }}</td>
                </tr>
              </table>
            </div>
          </div>
        </el-form-item>
        <el-form-item
          label="转入金额:"
          prop="inMoney"
        >
          <el-input
            v-model="returnSchoolData.inMoney"
            clearable
            placeholder="请输入转入金额"
            @keyup.native="inClassPriceChange"
          />
        </el-form-item>
        <el-form-item
          label="转校手续费:"
          prop="fee"
        >
          <el-input
            v-model="returnSchoolData.fee"
            clearable
            placeholder="请输入转校手续费"
            disabled
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog('returnSchoolForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitFrom('returnSchoolForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 精确查找弹框组件 -->
    <FindTableDialog ref="findTableDialog" />
  </div>
</template>

<script>
import {
  getCardAppointPeriod, // 是否有约课记录
  cardStuInfoById, // 适用学员下拉信息数据
  cardPurInfoById, // 转出合同下拉数据
  getTranSchCourseInfoByPurId, // 可转校课时信息
  queryOrgList, // 转入校区列表
  summaryQueryCourse, // 转入课时列表
  createTransfer // 确定提交转校
} from '@/api/crm/stuAccount/stuAccount.js'
import FindTableDialog from './findTableDialog.vue'
export default {
  components: {
    FindTableDialog // 精确查找弹框
  },
  data() {
    return {
      returnSchoolDialogShow: false,
      returnSchoolData: {
        inNum: 0,
        cardId: '', // 会员卡号
        outStuId: '', // 转出学员ID
        outPurId: '', // 转出合同ID
        outPurNum: '', // 转出合同编号
        outCourseInfo: '', // 转出课程信息
        outNum: '', // 转出课时总数量
        outMoney: '', // 转出课时总金额
        inOrgId: '', // 转入机构ID
        inMoney: '0', // 转入课时总金额
        fee: '' // 手续费
      },
      allStudents: [
        {
          value: 'yizhi',
          label: '一致'
        },
        {
          value: 'fankui',
          label: '反馈'
        },
        {
          value: 'xiaolv',
          label: '效率'
        },
        {
          value: 'kekong',
          label: '可控'
        }
      ],
      addRowTable: [
        {
          inCourseId: '', // 转入课程信息
          inCourseNum: 0 // 转入课时总数量
        }
      ],
      stuAccountId: '', // 学员账户号
      cardInfoData: {}, // 会员卡信息数据
      allReturnStuData: [], // 转出学员下拉列表数据
      allReturnContract: [], // 转出合同下拉列表数据
      allRrturnClassDataList: [], // 转出课时表格数据
      arrayAllReturnClass: [], // 转出课时表处理后的数据
      returnClassAllPrice: '', // 转出金额
      allImportSchool: [], // 转入校区列表数据
      allImportClass: [] // 转入课时下拉数据
    }
  },
  methods: {
    /* 是否有约课记录 */
    getCardAppointPeriodFun(rowlist) {
      const params = {
        cardId: rowlist.id
      }
      getCardAppointPeriod(params).then(res => {
        if (res.data.errorCode === 0) {
          if (res.data.falg === true) {
            this.$message.error('此会员卡下有未处理的约课记录，不能进行转校操作')
            this.returnSchoolDialogShow = false
          } else {
            this.returnSchoolDialogShow = !this.returnSchoolDialogShow
          }
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 适用学员下拉数据列表 */
    getCardStuInfoById(rowlist) {
      const params = {
        id: rowlist.id
      }
      cardStuInfoById(params).then(res => {
        if (res.data.errorCode === 0) {
          this.allReturnStuData = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 转出合同下拉数据 */
    cardPurInfoByIdFun(rowlist) {
      const params = {
        id: rowlist.id
      }
      cardPurInfoById(params).then(res => {
        if (res.data.errorCode === 0) {
          this.allReturnContract = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 转出合同输入框值改变 */
    returnContractChange(value) {
      this.arrayAllReturnClass = []
      this.allReturnContract.map((item, index) => {
        if (value === item.id) {
          this.returnSchoolData.outPurNum = item.orderNum
          this.returnSchoolData.outPurId = item.id
        }
      })
      this.getTranSchCourseInfoByPurIdFun(value) // 可转校课时信息
    },
    /* 可转校课时信息数据 */
    getTranSchCourseInfoByPurIdFun(value) {
      const params = {
        purchaseId: value,
        cardId: this.cardInfoData.id
      }
      let outNumAll = 0
      getTranSchCourseInfoByPurId(params).then(res => {
        if (res.data.errorCode === 0) {
          this.allRrturnClassDataList = res.data.results
          res.data.results.map((item, index) => {
            const allRrturnClassDataListRow = {
              outCourseId: item.courseId,
              outCourseNum: item.periodLeft
            }
            outNumAll += parseInt(item.periodLeft)
            this.returnSchoolData.outNum = outNumAll
            this.arrayAllReturnClass.push(allRrturnClassDataListRow)
          })
          this.returnClassAllPrice = res.data.moneyAvailable + ''
          this.returnSchoolData.fee = parseFloat(this.returnClassAllPrice - this.returnSchoolData.inMoney) + ''
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 转入校区下拉列表 */
    queryOrgListFun() {
      queryOrgList().then(res => {
        if (res.data.errorCode === 0) {
          this.allImportSchool = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 转入校区输入框值改变 */
    importSchoolChange(value) {
      this.allImportSchool.map((item, index) => {
        if (value === item.orgId) {
          this.returnSchoolData.inOrgId = item.orgId
        }
      })
      this.summaryQueryCourseFun(value)
    },
    /* 转入课时列表数据 */
    summaryQueryCourseFun(value) {
      const params = {
        reqOrgId: value
      }
      summaryQueryCourse(params).then(res => {
        if (res.data.errorCode === 0) {
          this.allImportClass = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 转入金额输入框值改变 */
    inClassPriceChange() {
      if (this.returnSchoolData.inMoney) {
        this.returnSchoolData.fee = parseFloat(this.returnClassAllPrice - this.returnSchoolData.inMoney) + ''
      }
    },
    /* 转入课时数量输入框值改变 */
    importClassNumChange(value) {
      let numAll = 0
      this.addRowTable.forEach((item, index) => {
        numAll += parseInt(item.inCourseNum)
      })
      this.returnSchoolData.inNum = numAll
    },
    /* 新增转入课时表单 */
    addReturnRow() {
      const rowData = {
        inCourseId: '', // 转入课程信息
        inCourseNum: 0 // 转入课时总数量
      }
      this.addRowTable.push(rowData)
    },
    /* 显示弹框 */
    showDialog(rowList) {
      this.cardInfoData = rowList
      this.stuAccountId = rowList.id
      this.getCardAppointPeriodFun(rowList) // 是否有约课
      this.getCardStuInfoById(rowList) // 转出学员
      this.cardPurInfoByIdFun(rowList) // 转出合同编号
      this.queryOrgListFun() // 转入校区
    },
    /* 删除表格行 */
    deleteTableRow(val) {
      const rowIndex = this.addRowTable.indexOf(val)
      this.addRowTable.splice(rowIndex, 1)
    },
    /* 精确查找弹框 */
    findTableDialog() {
      this.$refs.findTableDialog.showDialog()
    },
    /* 关闭弹框 */
    cancelDialog(formName) {
      this.returnSchoolDialogShow = false
      this.$refs[formName].resetFields()
      this.$emit('toClose')
    },
    /* 提交弹框 */
    submitFrom(formName) {
      const inFlag = this.addRowTable.every(item => {
        return item.inCourseId && item.inCourseNum
      })
      if (!inFlag) {
        this.$message.error('转入课时信息有误,请检查')
        return
      }
      const params = {
        cardId: this.cardInfoData.id, // 会员卡号
        outStuId: this.returnSchoolData.outStuId, // 转出学员ID
        outPurId: this.returnSchoolData.outPurId, // 转出合同ID
        outPurNum: this.returnSchoolData.outPurNum, // 转出合同编号
        outCourseInfo: JSON.stringify(this.arrayAllReturnClass), // 转出课程信息
        outNum: this.returnSchoolData.outNum + '', // 转出课时总数量
        outMoney: this.returnClassAllPrice, // 转出课时总金额
        inOrgId: this.returnSchoolData.inOrgId, // 转入机构ID
        inCourseInfo: JSON.stringify(this.addRowTable), // 转入课程信息
        inNum: this.returnSchoolData.inNum + '', // 转入课时总数量
        inMoney: this.returnSchoolData.inMoney || '0', // 转入课时总金额
        fee: this.returnSchoolData.fee // 手续费
      }
      console.info('params---->', params)
      this.$refs[formName].validate(valid => {
        if (valid) {
          createTransfer(params).then(res => {
            if (res.data.errorCode === 0) {
              console.log('res.value00000000', res)
              this.returnSchoolDialogShow = false
              this.$message.success(res.data.errorMessage)
              this.$emit('toClose')
            } else {
              this.$message.error(res.data.errorMessage)
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.returnSchoolDialog_container /deep/ {
  .el-dialog {
    width: 600px;
  }
  .delete_btn_style {
    width: 30px;
    display: inline-block;
    color: #5d9cec;
    line-height: 53px;
    margin-left: 5px;
  }
  .returnClassTable {
    table {
      border-collapse: collapse;
    }
    table,
    td,
    th {
      border: 1px solid #ddd;
    }
    table {
      width: 300px;
      border-right: 0;
    }
    th {
      height: 32px;
    }
    td {
      height: 32px;
      text-align: center;
    }
  }
  .joinTableRow {
    .el-table td,
    .el-table th.is-leaf {
      border-left: 1px solid #ebeef5;
      border-bottom: 0;
    }
    .el-table td,
    .el-table th.is-leaf:nth-child(1) {
      border-top: 1px solid #ebeef5;
    }
    .el-table td,
    .el-table th.is-leaf:nth-child(2) {
      border-top: 1px solid #ebeef5;
    }
    .el-table td:nth-child(3) {
      border-top: 0;
    }
    .tableTotalRow {
      table {
        border-collapse: collapse;
      }
      table,
      td,
      th {
        border: 1px solid #ebeef5;
      }
      table {
        width: 300px;
        border-right: 0;
      }
      th {
        height: 32px;
      }
      td {
        height: 32px;
        text-align: center;
      }
    }
  }
}
</style>

