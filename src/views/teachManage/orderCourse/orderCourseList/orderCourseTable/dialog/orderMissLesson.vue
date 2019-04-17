<template>
  <div class="updateSignType">
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      title="预约补课"
      width="400px"
    >
      <div>
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
        >
          <el-form-item prop="stuId">
            <el-select
              v-model="ruleForm.stuId"
              filterable
              placeholder="选择学员"
              style="width:270px"
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
    <SingleSelectStu
      v-if="isShow"
      ref="selectStu"
      @toParent="getCheckData"
      @toClose="close"
    />
    <!-- 是否继续约课 -->
    <OrderCourseContinue
      ref="orderCourseContinue"
      @toContinueOrder="getContinueOrder"
    />
  </div>
</template>
<script>
import SingleSelectStu from './singleSelectStu'
import { stuSummaryQuery, stuMulCreate, stuCheckBirthday } from '@/api/teachManage/orderCourse'
import { queryCRMStuList } from '@/api/teachManage/grade'
import OrderCourseContinue from './orderCourseContinue'
export default {
  components: {
    SingleSelectStu,
    OrderCourseContinue
  },
  data() {
    return {
      dialogVisible: false,
      ruleForm: {
        stuId: '' // 学员
      },
      rules: {
        stuId: [
          { required: true, message: '请选择学员', trigger: 'blur' }
        ]
      },
      newStuList: [], // 学员列表
      isShow: false,
      rowInfo: {}, // 该条详细信息
      detailList: {} // 详情
    }
  },
  methods: {
    show(val, detail) {
      this.rowInfo = val
      this.detailList = detail
      this.dialogVisible = true
      this.ruleForm.stuId = ''
      if (this.detailList) {
        this.getStuList()
      }
    },
    /* 学员列表 */
    getStuList() {
      this.newStuList = []
      stuSummaryQuery({ type: '2' }).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          const stuList = data.results
          stuList.map((item, index) => {
            const stuObj = {}
            let name = ''
            if (this.detailList.courseAgeType == '1') { //eslint-disable-line
              name = item.stuName + '(' + item.month + '月)'
            } else {
              name = item.stuName + '(' + Math.floor(item.month / 12) + '岁)'
            }
            stuObj.stuName = name
            stuObj.stuId = item.stuId
            this.newStuList.push(stuObj)
          })
        } else {
          this.$message.error(data.errorMessage || '获取学员摘要列表失败')
        }
      })
    },
    /* 预约补课 */
    getCreateStu() {
      const params = {
        cpdIds: this.detailList.cpdId,
        cpmId: this.detailList.cpmId,
        stuId: this.ruleForm.stuId
      }
      stuMulCreate(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.dialogVisible = false
          this.$message.success(data.errorMessage)
          this.$emit('toUpdateOnceOrder', this.detailList)
        } else {
          this.$message.error(data.errorMessage || '预约补课失败')
        }
      })
    },
    /* 继续约课 */
    getContinueOrder() {
      this.getCreateStu()
      this.dialogVisible = false
    },
    /* 确定 */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const payload = {
            cpmId: this.detailList.cpmId,
            stuId: this.ruleForm.stuId
          }
          stuCheckBirthday(payload).then(res => {
            const data = res.data
            if (data.errorCode === 0) {
              this.getCreateStu()
            } else if (data.errorCode > 0) {
              this.$refs.orderCourseContinue.show(data.errorMessage)
            } else {
              this.$message.error(data.errorMessage || '学员年龄校验失败')
            }
          })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.dialogVisible = false
    },
    close(val) {
      this.isShow = false
    },
    /* 精确查找 */
    actSearch() {
      this.isShow = true
      let list = []
      if (this.ruleForm.stuId) {
        const params = {
          type: '2'
        }
        queryCRMStuList(params).then(res => {
          const data = res.data
          if (data.errorCode === 0) {
            list = data.results
            list.map(item => {
            if (item.id == this.ruleForm.stuId) { //eslint-disable-line
                this.$nextTick(() => {
                  this.$refs.selectStu.show(item)
                })
              }
            })
          }
        })
      } else {
        this.$nextTick(() => {
          this.$refs.selectStu.show()
        })
      }
    },
    /* 获取精确查找的数据 */
    getCheckData(val) {
      this.ruleForm.stuId = val
    }
  }
}
</script>
<style lang="scss" scoped>
.search {
  color: #46b6ee;
  cursor: pointer;
  float: right;
}
</style>
