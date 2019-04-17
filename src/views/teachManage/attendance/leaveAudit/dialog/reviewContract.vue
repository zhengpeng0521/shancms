<template>
  <div class="reviewContract">
    <el-dialog
      :visible.sync="dialogVisible"
      title="审核合同"
      width="600px"
      @close="resetForm"
    >
      <p style="margin:0 0 10px 16px">请审核已选中的{{ checkNum }}条请假信息</p>
      <el-form
        ref="ruleForm"
        :rules="rules"
        :model="ruleForm"
        label-width="100px"
      >
        <el-form-item
          label="处理结果："
          prop="remark"
        >
          <el-input
            :rows="2"
            v-model="ruleForm.remark"
            type="textarea"
            placeholder="请输入处理结果"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-popover
          v-model="isRejectedVisible"
          placement="top"
          width="150"
        >
          <p style="margin-bottom:10px">确定驳回？</p>
          <div style="text-align: right; margin: 0">
            <el-button
              size="mini"
              class="cancel_btn edit_btn"
              @click="isRejectedVisible = false"
            >取消</el-button>
            <el-button
              class="edit_btn"
              type="primary"
              size="mini"
              @click="rejectForm"
            >确定</el-button>
          </div>
          <el-button
            slot="reference"
            type="danger"
          >驳回</el-button>
        </el-popover>
        <el-popover
          v-model="isPassVisible"
          placement="top"
          width="150"
        >
          <p style="margin-bottom:10px">确定通过？</p>
          <div style="text-align: right; margin: 0">
            <el-button
              size="mini"
              class="cancel_btn edit_btn"
              @click="isPassVisible = false"
            >取消</el-button>
            <el-button
              class="edit_btn"
              type="primary"
              size="mini"
              @click="submitForm"
            >确定</el-button>
          </div>
          <el-button
            slot="reference"
            type="primary"
          >通过</el-button>
        </el-popover>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { vacationAudit } from '@/api/teachManage/attendance'
export default {
  data() {
    /* 校验跟进记录 字数*/
    var checkRemark = (rule, value, callback) => {
      if (!(/^[^\n]{1,200}$/.test(value))) {
        callback('不能超过200个字')
      } else if ((/^[\s]{1,200}$/.test(value))) {
        callback('不能全为空格')
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      isRejectedVisible: false, // 是否驳回
      isPassVisible: false, // 是否通过
      checkNum: 0,
      ruleForm: {
        remark: '' // 处理结果
      },
      rules: {
        remark: [
          { validator: checkRemark, trigger: 'change' }
        ]
      },
      checkList: []
    }
  },
  methods: {
    show(val, list) {
      this.checkList = list
      this.dialogVisible = true
      this.checkNum = val
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })
    },
    /* 通过 */
    submitForm() {
      let ids = ''
      const listArr = []
      if (this.checkList && this.checkList.length > 0) {
        this.checkList.map(item => {
          listArr.push(item.id)
        })
        ids = listArr && listArr.join(',')
      }
      const params = {
        auditStatus: '3',
        remark: this.ruleForm.remark,
        ids: ids
      }
      vacationAudit(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.dialogVisible = false
          this.isPassVisible = false
          this.$message.success(data.errorMessage)
          this.$emit('toUpdateTable')
        } else {
          this.$message.error(data.errorMessage || '审核失败')
        }
      })
    },
    /* 驳回 */
    rejectForm() {
      let ids = ''
      const listArr = []
      if (this.checkList && this.checkList.length > 0) {
        this.checkList.map(item => {
          listArr.push(item.id)
        })
        ids = listArr && listArr.join(',')
      }
      const params = {
        auditStatus: '2',
        remark: this.ruleForm.remark,
        ids: ids
      }
      vacationAudit(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.dialogVisible = false
          this.isRejectedVisible = false
          this.$message.success(data.errorMessage)
          this.$emit('toUpdateTable')
        } else {
          this.$message.error(data.errorMessage || '审核失败')
        }
      })
    },
    /* 关闭 */
    resetForm() {
      this.ruleForm.remark = ''
    }
  }
}
</script>
<style lang="scss" scoped>
.reviewContract /deep/ {
  .el-button--danger {
    color: #fff;
    background: #d0021b;
    border-color: #d0021b;
    margin-right: 10px;
  }
}
</style>
