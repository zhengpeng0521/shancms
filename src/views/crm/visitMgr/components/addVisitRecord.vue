<template>
  <div class="addVisitDialog_container">
    <el-dialog
      :visible.sync="addVisitDialogShow"
      :close-on-click-modal="false"
      title="到访计划"
      @close="cancelDialog('addVisitForm')"
    >
      <el-form
        ref="addVisitForm"
        :model="addVisitData"
        :rules="rules"
        label-width="90px"
      >
        <el-form-item
          label="跟进人:"
          prop="sellerId"
        >
          <span>{{ addVisitData.sellerId }}</span>
        </el-form-item>
        <el-form-item
          label="到访学员:"
          prop="stuId"
        >
          <el-select
            v-model="addVisitData.stuId"
            :disabled="isDisabled"
            placeholder="请选择到访学员"
            clearable
            filterable
            style="width:100%"
          >
            <el-option
              v-for="item in stuList"
              :key="item.stuId"
              :label="item.stuName"
              :value="item.stuId+'-'+item.source"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="到访时间:"
          prop="visitTime"
        >
          <el-date-picker
            v-model="addVisitData.visitTime"
            :picker-options="pickerOptions"
            type="datetime"
            placeholder="选择到访时间"
            style="width: 100%"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
          />
        </el-form-item>
        <el-form-item
          label="到访内容:"
          prop="content"
        >
          <el-input
            :rows="4"
            v-model="addVisitData.content"
            clearable
            type="textarea"
            placeholder="请输入到访内容(限200字)"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog('addVisitForm')"
        >取 消</el-button>
        <el-button
          v-log="{compName:'到访管理',eventName:'web-【学员CRM】-到访管理-学员详情-添加到访记录'}"
          type="primary"
          @click="submitForm('addVisitForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { addVisitRecord, getVisitRecord, leadsSummary, stusOfUser, updateVisitRecord } from '@/api/crm/visitMgr/visitMgr'
export default {
  data() {
    return {
      addVisitDialogShow: false,
      addVisitData: {
        sellerId: '东秦',
        stuId: '',
        visitTime: '',
        content: ''
      },
      rules: {
        stuId: [
          { required: true, message: '请选择跟进学员', trigger: 'change' }
        ],
        visitTime: [
          { required: true, message: '请选择到访时间', trigger: 'change' }
        ],
        content: [
          { required: true, message: '限200字', max: 200, trigger: 'change' }
        ]
      },
      stuList: [],
      sellerId: '',
      rowInfo: {},
      isDisabled: false,
      pickerOptions: {
        disabledDate(current) {
          return moment(current).isBefore(moment(), 'day')
        }
      }
    }
  },
  methods: {
    /* 显示弹框 */
    showDialog(val) {
      this.rowInfo = val
      if (val) {
        const params = {
          id: val.id
        }
        this.getMsg(params)
        this.isDisabled = true
      } else {
        this.getMsg()
        this.isDisabled = false
      }
    },
    getMsg(params) {
      getVisitRecord(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.addVisitData.sellerId = data.sellerName
          this.sellerId = data.sellerId
          this.addVisitData.stuId = data.stuId
          this.addVisitData.visitTime = data.visitTime
          this.addVisitData.content = data.content
          this.getLeadsSummary()
          this.addVisitDialogShow = !this.addVisitDialogShow
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    getLeadsSummary() {
      this.stuList = []
      leadsSummary().then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.stuList = data.results
          stusOfUser().then(res => {
            const data = res.data
            if (data.errorCode === 0) {
              this.stuList = this.stuList.concat(data.results)
              this.stuList && this.stuList.map(item => {
                if (item.stuId == this.addVisitData.stuId) { //eslint-disable-line
                  this.addVisitData.stuId = this.addVisitData.stuId + '-' + item.source
                }
              })
            } else {
              this.$message.error(data.errorMessage)
            }
          })
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 关闭弹框 */
    cancelDialog(formName) {
      this.addVisitDialogShow = false
      this.$refs[formName].resetFields()
    },
    /* 确定提交弹框表单内容 */
    submitForm(formName) {
      let stuArr = []
      let source = ''
      this.$refs[formName].validate(valid => {
        if (valid) {
          stuArr = this.addVisitData.stuId.split('-')
          if (stuArr && stuArr.length > 0) {
            this.addVisitData.stuId = stuArr[0]
            source = stuArr[1]
          }
          if (this.rowInfo) {
            const params = {
              id: this.rowInfo.id,
              stuId: this.addVisitData.stuId,
              visitTime: this.addVisitData.visitTime,
              content: this.addVisitData.content,
              source: source,
              sellerId: this.sellerId
            }
            updateVisitRecord(params).then(res => {
              const data = res.data
              if (data.errorCode === 0) {
                this.addVisitDialogShow = false
                this.$emit('toUpdateTable')
                this.$message.success(data.errorMessage)
              } else {
                this.$message.error(data.errorMessage)
              }
            })
          } else {
            const params = {
              stuId: this.addVisitData.stuId,
              visitTime: this.addVisitData.visitTime,
              content: this.addVisitData.content,
              source: source,
              sellerId: this.sellerId
            }
            addVisitRecord(params).then(res => {
              const data = res.data
              if (data.errorCode === 0) {
                this.addVisitDialogShow = false
                this.$emit('toUpdateTable')
                this.$message.success(data.errorMessage)
              } else {
                this.$message.error(data.errorMessage)
              }
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.addVisitDialog_container /deep/ {
  .el-dialog {
    width: 550px;
  }
}
</style>

