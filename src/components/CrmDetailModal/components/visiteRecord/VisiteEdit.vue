<template>
  <el-dialog
    :visible.sync="editVisible"
    :append-to-body="true"
    :title="title"
    width="600px"
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
          :field="nameField"
          :params="visiteEditForm"
        />
      </el-form-item>
      <el-form-item
        v-if="modalType === 'edit'"
        :rules="[
          { required: true, message: '请选择跟进人'}
        ]"
        label="跟进人"
        prop="sellerName"
      >
        <AsyncSelect
          :field="sellerField"
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
        @click="closeEdit"
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

export default {
  components: {
    AsyncSelect
  },

  props: {
    modalType: {
      type: String,
      required: true
    },
    editFrom: {
      type: Object,
      required: true
    },
    saveEdit: {
      type: Function,
      required: true
    },
    params: {
      type: Object,
      required: true
    }
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
      sellerField: {
        type: 'select',
        key: 'sellerName',
        placeholder: '请选择跟进人',
        disabled: true
      },
      pickerOptions: {
        disabledDate(current) {
          return moment(current).isBefore(moment(), 'day')
        }
      },
      editVisible: false,
      visiteEditForm: {
        stuName: '',
        sellerName: '',
        visitTime: '',
        content: ''
      }
    }
  },

  computed: {
    title() {
      if (this.modalType === 'edit') {
        return '编辑到访计划'
      } else {
        return '新建到访计划'
      }
    }
  },

  watch: {
    editFrom(val) {
      if (this.modalType === 'edit') {
        this.$refs.visiteEditForm && this.$refs.visiteEditForm.resetFields()
        this.visiteEditForm = {
          sellerName: val.sellerName,
          stuName: val.stuName,
          visitTime: val.visitTime,
          content: val.content
        }
      } else {
        this.$refs.visiteEditForm && this.$refs.visiteEditForm.resetFields()
        this.visiteEditForm.content = ''
        this.visiteEditForm.stuName = val.stuName
        delete this.visiteEditForm.sellerName
      }
    }
  },

  methods: {
    show(val) {
      this.editVisible = true
      this.$refs.visiteEditForm && this.$refs.visiteEditForm.resetFields()
      this.visiteEditForm = {
        sellerName: val.sellerName,
        stuName: val.stuName,
        visitTime: val.visitTime,
        content: val.content
      }
    },
    /** 编辑 */
    edit() {
      this.$refs.visiteEditForm.validate((valid) => {
        if (valid) {
          this.saveEdit(this.visiteEditForm)
        } else {
          return false
        }
      })
    },

    /** 关闭 */
    closeEdit() {
      this.$refs.visiteEditForm.resetFields()
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
