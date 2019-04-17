<template>
  <div class="leads-content">
    <pull-to @infinite-scroll="loadmore">
      <div class="leads-list-box">
        <div>
          <el-form
            ref="leadsForm"
            :model="leadsForm"
          >
            <el-form-item
              :rules="[
                { required: true, message: '请输入跟进记录', trigger: 'blur' },
                { max: 200, message: '不能超过200字', trigger: 'change' }
              ]"
              prop="content"
            >
              <el-input
                v-model="leadsForm.content"
                :rows="4"
                type="textarea"
                placeholder="新建跟进记录 (必填，200字)"
              />
            </el-form-item>
            <div :class="params.source == '2' ? 'inline-form':'inline-form-read'">
              <el-form-item
                :rules="[
                  { required: true, message: '请选择家长', trigger: 'change' }
                ]"
                prop="parentId"
              >
                <el-select
                  v-model="leadsForm.parentId"
                  placeholder="家长姓名(必填)"
                  class="form-width"
                >
                  <el-option
                    v-for="(item, index) in parentOpts"
                    :key="'parent_'+index"
                    :label="params.source == '2' ? item.parentName+'（家长姓名）': item.name+'（家长姓名）'"
                    :value="params.source == '2' ? item.parentId : item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                :rules="[
                  { required: true, message: '请选择跟进方式', trigger: 'change' }
                ]"
                prop="type"
              >
                <el-select
                  v-model="leadsForm.type"
                  placeholder="跟进方式(必填)"
                  class="form-width"
                >
                  <el-option
                    v-for="(item, index) in followOpts"
                    :key="'follow_'+index"
                    :label="item.value"
                    :value="item.key"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="params.source == '2'"
                prop="followType"
              >
                <el-select
                  v-model="leadsForm.followType"
                  :clearable="true"
                  placeholder="跟进状态(选填)"
                  class="form-width"
                >
                  <el-option
                    v-for="(item, index) in stutasOpts"
                    :key="'follow_'+index"
                    :label="item.value"
                    :value="item.key"
                  />
                </el-select>
              </el-form-item>
              <el-form-item prop="nextFollowTime">
                <el-date-picker
                  v-model="leadsForm.nextFollowTime"
                  :picker-options="pickerOptions"
                  type="date"
                  placeholder="下次跟进时间"
                  class="form-width"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  @click="submitForm('leadsForm')"
                >发布</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <LeadsItem
          v-for="(item, index) of leadsRecordList"
          :item="item"
          :key="'list_'+index"
          :open-edit="() => {openEdit(item)}"
          :delete-item="() => {deleteItem(item)}"
        />
        <div
          v-if="loading"
          class="leads-bottom-text"
        >
          <i class="el-icon-loading" />
          加载中...
        </div>
        <div
          v-else-if="!loading && !hasMore"
          class="leads-bottom-text"
        >没有更多了</div>
        <div
          v-else-if="!loading && hasMore"
          class="leads-bottom-text"
        >下拉加载更多</div>
      </div>
    </pull-to>
    <LeadsEdit
      ref="leadsEdit"
      :edit-from="editFrom"
      :save-edit="saveEdit"
      :params="params"
    />
  </div>
</template>

<script>
import PullTo from 'vue-pull-to'
import LeadsItem from './LeadsItem'
import LeadsEdit from './LeadsEdit'
import moment from 'moment'
import { createLeadsRecord, dictGetByKey, parentList, parentSummary, update, Delete } from '@/api/crmDetail/crmDetail'

export default {

  components: {
    LeadsItem,
    PullTo,
    LeadsEdit
  },

  props: {
    leadsRecordList: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      required: true
    },
    hasMore: {
      type: Boolean,
      required: true
    },
    loadmore: {
      type: Function,
      required: true
    },
    getLeadsRecord: {
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
      leadsForm: {
        content: '',
        parentId: '',
        followType: '',
        type: '',
        nextFollowTime: ''
      },
      parentOpts: [],
      followOpts: [],
      stutasOpts: [],
      editFrom: {},
      pickerOptions: {
        disabledDate(current) {
          return moment(current).isBefore(moment(), 'day')
        }
      }
    }
  },
  watch: {
    params(val) {
      this.leadsForm.followType = val.studentFollowState
    }
  },

  mounted() {
    this.getOpts()
  },
  methods: {
    /** 点击发布 */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.createRecord(this.leadsForm)
        } else {
          return false
        }
      })
    },

    /** 发布 */
    async createRecord(params) {
      const payload = {
        ...params,
        stuId: this.params.stuId,
        source: this.params.source
      }
      const { data } = await createLeadsRecord(payload)
      if (data.errorCode === 0) {
        this.$message({
          message: '发布成功',
          type: 'success'
        })
        this.$refs['leadsForm'].resetFields()
        if (this.params.source == '2') { //eslint-disable-line
          this.leadsForm.parentId = this.parentOpts[0].parentId
        }
        const payload = {
          pageSize: 5,
          pageIndex: 0,
          stuId: this.params.stuId,
          source: this.params.source
        }
        // 更新列表
        this.getLeadsRecord(payload, true)
        this.$emit('toUpdateTable')
        // 更新头部信息
        // this.xxx
      } else {
        this.$message.error('发布失败')
      }
    },

    /** 获取家长下拉 */
    getOpts() {
      this.getFollowType()
      this.getFollowStatus()
      this.getParentList()
    },

    /** 打开编辑 */
    openEdit(item) {
      this.editFrom = item
      this.$refs.leadsEdit.editVisible = true
    },

    /** 保存编辑 */
    saveEdit(values) {
      delete values.stuName
      delete values.orgName
      const params = {
        ...values,
        orgId: this.editFrom.orgId,
        source: this.params.source,
        stuId: this.editFrom.stuId,
        id: this.editFrom.id
      }
      update(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.$refs.leadsEdit.editVisible = false
          const payload = {
            pageSize: 5,
            pageIndex: 0,
            stuId: this.params.stuId,
            source: this.params.source
          }
          // 更新列表
          this.getLeadsRecord(payload, true)
          this.$emit('toUpdateTable')
          this.$message.success(data.errorMessage)
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },

    /** 删除 */
    deleteItem(item) {
      const params = {
        ids: item.id
      }
      Delete(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          const payload = {
            pageSize: 5,
            pageIndex: 0,
            stuId: this.params.stuId,
            source: this.params.source
          }
          // 更新列表
          this.getLeadsRecord(payload, true)
          this.$emit('toUpdateTable')
          this.$message.success(data.errorMessage)
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 跟进方式 */
    getFollowType() {
      const params = {
        dictkey: 'studentFollowWay'
      }
      dictGetByKey(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.followOpts = data.results
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 跟进状态 */
    getFollowStatus() {
      const params = {
        dictkey: 'studentFollowState'
      }
      dictGetByKey(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.stutasOpts = data.results
          this.leadsForm.followType = this.params.studentFollowState
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 名单家长列表 */
    getParentList() {
      if (this.params.source == '2') { //eslint-disable-line
        const paylaod = {
          stuId: this.params.id
        }
        parentList(paylaod).then(res => {
          const data = res.data
          if (data.errorCode === 0) {
            if (data.results && data.results.length > 0) {
              this.parentOpts = data.results
              this.leadsForm.parentId = this.parentOpts[0].parentId
            } else {
              if (this.params.parentId && this.params.parentName) {
                this.parentOpts = [
                  {
                    parentId: this.params.parentId,
                    parentName: this.params.parentName
                  }
                ]
                this.leadsForm.parentId = this.parentOpts[0].parentId
              }
            }
          } else {
            this.$message.error(data.errorMessage)
          }
        })
      } else {
        const payload = {
          stuId: this.params.stuId
        }
        parentSummary(payload).then(res => {
          const data = res.data
          if (data.errorCode === 0) {
            this.parentOpts = data.results
          } else {
            this.$message.error(data.errorMessage)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";

.leads-content {
  padding: 10px 0 20px 20px;
  margin-right: -10px;
  height: calc(100vh - 278px);
}
.leads-list-box {
  padding-right: 10px;
}
.form-width {
  width: 140px;
}
.inline-form {
  @include flex();
  @include flexCenter(space-between);
}
.inline-form-read {
  @include flex();
  @include flexCenter(space-between);
  .form-width {
    width: 180px;
  }
}
.leads-bottom-text {
  text-align: center;
  color: #999;
}
</style>

<style lang="scss">
.form-width .el-input__inner {
  padding-left: 15px;
}
.leads-box {
  padding-right: 10px;
}
</style>
