<template>
  <div class="addFollowDialog_container">
    <el-dialog
      :visible.sync="addFollowDialogShow"
      title="跟进记录"
      @close="cancelDialog('addFollowForm')"
    >
      <el-form
        ref="addFollowForm"
        :model="addFollowData"
        :rules="rules"
        label-width="90px"
      >
        <el-form-item label="跟进人:">
          <span>{{ uName }}</span>
        </el-form-item>
        <el-form-item
          :label="source == '2' ? '跟进名单': '跟进学员'"
          prop="stuId"
        >
          <el-select
            v-model="addFollowData.stuId"
            :placeholder="source == '2' ? '请选择跟进名单': '请选择跟进学员'"
            :disabled="isDisabled"
            clearable
            style="width:100%"
            @change="stuChange"
          >
            <el-option
              v-for="item in stuList"
              :key="item.stuId"
              :label="item.stuName"
              :value="item.stuId"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :rules="{
            required: source=='2' , message: '请选择跟进家长', trigger: 'blur'
          }"
          label="跟进家长:"
          prop="parentId"
        >
          <el-select
            v-model="addFollowData.parentId"
            :disabled="isDisabled"
            placeholder="请选择跟进家长"
            clearable
            style="width:100%"
          >
            <el-option
              v-for="item in parentList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="跟进方式:"
          prop="type"
        >
          <el-select
            v-model="addFollowData.type"
            placeholder="请选择跟进方式"
            clearable
            style="width:100%"
          >
            <el-option
              v-for="item in followTypeList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <div v-if="source == '2'">
          <el-form-item
            label="跟进状态:"
            prop="followType"
          >
            <el-select
              v-model="addFollowData.followType"
              placeholder="请选择跟进状态"
              clearable
              style="width:100%"
            >
              <el-option
                v-for="item in studentFollowState "
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item
          label="跟进内容:"
          prop="content"
        >
          <el-input
            v-model="addFollowData.content"
            :rows="4"
            clearable
            type="textarea"
            placeholder="请输入跟进内容"
          />
        </el-form-item>
        <el-form-item
          label="下次跟进:"
          prop="nextFollowTime"
        >
          <el-date-picker
            v-model="addFollowData.nextFollowTime"
            :picker-options="pickerOptions"
            type="datetime"
            placeholder="请选择下次跟进时间"
            style="width: 100%"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog('addFollowForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('addFollowForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import moment from 'moment'
import { dictGetByKey, getMsg, leadsSummary, stusOfUser, getParentByStu, parentSummary, create, update } from '@/api/crm/followRecord/followRecord'
export default {
  props: {
    source: {
      type: String,
      default: () => {
        return null
      }
    }
  },
  data() {
    return {
      addFollowDialogShow: false,
      uName: '',
      addFollowData: {
        stuId: '',
        parentId: '',
        type: '',
        followType: '',
        content: '',
        nextFollowTime: '',
        visitTime: ''
      },
      rules: {
        stuId: [
          { required: true, message: '请选择跟进学员', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择跟进方式', trigger: 'change' }
        ],
        followType: [
          { required: true, message: '请选择跟进状态', trigger: 'change' }
        ],
        content: [
          { required: true, message: '限500字', max: 500, trigger: 'change' }
        ]
      },
      followTypeList: [], // 跟进方式
      studentFollowState: [], // 跟进状态
      stuList: [], // 在读学员/名单列表
      parentList: [], // 在读学员/名单家长列表
      rowInfo: {}, // 选中的编辑项
      isDisabled: false,
      type: '',
      pickerOptions: {
        disabledDate(current) {
          return moment(current).isBefore(moment(), 'day')
        }
      }
    }
  },
  methods: {
    /* 显示弹框 */
    showDialog(type, val) {
      this.type = type
      this.addFollowDialogShow = !this.addFollowDialogShow
      this.getFollowType()
      this.getFollowState()
      this.stuList = []
      if(this.source == '2') { //eslint-disable-line
        this.getLeadsSummary()
      } else {
        this.getStusOfUser()
      }
      this.rowInfo = {}
      if (val) {
        this.rowInfo = val
        this.isDisabled = true
        this.getMsg({ id: this.rowInfo.id })
      } else {
        this.isDisabled = false
        this.uName = this.$store.getters.name
      }
    },
    /* 在读/潜在家长列表 */
    getParentList(params) {
      if (this.source == '2') { //eslint-disable-line
        getParentByStu(params).then(res => {
          const data = res.data
          if (data.errorCode === 0) {
            this.parentList = data.results
          } else {
            this.$message.error(data.errorMessage)
          }
        })
      } else {
        parentSummary(params).then(res => {
          const data = res.data
          if (data.errorCode === 0) {
            this.parentList = data.results
          } else {
            this.$message.error(data.errorMessage)
          }
        })
      }
    },
    /* 跟进学员/名单 */
    stuChange(val) {
      if (val) {
        this.getParentList({ stuId: val })
      } else {
        this.addFollowData.parentId = ''
      }
    },
    /* 跟进方式 */
    getFollowType() {
      const params = {
        dictkey: 'studentFollowWay'
      }
      dictGetByKey(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.followTypeList = data.results
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 获取信息 */
    getMsg(params) {
      getMsg(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.uName = this.$store.getters.name
          this.addFollowData.stuId = data.stuId
          this.addFollowData.parentId = data.parentId
          this.addFollowData.type = data.type
          this.addFollowData.followType = data.followType
          this.addFollowData.content = data.content
          this.addFollowData.nextFollowTime = data.nextFollowTime
          this.getParentList({ stuId: data.stuId })
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 跟进状态*/
    getFollowState() {
      const params = {
        dictkey: 'studentFollowState'
      }
      dictGetByKey(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.studentFollowState = data.results
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 名单学员 */
    getLeadsSummary() {
      leadsSummary().then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.stuList = data.results
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 在读学员 */
    getStusOfUser() {
      stusOfUser().then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.stuList = data.results
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 关闭弹框 */
    cancelDialog(formName) {
      this.addFollowDialogShow = false
      this.$refs[formName].resetFields()
    },
    /* 确定提交弹框表单内容 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {}
          if (this.type =='edit') { //eslint-disable-line
            if (this.source == '2') { //eslint-disable-line
              params = {
                ...this.addFollowData,
                source: this.source,
                id: this.rowInfo.id
              }
            } else {
              delete this.addFollowData.status
              params = {
                ...this.addFollowData,
                source: this.source,
                id: this.rowInfo.id
              }
            }
            update(params).then(res => {
              const data = res.data
              if (data.errorCode === 0) {
                this.addFollowDialogShow = false
                this.$emit('toUpdateTable')
                this.$message.success(data.errorMessage)
              } else {
                this.$message.error(data.errorMessage)
              }
            })
          } else {
            if (this.source == '2') { //eslint-disable-line
              params = {
                ...this.addFollowData,
                source: this.source
              }
            } else {
              delete this.addFollowData.status
              params = {
                ...this.addFollowData,
                source: this.source
              }
            }
            create(params).then(res => {
              const data = res.data
              if (data.errorCode === 0) {
                this.addFollowDialogShow = false
                this.$emit('toUpdateTable')
                this.$message.success(data.errorMessage)
              } else {
                this.$message.error(data.errorMessage)
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.addFollowDialog_container /deep/ {
  .el-dialog {
    width: 550px;
  }
}
</style>

