<template>
  <div class="addPayProjectDialog_container">
    <el-dialog
      :visible.sync="addPayProjectDialogShow"
      title="支出项目"
      @close="cancelDialog('addPayProjectForm')"
    >
      <span style="display: inline-block;margin-bottom: 15px;">
        <el-button
          type="primary"
          @click="addElrow"
        >添加类别</el-button>
      </span>

      <!-- 支出项单个项 -->
      <el-row
        v-for="(item, index) of addPayProjectData"
        :gutter="2"
        :key="index + 'content'"
        class="content"
      >

        <el-col
          :span="8"
          :prop="'item.' + index + '.contentInput'"
        >
          <!-- 展示区 -->
          <div v-if="item.projectDivShow" class="contentLeft">
            {{ item.name }}
          </div>
          <!-- input框 -->
          <div v-if="item.projectInputShow" class="contentLeft">
            <el-input
              v-model="item.name"
              placeholder="请输入内容"
            />
          </div>
        </el-col>

        <!-- 编辑保存 -->
        <el-col
          :offset="10"
          :span="3"
          :prop="'item.' + index + '.contentRightEditor'"
        >
          <div class="contentRightEditor">
            <el-button type="text" @click="editorConter(item)">{{ item.projectDivShow === true ? '编辑' : item.projectDivShow === false ? '保存' : '编辑' }}</el-button>
          </div>
        </el-col>

        <!-- 删除 -->
        <el-col
          :span="3"
          :prop="'item.' + index + '.contentRightDelete'"
        >
          <div class="contentRightDelete">
            <el-button
              :disabled="contentRightDeleteDisabled"
              type="text"
              @click="deleteConter(item,index)"
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
          @click="cancelDialog('addPayProjectForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('addPayProjectForm')"
        >保 存</el-button>
      </span> -->
    </el-dialog>

  </div>
</template>

<script>
import {
  queryProject, // 支出项目列表查询
  payProjectUpdate, // 修改支出项目
  payProjectAdd // 增加支出项目
} from '@/api/crm/financeMgr/expend.js'
export default {
  data() {
    return {
      addPayProjectDialogShow: false, // 当前弹窗的显隐
      contentRightDeleteDisabled: false, // 删除按钮是否可以点击
      addPayProjectData: [],
      formData: {
        addPayProjectData: []
      }
    }
  },
  methods: {
    /* 支出项目下拉列表 */
    queryProjectFun() {
      queryProject().then(res => {
        if (res.data.errorCode === 0) {
          const results = res.data.results
          const resultsTwo = results.map(element => {
            const elementPush = { projectDivShow: true, projectInputShow: false }
            const elementNow = {
              ...element,
              ...elementPush
            }
            return elementNow
          })
          this.addPayProjectData = resultsTwo
          this.formData.addPayProjectData = resultsTwo
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    // 增加一行
    addElrow() {
      const tempData = {
        name: '',
        projectDivShow: false, // 展示支出项
        projectInputShow: true // 输入支出项
      }
      this.formData.addPayProjectData.push(tempData)
    },

    // 增加支出项目
    payProjectAddFun(item) {
      const params = {
        name: item.name
      }
      const reg = /^[\u4e00-\u9fffa-zA-Z]{1,8}$/
      if (params.name === '') {
        item.projectDivShow = false
        item.projectInputShow = true
        this.$message.error('支出项目不能为空')
      } else {
        if (reg.test(params.name) === true) {
          payProjectAdd(params).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success('增加项目成功')
              this.queryProjectFun() // 添加成功重新获取支出项目列表
              this.$emit('payProjectUpdateLine') // 添加成功父级支出项目下拉刷新
            } else if (res.data.errorCode === 3000) {
              item.projectDivShow = false
              item.projectInputShow = true
              this.$message.error('当前租户已存在相同名称的支出方式，不能重复添加')
            } else {
              this.$message.error(res.data.errorMessage)
            }
          })
        } else {
          item.projectDivShow = false
          item.projectInputShow = true
          this.$message.error('请输入8个以内中文汉字')
        }
      }
    },

    // 修改当前项内容
    payProjectUpdateFun(item) {
      const params = {
        id: item.id,
        name: item.name
      }
      const reg = /^[\u4e00-\u9fffa-zA-Z]{1,8}$/
      if (item.projectDivShow === true && item.projectInputShow === false) {
        if (item.name === '') {
          item.projectDivShow = false
          item.projectInputShow = true
          this.$message.error('支出项目不能为空')
        } else {
          if (reg.test(params.name) === true) {
            payProjectUpdate(params).then(res => {
              if (res.data.errorCode === 0) {
                this.$message.success('保存成功')
                this.queryProjectFun() // 修改成功重新获取支出项目列表
                this.$emit('payProjectUpdateLine') // 修改成功父级支出项目下拉刷新
              } else if (res.data.errorCode === 3000) { // 重复添加
                item.projectDivShow = false
                item.projectInputShow = true
                this.$message.error('当前租户已存在相同名称的支出方式，不能重复添加')
              } else {
                this.$message.error(res.data.errorMessage)
              }
            })
          } else {
            item.projectDivShow = false
            item.projectInputShow = true
            this.$message.error('请输入8个以内中文汉字')
          }
        }
      }
    },

    // 编辑支出项目内容
    editorConter(item, index) {
      if (item.projectDivShow === true && item.projectInputShow === false) { // 显示input输入框
        item.projectDivShow = false
        item.projectInputShow = true
        // this.projectInputChange(item)
      } else if (item.projectDivShow === false && item.projectInputShow === true) { // 显示展示框
        item.projectDivShow = true
        item.projectInputShow = false
      }
      if (item.id !== '' && item.id !== null && item.id !== undefined) { // 进行编辑
        this.payProjectUpdateFun(item)
      } else { // 进行添加
        this.payProjectAddFun(item)
      }
    },

    // 删除当前行
    deleteConter(item, index) {
      this.formData.addPayProjectData.splice(index, 1)
      if (item.id !== '' && item.id !== null && item.id !== undefined) { // 删除行有id
        const params = {
          id: item.id,
          status: 0
        }
        payProjectUpdate(params).then(res => {
          if (res.data.errorCode === 0) {
            this.$message.success('删除成功')
            this.queryProjectFun() // 删除成功重新获取支出项目列表
            this.$emit('payProjectUpdateLine') // 删除成功父级支出项目下拉刷新
          } else {
            this.$message.error(res.data.errorMessage)
          }
        })
      }
    },

    /* 关闭弹框 */
    cancelDialog(formName) {
      this.addPayProjectDialogShow = false
    },
    /* 显示弹框 */
    showDialog() {
      this.addPayProjectDialogShow = true
      this.queryProjectFun()
    }
  }
}
</script>

<style lang="scss" scoped>
  .addPayProjectDialog_container /deep/ {
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
