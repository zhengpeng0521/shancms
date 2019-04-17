<template>
  <el-dialog
    :visible.sync="editVisible"
    :append-to-body="true"
    :close-on-click-modal="false"
    title="新建到访计划"
    width="600px"
    @close="closeEdit('visiteEditForm')"
  >
    <el-form
      ref="visiteEditForm"
      :model="visiteEditForm"
      label-width="100px"
      label-suffix=":"
      class="detail-visite-form"
    >
      <el-form-item
        :rules="[
          { required: true, message: '请选择名单姓名'}
        ]"
        label="名单姓名"
        prop="stuName"
      >
        <AsyncSelect
          ref="select"
          :field="nameField"
          :params="visiteEditForm"
        />
      </el-form-item>
      <el-form-item
        :rules="[
          { required: true, message: '请选择到访时间'}
        ]"
        label="到访时间"
        prop="visitTime"
      >
        <el-date-picker
          v-model="visiteEditForm.visitTime"
          :picker-options="pickerOptions"
          type="datetime"
          placeholder="请选择到访时间"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
          style="width: 100%;"
        />
      </el-form-item>
      <el-form-item
        :rules="[
          { required: true, message: '请输入到访内容'},
          { max: 200, message: '不能超过200字', trigger: 'change' }
        ]"
        label="到访内容"
        prop="content"
      >
        <el-input
          v-model="visiteEditForm.content"
          :rows="4"
          type="textarea"
          placeholder="请输入到访内容 (必填，200字)"
        />
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        class="cancel_btn"
        @click="closeEdit('visiteEditForm')"
      >取 消</el-button>
      <el-button
        type="primary"
        @click="edit"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import moment from 'moment'
import AsyncSelect from '@/components/AdvancedSearch/AsyncSelect'
import { addVisitRecord } from '@/api/crm/studentInfo/lantentStu'
export default {
  components: {
    AsyncSelect
  },
  data() {
    return {
      nameField: {
        type: 'select',
        key: 'stuName',
        placeholder: '请选择名单姓名',
        disabled: true,
        optionValue: 'stuId',
        optionLabel: 'stuName'
      },
      pickerOptions: {
        disabledDate(current) {
          return moment(current).isBefore(moment(), 'day')
        }
      },
      editVisible: false,
      visiteEditForm: {
        stuName: '',
        visitTime: '',
        content: ''
      },
      rowInfo: {},
      stuId: ''
    }
  },
  methods: {
    showDialog(row) {
      this.editVisible = true
      this.$nextTick(() => {
        this.visiteEditForm.stuName = row.name
        this.stuId = row.id
        this.rowInfo = row
      })
    },
    /** 编辑 */
    edit() {
      this.$refs.visiteEditForm.validate((valid) => {
        if (valid) {
          let followId = ''
          if (this.rowInfo.sellerId) {
            followId = this.rowInfo.sellerId
          } else {
            followId = this.$store.getters.id
          }
          delete this.visiteEditForm.stuName
          const params = {
            source: '2',
            sellerId: followId,
            ...this.visiteEditForm,
            stuId: this.stuId
          }
          addVisitRecord(params).then(res => {
            const data = res.data
            if (data.errorCode === 0) {
              this.$message.success(data.errorMessage)
              this.editVisible = false
              this.$refs.visiteEditForm.resetFields()
              this.$emit('toUpdateTable')
            } else {
              this.$message.error(data.errorMessage)
            }
          })
        } else {
          return false
        }
      })
    },

    /** 关闭 */
    closeEdit(visiteEditForm) {
      this.$refs[visiteEditForm].resetFields()
      this.editVisible = false
    }
  }
}
</script>

<style lang="scss">
.detail-visite-form .el-input__inner {
  padding-left: 15px;
}
</style>
