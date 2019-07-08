<template>
  <div class="menuSetDialog">
    <el-dialog
      :visible.sync="menuSetShow"
      :title="title"
      width="30%"
    >
      <el-form
        ref="menuSetForm"
        :model="menuSetForm"
        :rules="rules"
        label-width="90px"
      >
        <el-form-item
          label="菜单名称:"
          prop="menuTitle"
          checked
        >
          <el-input
            v-model="menuSetForm.menuTitle"
            placeholder="建议2~4字，无特殊要求，请使用默认名称"
          />
        </el-form-item>
        <el-form-item
          v-if="addressVisible"
          label="外链地址:"
          prop="address"
          checked
        >
          <el-input
            v-model="menuSetForm.address"
            placeholder="建议2~4字，无特殊要求，请使用默认名称"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancelDialog('menuSetForm')">取消</el-button>
        <el-button
          type="primary"
          @click="submitForm('menuSetForm')"
        >保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { updateConfig, queryConfig } from '@/api/microWeb/webPreview'
export default {
  // props: ['changeRemarkVal'],
  data() {
    var validatePass2 = (rule, value, callback) => {
      var Expression = /^(http|https):\/\/[^\s]*/
      if (Expression.test(value) === true) {
        callback()
      } else {
        callback('链接必须以http://或https://开头')
      }
    }
    return {
      menuSetShow: false,
      title: '菜单设置',
      // menuTitle: '',
      addressVisible: false,
      menuSetForm: {
        menuTitle: '首页',
        address: 'https://www.ishanshan.com'
      },
      rules: {
        menuTitle: [{ max: 4, message: '最多可输入4个字', trigger: 'change' },
          { required: true, message: '请填写内容', trigger: 'blur' }],
        address: [{ required: true, message: '请填写内容', trigger: 'change' },
          { validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  methods: {
    cancelDialog() {
      this.menuSetShow = false
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const address = this.menuSetForm.address === 'https://www.ishanshan.com' ? '' : this.menuSetForm.address
          const params = {
            id: this.$parent.id,
            tab: this.$parent.setObj.name,
            title: this.menuSetForm.menuTitle,
            url: address
          }
          this.$parent.loading = true
          updateConfig(params).then(res => {
            if (res.data.errorCode === 0) {
              queryConfig().then(res => {
                if (res.data.errorCode === 0) {
                  const arr = []
                  res.data.results.menuConfig.map((val) => {
                    if (val.type !== 2) {
                      arr.push(val)
                    }
                  })
                  this.$parent.dataSource = arr
                  this.$parent.id = res.data.results.id
                  arr.map(val => {
                    const name = val.name
                    this.$parent.nav[name] = val.title
                  })
                  this.$parent.loading = false
                } else {
                  this.$message.error(res.errorMessage)
                }
              })
            } else {
              this.$message.error(res.errorMessage)
            }
          })
          this.menuSetShow = false
        }
      })
    }
    // menuSetShow(val) {

    // }
  }
}
</script>
<style lang="scss">
.menuSetDialog {
  .el-dialog__body {
    overflow-y: auto;
  }
  .footer {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding-top: 20px;
    border-top: 1px solid #ddd;
  }
  .el-dialog__footer {
    // padding: 20px !important;
  }
}
</style>

