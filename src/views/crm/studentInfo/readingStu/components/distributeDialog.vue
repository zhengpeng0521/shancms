<template>
  <div class="distributeDialog_container">
    <el-dialog
      :visible.sync="distributeDialogShow"
      title="转给他人"
      @close="cancelDialog('distributeDialogForm')"
    >
      <el-form
        ref="distributeDialogForm"
        :model="distributeDialogData"
        :rules="rules"
      >
        <div
          v-if="isSellerTextShow"
          class="title_text"
        >将{{ checkNum }}名学员分配给</div>
        <div
          v-else
          class="title_text"
        >学员: {{ checkNameStu }} 转给哪位销售</div>
        <el-form-item
          label=""
          prop="worker"
        >
          <el-select
            v-model="distributeDialogData.worker"
            placeholder="请选择分配对象"
            clearable
            style="width:100%"
          >
            <el-option
              v-for="item in allUsersList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <div style="margin: 10px 0;">分配学员时，以下信息也会同时交接</div>
        <el-checkbox
          v-model="checked"
          size="mini"
          disabled
        >学员家长</el-checkbox>
        <el-checkbox
          v-model="checked"
          disabled
        >学员的退款单</el-checkbox>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog('distributeDialogForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('distributeDialogForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  summaryQueryUsers, // 分配对象下拉数据
  moveStu
} from '@/api/crm/studentInfo/readingStu.js'
export default {
  components: {

  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (this.distributeDialogData.worker == '') { //eslint-disable-line
        callback(new Error('请选择分配对象'))
      } else {
        callback()
      }
    }
    return {
      distributeDialogShow: false,
      isSellerTextShow: true,
      checked: true,
      distributeDialogData: {
        worker: '',
        ids: ''
      },
      rules: {
        worker: [
          { validator: validatePass, trigger: 'change' }
        ]
      },
      checkNum: '',
      checkNameStu: '',
      allUsersList: [] // 分配对象下拉数据
    }
  },
  methods: {
    /* 显示弹框 */
    showDialog(num, rowlist) {
      // eslint-disable-next-line
      if(num == 'returnInfo') {
        this.isSellerTextShow = false
        this.checkNameStu = rowlist.name
        this.distributeDialogData.ids = rowlist.id
        this.summaryQueryUsersFun()
      } else {
        this.isSellerTextShow = true
        const idsRow = []
        rowlist && rowlist.length > 0 && rowlist.map(item => {
          idsRow.push(item.id)
        })
        this.distributeDialogData.ids = idsRow.join(',')
        if (!!num && num > 0) {
          this.checkNum = num
          this.summaryQueryUsersFun()
        }
      }
    },
    /* 关闭弹框 */
    cancelDialog(formName) {
      this.distributeDialogShow = false
      this.$refs[formName].resetFields()
      this.$emit('toParent')
    },
    /* 分配对象下拉数据 */
    summaryQueryUsersFun() {
      summaryQueryUsers().then(res => {
        if (res.data.errorCode === 0) {
          this.allUsersList = res.data.results
          this.distributeDialogShow = !this.distributeDialogShow
          this.$emit('toReadingPage')
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 确定分配学员 */
    moveStuFun() {
      const params = {
        ids: this.distributeDialogData.ids,
        seller: this.distributeDialogData.worker
      }
      moveStu(params).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success(res.data.errorMessage)
          this.distributeDialogShow = false
          this.$emit('toReadingStuPage')
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 确定提交弹框表单内容 */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.moveStuFun()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.distributeDialog_container /deep/ {
  .el-dialog {
    width: 500px;
  }
  .title_text {
    margin-bottom: 10px;
  }
}
</style>

