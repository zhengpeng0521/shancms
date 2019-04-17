<template>
  <el-dialog
    :visible.sync="editVisible"
    :append-to-body="true"
    title="编辑跟进记录"
  >
    <el-form
      ref="leadsEditForm"
      :model="leadsEditForm"
      label-width="100px"
      label-suffix=":"
    >
      <!-- <el-form-item
        :rules="[
          { required: true, message: '请选择所属校区'}
        ]"
        label="所属校区"
        prop="orgName"
      >
        <AsyncSelect
          :field="orgField"
          :params="leadsEditForm"
        />
      </el-form-item> -->
      <el-form-item
        :rules="[
          { required: true, message: '请选择名单姓名'}
        ]"
        label="名单姓名"
        prop="stuName"
      >
        <AsyncSelect
          :field="nameField"
          :params="leadsEditForm"
        />
      </el-form-item>
      <el-form-item
        :rules="[
          { required: true, message: '请选择跟进家长'}
        ]"
        label="跟进家长"
        prop="parentId"
      >
        <AsyncSelect
          :field="parentField"
          :params="leadsEditForm"
        />
      </el-form-item>
      <el-form-item
        :rules="[
          { required: true, message: '请选择跟进人'}
        ]"
        label="跟进人"
        prop="uid"
      >
        <AsyncSelect
          :field="userField"
          :params="leadsEditForm"
        />
      </el-form-item>
      <el-form-item
        :rules="[
          { required: true, message: '请选择跟进方式'}
        ]"
        label="跟进方式"
        prop="type"
      >
        <AsyncSelect
          :field="typeField"
          :params="leadsEditForm"
        />
      </el-form-item>
      <el-form-item
        :rules="[
          { required: true, message: '请输入跟进内容'},
          { max: 200, message: '不能超过200字', trigger: 'change' }
        ]"
        label="跟进内容"
        prop="content"
      >
        <el-input
          v-model="leadsEditForm.content"
          :rows="4"
          type="textarea"
          placeholder="新建跟进记录 (必填，200字)"
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
import AsyncSelect from '@/components/AdvancedSearch/AsyncSelect'

export default {
  components: {
    AsyncSelect
  },

  props: {
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
      orgField: {
        type: 'input',
        key: 'orgName',
        placeholder: '请选择所属校区',
        disabled: true
      },
      nameField: {
        type: 'select',
        key: 'stuName',
        placeholder: '请选择名单姓名',
        disabled: true,
        isAsync: true,
        optionValue: 'stuId',
        optionLabel: 'stuName'
      },
      parentField: {
        type: 'select',
        key: 'parentId',
        placeholder: '请选择跟进家长',
        disabled: true,
        isAsync: true,
        optionValue: 'id',
        optionLabel: 'name'
      },
      userField: {
        type: 'select',
        key: 'uid',
        placeholder: '请选择跟进人',
        disabled: true,
        isAsync: true,
        optionValue: 'id',
        optionLabel: 'name',
        url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`
      },
      typeField: {
        type: 'select',
        key: 'type',
        placeholder: '请选择跟进方式',
        isAsync: true,
        optionValue: 'key',
        optionLabel: 'value',
        asyncParams: {
          dictkey: 'studentFollowWay'
        },
        url: `${window.SYS_URL}/sysBase/dict/dictGetByKey`
      },
      editVisible: false,
      leadsEditForm: {
        orgName: '',
        stuName: '',
        parentId: '',
        uid: '',
        type: '',
        content: ''
      }
    }
  },

  watch: {
    editFrom(val) {
      let orgName = ''
      if (this.editFrom.orgName) {
        orgName = this.editFrom.orgName
      } else {
        orgName = this.editFrom.orgId
      }
      this.leadsEditForm = {
        orgName: orgName,
        stuName: this.editFrom.stuName,
        parentId: this.editFrom.parentId,
        uid: this.editFrom.uid,
        type: this.editFrom.type,
        content: this.editFrom.content
      }
      if (this.params.source == '2') { //eslint-disable-line
        // this.nameField.url = `${window.SS_CRM}/crm/stuInfo/clue/leadsSummary`
        this.parentField.asyncParams = { stuId: this.editFrom.stuId }
        this.parentField.url = `${window.SS_CRM}/crm/stuInfo/clue/getParentByStu`
      } else {
        // this.nameField.url = `${window.SS_CRM}/crm/stuInfo/stu/stusOfUser`
        this.parentField.asyncParams = { stuId: this.editFrom.stuId }
        this.parentField.url = `${window.SS_CRM}/stu/parent/parentSummary`
      }
    }
  },

  methods: {
    /** 编辑 */
    edit() {
      this.$refs.leadsEditForm.validate((valid) => {
        if (valid) {
          this.saveEdit(this.leadsEditForm)
        } else {
          return false
        }
      })
    },

    /** 关闭 */
    closeEdit() {
      this.$refs.leadsEditForm.resetFields()
      this.editVisible = false
    }
  }
}
</script>
