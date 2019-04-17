<template>
  <div class="visite-container">
    <el-button
      type="primary"
      @click="() => {openEdit('add')}"
    >添加到访记录</el-button>
    <div
      v-loading="loading"
      element-loading-text="拼命加载中"
      class="visite-list-box"
    >
      <pull-to @infinite-scroll="loadmore">
        <div class="visite-list">
          <VisiteItem
            v-for="(item, index) of visiteRecordList"
            :item="item"
            :key="'list_'+index"
            :update-status="updateStatus"
            :open-edit="openEdit"
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
    </div>
    <VisiteEdit
      ref="visiteEdit"
      :modal-type="modalType"
      :edit-from="editFrom"
      :save-edit="saveEdit"
      :params="params"
    />
  </div>
</template>

<script>
import PullTo from 'vue-pull-to'
import VisiteItem from './VisiteItem'
import VisiteEdit from './VisiteEdit'
import { addVisitRecord, updateVisitStatus, updateVisitRecord } from '@/api/crmDetail/crmDetail'
export default {
  components: {
    PullTo,
    VisiteItem,
    VisiteEdit
  },

  props: {
    visiteRecordList: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      required: true
    },
    loadmore: {
      type: Function,
      required: true
    },
    hasMore: {
      type: Boolean,
      required: true
    },
    getVisiteList: {
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
      modalType: 'add',
      editFrom: {}
    }
  },

  methods: {

    /** 打开编辑 */
    openEdit(type, item) {
      this.modalType = type
      if (type === 'edit') {
        this.editFrom = item
        this.$refs.visiteEdit.show(item)
      } else {
        this.editFrom = {
          stuName: this.params.stuName
        }
        this.$refs.visiteEdit.editVisible = true
      }
    },

    /** 保存编辑 */
    saveEdit(values) {
      delete values.stuName
      let params = {}
      if (this.modalType == 'add') { //eslint-disable-line
        params = {
          ...values,
          stuId: this.params.stuId,
          source: this.params.source,
          sellerId: this.params.sellerId
        }
        addVisitRecord(params).then(res => {
          const data = res.data
          if (data.errorCode === 0) {
            this.$refs.visiteEdit.editVisible = false
            const payload = {
              pageSize: 5,
              pageIndex: 0,
              stuId: this.params.stuId,
              source: this.params.source
            }
            // 更新列表
            this.getVisiteList(payload, true)
            this.$emit('toUpdateTable')
            this.$refs.visiteEdit.visiteEditForm.content = ''
            this.$refs.visiteEdit.visiteEditForm.visitTime = ''
            this.$message.success(data.errorMessage)
            // 更新头部信息
          } else {
            this.$message.error(data.errorMessage)
          }
        })
      } else {
        delete values.sellerName
        params = {
          ...values,
          sellerId: this.editFrom.sellerId,
          id: this.editFrom.id,
          stuId: this.editFrom.stuId,
          source: this.params.source
        }
        updateVisitRecord(params).then(res => {
          const data = res.data
          if (data.errorCode === 0) {
            this.$refs.visiteEdit.editVisible = false
            const payload = {
              pageSize: 5,
              pageIndex: 0,
              stuId: this.params.stuId,
              source: this.params.source
            }
            // 更新列表
            this.getVisiteList(payload, true)
            this.$emit('toUpdateTable')
            this.$refs.visiteEdit.visiteEditForm.content = ''
            this.$refs.visiteEdit.visiteEditForm.visitTime = ''
            this.$message.success(data.errorMessage)
          } else {
            this.$message.error(data.errorMessage)
          }
        })
      }
    },

    /** 更新状态 */
    updateStatus(status, id) {
      const params = {
        ids: id,
        status: status
      }
      updateVisitStatus(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          const payload = {
            pageSize: 5,
            pageIndex: 0,
            stuId: this.params.stuId,
            source: this.params.source
          }
          // 更新列表
          this.getVisiteList(payload, true)
          this.$emit('toUpdateTable')
          this.$message.success(data.errorMessage)
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.visite-container {
  padding-left: 20px;
}
.visite-list-box {
  margin-top: 10px;
  height: calc(100vh - 330px);
  margin-right: -10px;
}
.visite-list {
  padding-right: 10px;
}
.leads-bottom-text {
  text-align: center;
  color: #999;
}
</style>
