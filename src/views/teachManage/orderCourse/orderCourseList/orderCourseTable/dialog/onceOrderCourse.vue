<template>
  <div class="updateSignType">
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      title="单次约课"
      width="400px"
      @close="resetForm('ruleForm')"
    >
      <div>
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="30px"
        >
          <el-form-item>
            <el-radio-group
              v-model="ruleForm.orderType"
              @change="orderTypeChange"
            >
              <el-radio label="1">预约学员</el-radio>
              <el-radio label="2">预约班级</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-show="ruleForm.orderType == '1'">
            <el-select
              ref="stuSelect"
              v-model="ruleForm.stuId"
              filterable
              multiple
              placeholder="选择学员"
              style="width:245px"
            >
              <el-option
                v-for="item in newStuList"
                :key="item.stuId"
                :label="item.stuName"
                :value="item.stuId"
              />
            </el-select>
            <span
              class="search"
              @click="actSearch"
            >精确查找</span>
          </el-form-item>
          <el-form-item
            v-if="ruleForm.orderType == '2'"
            prop="gradeId"
          >
            <el-select
              v-model="ruleForm.gradeId"
              placeholder="选择班级"
              style="width:100%"
            >
              <el-option
                v-for="item in gradeList"
                :key="item.clsId"
                :label="item.clsName"
                :value="item.clsId"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="resetForm('ruleForm')"
        >取消</el-button>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
        >确定</el-button>
      </span>
    </el-dialog>
    <SelectStu
      v-if="isShow"
      ref="selectStu"
      @toParent="getCheckList"
      @toclose="close"
    />
    <!-- 预约异常 -->
    <OrderError ref="orderError" />
    <!-- 是否继续约课 -->
    <OrderCourseContinue
      ref="orderCourseContinue"
      @toContinueOrder="getContinueOrder"
    />
  </div>
</template>
<script>
import SelectStu from './selectStu'
import OrderCourseContinue from './orderCourseContinue'
import { classGradeSummary, stuSummaryQuery, stuCreate, stuCheckBirthday, gradeCreate } from '@/api/teachManage/orderCourse'
import OrderError from './orderError'
export default {
  components: {
    SelectStu,
    OrderError,
    OrderCourseContinue
  },
  data() {
    return {
      dialogVisible: false,
      ruleForm: {
        orderType: '1', // 预约类型
        stuId: [], // 学员
        gradeId: '' // 班级
      },
      rules: {
        gradeId: [
          { required: true, message: '请选择班级', trigger: 'change' }
        ]
      },
      newStuList: [], // 学员列表
      gradeList: [], // 班级列表
      rowInfo: {},
      isShow: false,
      detailList: {}
    }
  },
  methods: {
    show(val, detail) {
      this.newStuList = []
      this.gradeList = []
      this.rowInfo = val
      this.detailList = detail
      this.dialogVisible = true
      this.ruleForm.stuId = []
      this.ruleForm.orderType = '1'
      if (val) {
        this.getGradeList()
      }
      this.getStuList()
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })
    },
    /* 班级列表 */
    getGradeList() {
      const params = {
        courseId: this.detailList.courseId
      }
      classGradeSummary(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.gradeList = data.results
        } else {
          this.$message.error(data.errorMessage || '获取班级摘要列表失败')
        }
      })
    },
    /* 学员列表 */
    getStuList() {
      stuSummaryQuery({ type: '2' }).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          const stuList = data.results
          stuList.map((item, index) => {
            const stuObj = {}
            const name = item.stuName + ' (' + item.month + '月)'
            stuObj.stuName = name
            stuObj.stuId = item.stuId
            this.newStuList.push(stuObj)
          })
        } else {
          this.$message.error(data.errorMessage || '获取学员摘要列表失败')
        }
      })
    },
    /* 学员约课 */
    stuCreate() {
      let stuIds = ''
      if (this.ruleForm.stuId && this.ruleForm.stuId.length > 0) {
        stuIds = this.ruleForm.stuId.join(',')
        const params = {
          cpmId: this.detailList.cpmId,
          cpdIds: this.detailList.cpdId,
          stuId: stuIds
        }
        stuCreate(params).then(res => {
          const data = res.data
          if (data.errorCode === 0) {
            this.$emit('toUpdateOnceOrder', this.detailList)
            if (data.message && Object.keys(data.message).length > 0) {
              this.$refs.orderError.show(data.message, data.cutType, this.detailList)
            } else {
              this.$message.success(data.errorMessage)
            }
            this.dialogVisible = false
          } else {
            this.$message.error(data.errorMessage || '单次约课失败')
          }
        })
      }
    },
    /* 继续约课 */
    getContinueOrder() {
      this.stuCreate()
      this.dialogVisible = false
    },
    /* 确定 */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.orderType == '1') { //eslint-disable-line
            let stuIds = ''
            if (this.ruleForm.stuId && this.ruleForm.stuId.length > 0) {
              stuIds = this.ruleForm.stuId.join(',')
              const payload = {
                cpmId: this.detailList.cpmId,
                stuId: stuIds
              }
              stuCheckBirthday(payload).then(res => {
                const data = res.data
                if (data.errorCode === 0) {
                  this.stuCreate()
                } else if (data.errorCode > 0) {
                  this.$refs.orderCourseContinue.show(data.errorMessage)
                } else {
                  this.$message.error(data.errorMessage || '学员年龄校验失败')
                }
              })
            } else {
              this.$message.error('请选择学员')
            }
          } else if (this.ruleForm.orderType == '2') { //eslint-disable-line
            const params = {
              cpmId: this.detailList.cpmId,
              cpdId: this.detailList.cpdId,
              clsId: this.ruleForm.gradeId
            }
            gradeCreate(params).then(res => {
              const data = res.data
              if (data.errorCode === 0) {
                this.dialogVisible = false
                this.$emit('toUpdateOnceOrder', this.detailList)
                if (data.message && Object.keys(data.message).length > 0) {
                  this.$refs.orderError.show(data.message, data.cutType, this.detailList)
                } else {
                  this.$message.success(data.errorMessage)
                }
              } else {
                this.$message.error(data.errorMessage || '单次约课失败')
              }
            })
          }
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.dialogVisible = false
      this.ruleForm.stuId = []
      this.ruleForm.gradeId = ''
    },
    /* 类型切换 */
    orderTypeChange(val) {
      this.ruleForm.stuId = []
      this.ruleForm.gradeId = ''
      this.$refs['ruleForm'].clearValidate()
    },
    /* 精确查找 */
    actSearch() {
      this.isShow = true
      this.$nextTick(() => {
        this.$refs.selectStu.show(this.ruleForm.stuId)
      })
    },
    close(val) {
      this.isShow = val
    },
    /* 获取精确查找的数据 */
    getCheckList(val) {
      if (this.ruleForm.stuId) {
        this.ruleForm.stuId = val
      } else {
        this.ruleForm.stuId = val
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.search {
  color: #46b6ee;
  cursor: pointer;
  margin-left: 10px;
}
</style>
