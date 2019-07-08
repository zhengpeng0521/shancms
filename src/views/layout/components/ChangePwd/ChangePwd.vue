<template>
  <el-dialog
    :visible="visible"
    title="修改密码"
    width="500px"
    custom-class="change_password"
    @close="$emit('close')"
  >

    <el-form
      ref="changePassword"
      :model="passwordForm"
      label-width="100px"
      label-suffix=":"
    >
      <el-form-item
        :rules="[
          { required: true, message: '请输入原密码'}
        ]"
        label="原密码"
        prop="oldPassword"
      >
        <el-input
          v-model="passwordForm.oldPassword"
          type="password"
          placeholder="请输入原密码"
        />
      </el-form-item>

      <el-form-item
        :rules="[
          { required: true, message: '请输入新密码(6-12位)'},
          { min: 6, max: 12, message: '请输入新密码(6-12位)', trigger: 'change' }
        ]"
        label="新密码"
        prop="newPassword"
      >
        <el-input
          v-model="passwordForm.newPassword"
          type="password"
          placeholder="请输入新密码(6-12位)"
        />
      </el-form-item>

      <el-form-item
        :rules="[
          { required: true, message: '请确认新密码(6-12位)'},
          { min: 6, max: 12, message: '请确认新密码(6-12位)', trigger: 'change' }
        ]"
        label="确认新密码"
        prop="confirmPassword"
      >
        <el-input
          v-model="passwordForm.confirmPassword"
          type="password"
          placeholder="请确认新密码(6-12位)"
        />
      </el-form-item>
    </el-form>

    <span slot="footer">
      <el-button
        :loading="loading"
        @click="$emit('close')"
      >取 消</el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="saveChange"
      >保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      passwordForm: {
        oldPassword: '', // 原密码
        newPassword: '', // 新密码
        confirmPassword: '' // 确认新密码
      }
    }
  },

  computed: {
    ...mapState('navbar', ['loading'])
  },

  methods: {
    ...mapActions('navbar', ['changePassword']),

    /** 修改密码 */
    saveChange() {
      this.$refs.changePassword.validate((valid) => {
        if (valid) {
          if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
            this.$message.error('新密码与确认新密码不一致，请修改')
          } else {
            this.changePassword({ ...this.passwordForm, close: this.closeCallback, fail: this.failCallback })
          }
        } else {
          return false
        }
      })
    },

    closeCallback() {
      this.$message.success('修改成功！')
      this.$emit('close')
    },

    failCallback(data) {
      this.$message.error((data && data.errorMessage) || '修改失败')
    }
  }
}
</script>

<style lang="scss">
.change_password {
  .el-dialog__header,
  .el-dialog__footer {
    line-height: 1;
  }
}
</style>
