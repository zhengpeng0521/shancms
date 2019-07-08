<template>
  <div class="addPaymentDialog_container">
    <el-dialog
      :visible.sync="addPaymentDialogShow"
      title="支付方式"
      @close="cancelDialog('addPaymentForm')"
    >

      <span style="display: inline-block;margin-bottom: 15px;">
        <el-button
          type="primary"
          @click="addElrow"
        >添加类别</el-button>
      </span>

      <!-- 支付方式单个项 -->
      <el-row
        v-for="(item, index) of addPaymentData"
        :gutter="2"
        :key="index + 'content'"
        class="content"
      >

        <el-col
          :span="8"
          :prop="'item.' + index + '.contentInput'"
        >
          <!-- 展示区 -->
          <div v-if="item.paymentDivShow" class="contentLeft">
            {{ item.name }}
          </div>
          <!-- input框 -->
          <div v-if="item.paymentInputShow" class="contentLeft">
            <el-input
              v-model="item.name"
              placeholder="请输入内容"
            />
          </div>
        </el-col>

        <el-col
          :offset="10"
          :span="3"
          :prop="'item.' + index + '.contentRightEditor'"
        >
          <div class="contentRightEditor">
            <el-button type="text" @click="editorConter(item)">{{ item.paymentDivShow === true ? '编辑' : item.paymentDivShow === false ? '保存' : '编辑' }}</el-button>
          </div>
        </el-col>

        <el-col
          :span="3"
          :prop="'item.' + index + '.contentRightDelete'"
        >
          <div class="contentRightDelete">
            <el-button
              :disabled="contentRightDeleteDisabled"
              type="text"
              @click="deleteConter(item, index)"
            >删除</el-button>
          </div>
        </el-col>
      </el-row>

      <!-- <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog('addPaymentForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('addPaymentForm')"
        >保 存</el-button>
      </span> -->
    </el-dialog>

  </div>
</template>

<script>
import {
  queryPayWay, // 支出项目列表查询
  paymentUpdate, // 修改支出项目
  paymentAdd // 增加支出项目
} from '@/api/crm/financeMgr/expend.js'
export default {
  data() {
    return {
      addPaymentDialogShow: false,
      contentRightDeleteDisabled: false, // 删除按钮是否可以点击
      addPaymentData: [],
      formData: {
        addPaymentData: []
      }
    }
  },
  methods: {
    // 支付方式列表查询
    queryPayWayFun() {
      queryPayWay().then(res => {
        if (res.data.errorCode === 0) {
          const results = res.data.results
          const resultsTwo = results.map(element => {
            const elementPush = { paymentDivShow: true, paymentInputShow: false }
            const elementNow = {
              ...element,
              ...elementPush
            }
            return elementNow
          })
          this.addPaymentData = resultsTwo
          this.formData.addPaymentData = resultsTwo
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    // 增加一行
    addElrow() {
      const tempData = {
        name: '',
        paymentDivShow: false, // 展示支出项
        paymentInputShow: true // 输入支出项
      }
      this.formData.addPaymentData.push(tempData)
    },

    // 增加支付方式
    paymentAddFun(item) {
      const params = {
        name: item.name
      }
      const reg = /^[\u4e00-\u9fffa-zA-Z]{1,8}$/
      if (params.name === '') {
        item.paymentDivShow = false
        item.paymentInputShow = true
        this.$message.error('支付方式不能为空')
      } else {
        if (reg.test(params.name) === true) {
          paymentAdd(params).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success('增加支付方式成功')
              this.queryPayWayFun() // 增加支付方式刷新
              this.$emit('paymentUpdataLine') // 添加成功父级支付方式下拉刷新
            } else if (res.data.errorCode === 100098) {
              item.paymentDivShow = false
              item.paymentInputShow = true
              this.$message.error('支出项目不能为空')
            } else if (res.data.errorCode === 3000) {
              this.$message.error('当前租户已存在相同名称的支出方式，不能重复添加')
              item.paymentDivShow = false
              item.paymentInputShow = true
            } else {
              this.$message.error(res.data.errorMessage)
            }
          })
        } else {
          item.paymentDivShow = false
          item.paymentInputShow = true
          this.$message.error('请输入8个以内中文汉字')
        }
      }
    },

    // 修改当前支付方式
    paymentUpdateFun(item) {
      const params = {
        id: item.id,
        name: item.name
      }
      const reg = /^[\u4e00-\u9fffa-zA-Z]{1,8}$/
      if (item.paymentDivShow === true && item.paymentInputShow === false) { // 编辑状态
        if (item.name === '') {
          item.paymentDivShow = false
          item.paymentInputShow = true
          this.$message.error('支付方式不能为空')
        } else {
          if (reg.test(params.name) === true) {
            paymentUpdate(params).then(res => {
              if (res.data.errorCode === 0) {
                this.$message.success('保存成功')
                this.queryPayWayFun() // 修改支付方式刷新
                this.$emit('paymentUpdataLine') // 修改成功父级支付方式下拉刷新
              } else {
                this.$message.error(res.data.errorMessage)
              }
            })
          } else {
            item.paymentDivShow = false
            item.paymentInputShow = true
            this.$message.error('请输入8个以内中文汉字')
          }
        }
      }
    },
    // 编辑支出项目内容
    editorConter(item) {
      if (item.paymentDivShow === true && item.paymentInputShow === false) { // 显示input输入框
        item.paymentDivShow = false
        item.paymentInputShow = true
      } else if (item.paymentDivShow === false && item.paymentInputShow === true) { // 显示展示框
        item.paymentDivShow = true
        item.paymentInputShow = false
      }
      if (item.id !== '' && item.id !== null && item.id !== undefined) { // 进行编辑
        this.paymentUpdateFun(item)
      } else { // 进行添加
        this.paymentAddFun(item)
      }
    },

    // 删除当前行
    deleteConter(item, index) {
      this.formData.addPaymentData.splice(index, 1)
      if (item.id !== '' && item.id !== null && item.id !== undefined) {
        const params = {
          id: item.id,
          status: 0
        }
        paymentUpdate(params).then(res => {
          if (res.data.errorCode === 0) {
            this.$message.success('删除成功')
            this.queryPayWayFun() // 删除支付方式刷新
            this.$emit('paymentUpdataLine') // 删除成功父级支付方式下拉刷新
          } else {
            this.$message.error(res.data.errorMessage)
          }
        })
      }
    },
    /* 关闭弹框 */
    cancelDialog(formName) {
      this.addPaymentDialogShow = false
    },
    /* 显示弹框 */
    showDialog() {
      this.addPaymentDialogShow = true
      this.queryPayWayFun()
    }
  }
}
</script>

<style lang="scss" scoped>
  .addPaymentDialog_container /deep/ {
    .el-dialog {
      width: 500px;
      padding-bottom: 20px;
      .content {
        border: 1px solid #C0C4CC;
        margin-bottom: -1px;
        &:last-child {
          margin-bottom: 0;
        }
        .contentLeft {
          min-height: 36px;
          line-height: 36px;
          padding-left: 20px;
        }
        .contentRightEditor {
          min-height: 36px;
          line-height: 36px;
          padding-left: 20px;
        }
        .contentRightDelete {
          min-height: 36px;
          line-height: 36px;
        }
      }
    }
  }
</style>
