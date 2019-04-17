<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :append-to-body="true"
      title="学员作品信息"
      width="600px"
      class="stuWorkInfo"
      @close="resetForm"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item
          label="所属分类："
          prop="belongType"
        >
          <el-select
            v-model="ruleForm.belongType"
            placeholder="请选择分类"
          >
            <el-option
              v-for="item in productionList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-button
            type="primary"
            style="margin-left:10px;vertical-align:top"
            @click="createTagNameFunc"
          >创建分类</el-button>
        </el-form-item>
        <el-form-item
          label="所属学员："
          prop="belongStu"
        >
          <el-select
            v-model="ruleForm.belongStu"
            :disabled="isDisabledStu"
            placeholder="请选择学员"
          >
            <el-option
              v-for="item in stuList"
              :key="item.stuId"
              :label="item.stuName"
              :value="item.stuId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-upload
        :on-change="handleChange"
        :on-remove="handleRemove"
        :file-list="fileList"
        class="upload-demo"
        drag
        action="https://imgsrc.ishanshan.com/gimg/upload"
        multiple
        list-type="picture"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          <p>点击或将学生作品拖拽到此区域上传</p>
          <p>支持单个或批量上传</p>
        </div>
        <div
          slot="tip"
          class="el-upload__tip"
        >图片支持png、jpg、jpeg、gif格式的图片，不大于10M!</div>
      </el-upload>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="submitForm"
        >上传</el-button>
      </span>
    </el-dialog>
    <ManageProType
      ref="manageType"
      @toUpdateTagList="getUpdateTagList"
    />
  </div>
</template>

<script>
import { stuSummaryQuery, getWorkTagList, createStuWork } from '@/api/teachManage/homeSchoolConnect'
import ManageProType from './manageProType'
export default {
  components: {
    ManageProType
  },
  data() {
    return {
      dialogVisible: false,
      isDisabledStu: false,
      stuList: [],
      ruleForm: {
        belongType: '', // 所属分类
        belongStu: '' // 所属学员
      },
      rules: {
        belongType: [
          { required: true, message: '请选择分类', trigger: 'change' }
        ],
        belongStu: [
          { required: true, message: '请选择学员', trigger: 'change' }
        ]
      },
      fileList: [],
      productionList: [],
      rowlistData: {}
    }
  },
  methods: {
    show(roslist) {
      this.rowlistData = roslist
      // eslint-disable-next-line
      if(roslist == 'add') {
        this.getStuList()
        this.getWorkTagList()
        this.fileList = []
        this.dialogVisible = true
        this.isDisabledStu = false
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
        })
      } else {
        this.getStuList()
        this.getWorkTagList()
        this.fileList = []
        this.dialogVisible = true
        this.isDisabledStu = true
        this.ruleForm.belongStu = roslist.name
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
        })
      }
    },
    /* 学员列表 */
    getStuList() {
      // eslint-disable-next-line
      if(this.rowlistData == 'add') {
        stuSummaryQuery({ type: '2' }).then(res => {
          const data = res.data
          if (data.errorCode === 0) {
            this.stuList = data.results
          } else {
            this.$message.error(data.errorMessage || '获取学员摘要列表失败')
          }
        })
      } else {
        stuSummaryQuery().then(res => {
          const data = res.data
          if (data.errorCode === 0) {
            this.stuList = data.results
          } else {
            this.$message.error(data.errorMessage || '获取学员摘要列表失败')
          }
        })
      }
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
    /* 刷新作品类列表 */
    getUpdateTagList() {
      this.getWorkTagList()
    },
    submitForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.fileList && this.fileList.length > 0) {
            const works = []
            this.fileList && this.fileList.map(function(item, index) {
              works.push({
                title: item.name,
                imgUrl: item.response.data.url,
                imgSize: item.size
              })
            })
            // eslint-disable-next-line
            if(this.isDisabledStu == true) {
              this.stuList && this.stuList.map(item => {
                // eslint-disable-next-line
                if (this.ruleForm.belongStu == item.stuName) {
                  this.ruleForm.belongStu = item.stuId
                }
              })
            }
            const params = {
              stuId: this.ruleForm.belongStu,
              workTagId: this.ruleForm.belongType,
              works: works,
              allSize: 5368709120,
              usedSize: 0
            }
            createStuWork(params).then(res => {
              const data = res.data
              if (data.errorCode === 0) {
                this.dialogVisible = false
                this.$message.success(data.errorMessage)
                // eslint-disable-next-line
                if(this.isDisabledStu == true) {
                  this.$emit('toCrmDetailPro')
                } else {
                  this.$emit('toUpdateTable')
                }
              } else {
                this.$message.error(data.errorMessage || '上传作品失败')
              }
            })
          } else {
            this.$message.error('请上传作品')
          }
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.$refs['ruleForm'].resetFields()
    },
    handleChange(file, fileList) {
      if (file.status == 'success') { //eslint-disable-line
        this.fileList = fileList
      }
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    createTagNameFunc() {
      this.$refs.manageType.show()
    }
  }
}
</script>
<style lang="scss" scoped>
.stuWorkInfo /deep/ {
  .el-dialog__body {
    margin-bottom: 14px;
  }
}
.upload-demo /deep/ .el-upload-dragger {
  width: 550px;
  height: 198px;
}
.upload-demo /deep/ .el-upload-dragger:hover {
  border-color: #46b6ee;
}
.el-upload__tip {
  color: rgb(153, 153, 153);
}
</style>
