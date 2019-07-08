<template>
  <div class="cancelReasonDialog_container">
    <el-dialog
      :visible.sync="cancelReasonDialogShow"
      title="取消约课"
      @close="cancelDialog('cancelReasonForm')"
    >
      <el-form
        ref="cancelReasonForm"
        :model="cancelReasonData"
        label-width="90px"
      >
        <el-form-item
          label="选择原因:"
          prop="reason"
        >
          <el-select
            v-model="cancelReasonData.reason"
            placeholder="请选择原因"
            clearable
            filterable
            style="width:100%"
          >
            <el-option
              v-for="item in allShops"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog('cancelReasonForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('cancelReasonForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  updateStatus // 修改状态
} from '@/api/crm/auditionMgr/auditionMgr.js'
export default {
  components: {

  },
  data() {
    return {
      cancelReasonDialogShow: false,
      cancelReasonData: {
        reason: ''
      },
      allShops: [
        {
          value: '1',
          label: '操作有误'
        },
        {
          value: '2',
          label: '节假日放假'
        },
        {
          value: '3',
          label: '老师请假'
        },
        {
          value: '4',
          label: '学员调班'
        },
        {
          value: '5',
          label: '从班级移除'
        },
        {
          value: '6',
          label: '老师离职'
        }
      ],
      rowlistId: []
    }
  },
  methods: {
    /* 修改试听状态 */
    updateStatusFun() {
      const ids = this.rowlistId
      const params = {
        ids: ids.join(','),
        status: '0',
        reason: this.cancelReasonData.reason
      }
      updateStatus(params).then(res => {
        if (res.data.errorCode === 0) {
          this.cancelReasonDialogShow = false
          this.$message.success(res.data.errorMessage)
          this.$emit('toOfflinePage')
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 表格多选行 */
    handleSelectionChange(val) {
    },
    /* 显示弹框 */
    showDialog(rowlist) {
      this.rowlistId = rowlist
      this.cancelReasonDialogShow = !this.cancelReasonDialogShow
    },
    /* 关闭弹框 */
    cancelDialog(formName) {
      this.cancelReasonDialogShow = false
      this.$refs[formName].resetFields()
    },
    /* 确定提交弹框表单内容 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.updateStatusFun()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.cancelReasonDialog_container /deep/ {
  .el-dialog {
    width: 450px;
  }
}
</style>

