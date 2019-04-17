<template>
  <div class="listenDialog_container">
    <el-dialog
      :visible.sync="listenDialogShow"
      title="新增预约试听"
      @close="cancelDialog('listenDialogForm')"
    >
      <el-form
        ref="listenDialogForm"
        :model="listenDialogData"
        label-width="90px"
      >
        <el-form-item
          label="名单姓名:"
          prop="worker"
        >
          <el-select
            v-model="listenDialogData.name"
            placeholder="请选择名单姓名"
            clearable
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
        <el-form-item
          label="到访时间:"
          prop="time"
        >
          <el-date-picker
            v-model="listenDialogData.time"
            type="datetime"
            placeholder="选择到访时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item
          label="到访内容:"
          prop="content"
        >
          <el-input
            v-model="listenDialogData.content"
            clearable
            type="textarea"
            placeholder="请输入到访内容"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog('listenDialogForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('listenDialogForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {

  },
  data() {
    return {
      listenDialogShow: false,
      listenDialogData: {
        name: '',
        time: '',
        content: ''
      },
      allShops: [
        {
          value: 'yizhi',
          label: '一致'
        },
        {
          value: 'fankui',
          label: '反馈'
        },
        {
          value: 'xiaolv',
          label: '效率'
        },
        {
          value: 'kekong',
          label: '可控'
        }
      ]
    }
  },
  methods: {
    /* 显示弹框 */
    showDialog(num) {
      this.listenDialogShow = !this.listenDialogShow
    },
    /* 关闭弹框 */
    cancelDialog(formName) {
      this.listenDialogShow = false
      this.$refs[formName].resetFields()
    },
    /* 确定提交弹框表单内容 */
    submitForm(formName) {
      console.log('formName', formName)
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.listenDialogShow = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.listenDialog_container /deep/ {
  .el-dialog {
    width: 500px;
  }
}
</style>

