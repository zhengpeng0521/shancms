<template>
  <div
    v-if="returnClassesDialogShow"
    class="returnClassesDialog_container"
  >
    <el-dialog
      :visible.sync="returnClassesDialogShow"
      title="转移课时"
      @close="cancelDialog('returnClassesForm')"
    >
      <el-form
        ref="returnClassesForm"
        :model="returnClassesData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item
          label="学员账户号:"
          prop="auth"
        >
          <span>{{ stuAccountId }}</span>
        </el-form-item>
        <el-form-item
          label="合同编号:"
          prop="purchaseId"
        >
          <el-select
            v-model="returnClassesData.purchaseId"
            clearable
            placeholder="请选择合同编号"
            style="width: 100%"
            @change="contractNoChange"
          >
            <el-option
              v-for="item in contractListData"
              :key="item.id"
              :label="item.orderNum"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <div v-show="dialogConShow">
          <span style="margin-bottom: 10px; display: inline-block;">转出课程</span>
          <el-table
            :data="outClassData"
            style="width: 100%"
            border
          >
            <el-table-column
              label="课时名称"
              prop="outCourseName"
              width="115"
            >
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.outCourseName"
                  size="small"
                  clearable
                  placeholder="课时名称"
                  @change="outClassChange"
                >
                  <el-option
                    v-for="item in allPurListData"
                    :key="item.courseId"
                    :label="item.courseName"
                    :value="item.courseId"
                    :disabled="inClassData[0].inCourseId == item.courseId"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              label="剩余课时"
              prop="periodLeft"
              width="100"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.periodLeft || '0' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="可转数量"
              prop="periodAvailable"
              width="110"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.periodAvailable || '0' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="转出数量"
              prop="outNum"
              width="110"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.outNum"
                  class="out_class_price"
                  style="color: #333"
                  size="small"
                  clearable
                  placeholder="转出数量"
                  @keyup.native="outClassNumChange"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="转出金额"
              prop="price"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.totalPrice"
                  size="small"
                  clearable
                  placeholder="转出金额"
                  disabled
                />
              </template>
            </el-table-column>
          </el-table>
          <span style="margin-top: 10px;margin-bottom: 10px; display: inline-block;">转进课程</span>
          <el-table
            :data="inClassData"
            style="width: 100%"
            border
          >
            <el-table-column
              label="课时名称"
              prop="inCourseName"
              width="185"
            >
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.inCourseName"
                  size="small"
                  clearable
                  placeholder="课时名称"
                  @change="inClassChange"
                >
                  <el-option
                    v-for="item in allCardClassList"
                    :key="item.courseId"
                    :label="item.courseName"
                    :value="item.courseId"
                    :disabled="outClassData[0].outCourseId == item.courseId"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              label="剩余课时"
              prop="periodLeft"
              width="180"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.periodLeft }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="转进数量"
              prop="inNum"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.inNum"
                  class="in_class_price"
                  size="small"
                  clearable
                  placeholder="转进数量"
                  @keyup.native="inClassNumChange"
                />
              </template>
            </el-table-column>
          </el-table>
          <el-form-item
            label="处理方式:"
            prop="type"
            style="margin-top: 10px;"
          >
            <el-radio-group
              v-model="returnClassesData.type"
              @change="radioValueChange(returnClassesData.type)"
            >
              <el-radio :label="1">平价</el-radio>
              <el-radio :label="2">补缴</el-radio>
              <el-radio :label="3">退费</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-show="payInputShow">
            <el-form-item
              label="补缴金额:"
              prop="money"
            >
              <el-input
                v-model="returnClassesData.money"
                clearable
                placeholder="请输入补缴金额"
              />
            </el-form-item>
          </div>
          <div v-show="backInputShow">
            <el-form-item
              label="退费金额:"
              prop="money"
            >
              <el-input
                v-model="returnClassesData.money"
                clearable
                placeholder="请输入退费金额"
              />
            </el-form-item>
          </div>
        </div>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog('returnClassesForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('returnClassesForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryOrderSummary, // 获取合同编号列表
  getCourseInfoByPurId, // 获取课时信息
  getCourseInfoByCardId, // 获取课程信息
  createTransferCourse // 确定转课记录
} from '@/api/crm/stuAccount/stuAccount.js'
export default {
  data() {
    return {
      returnClassesDialogShow: false, // 扣课顺序弹框显隐
      returnClassesData: {
        purchaseId: '', // 合同编号
        cardId: '', // 会员卡号
        type: '', // 类型 1.平价 2.补缴 3.退费
        money: '', // 补缴/退费金额
        creatorId: '' // 审核人id
      },
      outClassData: [
        {
          outCourseId: '', // 转出课程 id
          outCourseName: '', // 转出课程名字
          outNum: '', // 转出数量
          periodLeft: '', // 剩余课时
          periodAvailable: '', // 可转数量
          price: '', // 价格
          totalPrice: ''
        }
      ],
      inClassData: [
        {
          inCourseId: '', // 转进课程id
          inCourseName: '', // 转进课程名字
          inNum: '', // 转进数量
          periodLeft: '', // 剩余课时
          periodAvailable: '' // 可转数量
        }
      ],
      rules: {
        purchaseId: [
          { required: true, message: '请输入合同编号', trigger: 'change' }
        ]
      },
      contractListData: [], // 获取合同编号列表
      allPurListData: [], // 获取课时信息列表
      allCardClassList: [], // 获取课程信息列表
      cardInfoData: {}, // 会员卡信息数据
      stuAccountId: '', // 学员账户号
      dialogConShow: false, // 弹框主要内容显隐
      payInputShow: false, // 补缴金额输入框显隐
      backInputShow: false // 退费金额输入框显隐
    }
  },
  methods: {
    /* 合同编号下拉框列表数据 */
    getQueryOrderSummary(rowlist) {
      const params = {
        cardId: rowlist.id
      }
      this.cardInfoData = rowlist
      queryOrderSummary(params).then(res => {
        if (res.data.errorCode === 0) {
          this.contractListData = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 合同编号的值改变 */
    contractNoChange(value) {
      this.outClassData = [
        {
          outCourseId: '', // 转出课程 id
          outCourseName: '', // 转出课程名字
          outNum: '', // 转出数量
          periodLeft: '', // 剩余课时
          periodAvailable: '', // 可转数量
          price: '', // 价格
          totalPrice: ''
        }
      ]
      this.inClassData = [
        {
          inCourseId: '', // 转进课程id
          inCourseName: '', // 转进课程名字
          inNum: '', // 转进数量
          periodLeft: '', // 剩余课时
          periodAvailable: '' // 可转数量
        }
      ]
      const params = {
        purchaseId: value,
        cardId: this.cardInfoData.id
      }
      getCourseInfoByPurId(params).then(res => {
        if (res.data.errorCode === 0) {
          this.dialogConShow = true
          this.allPurListData = res.data.results
        } else {
          this.dialogConShow = false
          this.$message.error(res.data.errorMessage)
        }
      })
      getCourseInfoByCardId(params).then(res => {
        if (res.data.errorCode === 0) {
          this.dialogConShow = true
          this.allCardClassList = res.data.results
        } else {
          this.dialogConShow = false
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 转出课时下拉框值改变 */
    outClassChange(value) {
      this.allPurListData.map((item, index) => {
        if (item.courseId === value) {
          this.selectedOutClass = item
          this.outClassData = [
            {
              outCourseId: item.courseId, // 转出课程 id
              outCourseName: item.courseName, // 转出课程名字
              outNum: '', // 转出数量
              periodLeft: item.periodLeft, // 剩余课时
              periodAvailable: item.periodAvailable, // 可转数量
              price: item.price, // 价格
              totalPrice: 0
            }
          ]
        }
      })
    },
    /* 转入课时下拉框值改变 */
    inClassChange(value) {
      this.allCardClassList.map((item, index) => {
        if (item.courseId === value) {
          this.inClassData = [
            {
              inCourseId: item.courseId, // 转进课程id
              inCourseName: item.courseName, // 转进课程名字
              inNum: '', // 转进数量
              periodLeft: item.periodLeft, // 剩余课时
              periodAvailable: item.periodAvailable // 可转数量
            }
          ]
        }
      })
    },
    /* 转出数量输入框值改变 */
    outClassNumChange() {
      if (this.outClassData[0].outNum) {
        this.outClassData[0].totalPrice = parseFloat(this.outClassData[0].outNum * this.outClassData[0].price)
      }
      if (this.outClassData[0].outNum > this.outClassData[0].periodAvailable) {
        document.getElementsByClassName('out_class_price')[0].children[0].style.color = 'red'
      } else {
        document.getElementsByClassName('out_class_price')[0].children[0].style.color = 'black'
      }
    },
    /* 转进数量输入框值改变 */
    inClassNumChange() {
      // if (this.inClassData[0].inNum > this.inClassData[0].periodLeft) {
      //   document.getElementsByClassName('in_class_price')[0].children[0].style.color = 'red'
      // }
    },
    /* 转课弹框单选框值改变 */
    radioValueChange(value) {
      if (value === 1) {
        this.backInputShow = false
        this.payInputShow = false
        this.rules = {
          purchaseId: [
            { required: true, message: '请输入合同编号', trigger: 'change' }
          ]
        }
      }
      if (value === 2) {
        this.payInputShow = true
        this.backInputShow = false
        this.rules = {
          purchaseId: [
            { required: true, message: '请输入合同编号', trigger: 'change' }
          ],
          money: [
            { required: true, message: '请输入金额', trigger: 'change' }
          ]
        }
      }
      if (value === 3) {
        this.backInputShow = true
        this.payInputShow = false
        this.rules = {
          purchaseId: [
            { required: true, message: '请输入合同编号', trigger: 'change' }
          ],
          money: [
            { required: true, message: '请输入金额', trigger: 'change' }
          ]
        }
      }
    },
    /* 显示转移课时弹框 */
    showDialog(rowlist) {
      this.stuAccountId = rowlist.id
      this.returnClassesDialogShow = true
      this.dialogConShow = false
      this.payInputShow = false
      this.backInputShow = false
      this.getQueryOrderSummary(rowlist)
    },
    /* 确定提交扣课顺序弹框 */
    submitForm(formName) {
      const params = {
        purchaseId: this.returnClassesData.purchaseId || '', // 合同编号
        cardId: this.cardInfoData.id, // 会员卡号
        outCourseId: this.outClassData[0].outCourseId, // 转出课程 id
        outCourseName: this.outClassData[0].outCourseName, // 转出课程名字
        outNum: this.outClassData[0].outNum, // 转出数量
        inCourseId: this.inClassData[0].inCourseId, // 转进课程id
        inCourseName: this.inClassData[0].inCourseName, // 转进课程名字
        inNum: this.inClassData[0].inNum, // 转进数量
        type: this.returnClassesData.type, // 类型 1.平价 2.补缴 3.退费
        money: this.returnClassesData.money || '', // 补缴/退费金额
        creatorId: '' // 审核人id
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          createTransferCourse(params).then(res => {
            if (res.data.errorCode === 0) {
              this.returnClassesDialogShow = false
              this.$refs[formName].resetFields()
              this.$message.success(res.data.errorMessage)
            } else {
              this.$message.error(res.data.errorMessage)
            }
          })
        }
      })
    },
    /* 关闭扣课顺序弹框 */
    cancelDialog(formName) {
      this.returnClassesDialogShow = false
      this.$refs[formName].clearValidate() // 清除校验
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.returnClassesDialog_container /deep/ {
  .el-dialog {
    width: 600px;
  }
  .el-table th {
    background: #f0f2f5;
  }
  .el-table--border th {
    border-right: 0;
  }
  .el-table--border td {
    border-right: 0;
  }
  .el-input__inner {
    padding: 0 7px;
  }
}
</style>

