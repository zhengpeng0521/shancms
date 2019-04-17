<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      title="学员作品信息"
      width="600px"
    >
      <div>
        <img
          :src="updateInfo.imgurl"
          alt="example"
          width="100%"
        >
      </div>
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        style="margin-top:20px"
        label-width="100px"
      >
        <el-form-item
          label="所属分类："
          prop="belongType"
        >
          <el-select
            v-model="ruleForm.belongType"
            placeholder="请选择分类"
            style="width:450px"
          >
            <el-option
              v-for="item in productionList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="所属学员："
          prop="belongStu"
        >
          <el-select
            v-model="ruleForm.belongStu"
            placeholder="请选择学员"
            style="width:450px"
            @change="stuChange"
          >
            <el-option
              v-for="item in newStuList"
              :key="item.stuId"
              :label="item.stuName"
              :value="item.stuId"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="作品标题："
          prop="title"
        >
          <el-input v-model="ruleForm.title" />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="submitForm"
        >保存</el-button>
        <el-button
          class="cancel_btn"
          @click="resetForm"
        >取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { stuSummaryQuery, updateStuWork, getWorkTagList } from '@/api/teachManage/homeSchoolConnect'
export default {
  data() {
    return {
      dialogVisible: false,
      newStuList: [], // 学员列表
      ruleForm: {
        belongType: '未分类', // 所属分类
        belongStu: '', // 所属学员
        title: '' // 作品标题
      },
      rules: {
        belongType: [
          { required: true, message: '请选择分类', trigger: 'change' }
        ],
        belongStu: [
          { required: true, message: '请选择学员', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入作品标题', trigger: 'change' }
        ]
      },
      updateInfo: {}, // 学员信息
      productionList: [],
      flag: false // 监测学员是否改变
    }
  },
  methods: {
    show(row) {
      this.getStuList()
      this.getWorkTagList()
      this.dialogVisible = true
      this.updateInfo = row
      this.ruleForm.belongType = this.updateInfo.tagId
      this.ruleForm.belongStu = this.updateInfo.stuName
      this.ruleForm.title = this.updateInfo.title
    },
    /* 学员列表 */
    getStuList() {
      stuSummaryQuery({ type: '2' }).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.newStuList = data.results
        } else {
          this.$message.error(data.errorMessage || '获取学员摘要列表失败')
        }
      })
    },
    /* 学员数据改变 */
    stuChange(val) {
      this.ruleForm.belongStu = val
      this.flag = true
    },
    /* 作品标签列表 */
    getWorkTagList() {
      getWorkTagList().then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.productionList = data.results
        } else {
          this.$message.error(data.errorMessage || '获取作品标签列表')
        }
      })
    },
    submitForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.dialogVisible = false
          let stuId = ''
          if (this.flag) {
            stuId = this.ruleForm.belongStu
          } else {
            stuId = this.updateInfo.stuId
          }
          const params = {
            id: this.updateInfo.id,
            stuId: stuId,
            title: this.ruleForm.title,
            tagId: this.ruleForm.belongType
          }
          updateStuWork(params).then(res => {
            const data = res.data
            if (data.errorCode === 0) {
              this.$message.success(data.errorMessage)
              this.$emit('toUpdateTable')
            } else {
              this.$message.error(data.errorMessage || '修改失败')
            }
          })
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
