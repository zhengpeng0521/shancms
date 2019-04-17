<template>
  <el-dialog
    :visible.sync="cancelVisible"
    :append-to-body="true"
    title="取消约课"
    width="500px"
  >
    <el-form
      ref="listenCancelForm"
      :model="listenCancelForm"
      label-width="100px"
      label-suffix=":"
      class="detail-visite-form"
    >
      <el-form-item
        label="选择原因"
        prop="reason"
      >
        <AsyncSelect
          :field="resonField"
          :params="listenCancelForm"
        />
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="closeEdit">取 消</el-button>
      <el-button
        type="primary"
        @click="cancelListen"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import AsyncSelect from '@/components/AdvancedSearch/AsyncSelect'

export default {
  components: {
    AsyncSelect
  },

  props: {
    saveReson: {
      type: Function,
      required: true
    }
  },

  data() {
    return {
      resonField: {
        type: 'select',
        key: 'reason',
        placeholder: '请选择原因',
        initFirst: true,
        clearable: false,
        options: [
          { value: '1', label: '操作有误' },
          { value: '2', label: '节假日放假' },
          { value: '3', label: '老师请假' },
          { value: '4', label: '学员调班' },
          { value: '5', label: '从班级移除' },
          { value: '6', label: '老师离职' }
        ]
      },
      cancelVisible: false,
      listenCancelForm: {
        reason: ''
      }
    }
  },

  methods: {
    /** 取消试听 */
    cancelListen(rowlist) {
      this.$refs.listenCancelForm.validate((valid) => {
        if (valid) {
          this.saveReson(this.listenCancelForm)
        } else {
          return false
        }
      })
    },

    /** 关闭 */
    closeEdit() {
      this.$refs.listenCancelForm.resetFields()
      this.cancelVisible = false
    }
  }
}
</script>

<style lang="scss">
.detail-visite-form .el-input__inner {
  padding-left: 15px;
}
</style>
