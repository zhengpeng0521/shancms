<template>
  <div class="listen-container">
    <el-button
      type="primary"
      @click="() => {openAdd('edit')}"
    >添加试听记录</el-button>
    <div
      v-loading="loading"
      element-loading-text="拼命加载中"
      class="listen-list-box"
    >
      <pull-to @infinite-scroll="loadmore">
        <div class="listen-list">
          <ListenItem
            v-for="(item, index) of listenRecordList"
            :item="item"
            :key="'list_'+index"
            :cancel-listen="cancelListen"
            :update-status="updateStatus"
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
    <AddAuditionDialog
      ref="listenAdd"
      @toOfflineDetailPage="getListenListDetail"
    />
    <ListenCancel
      ref="listenCancel"
      :save-reson="saveReson"
    />
  </div>
</template>

<script>
import PullTo from 'vue-pull-to'
import ListenItem from './ListenItem'
import ListenCancel from './ListenCancel'
import AddAuditionDialog from '@/views/crm/auditionMgr/components/addAuditionDialog'
import {
  updateStatus // 修改状态
} from '@/api/crm/auditionMgr/auditionMgr.js'

export default {
  components: {
    PullTo,
    ListenItem,
    ListenCancel,
    AddAuditionDialog
  },

  props: {
    listenRecordList: {
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
    getListenList: {
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
      editFrom: {},
      rowlist: {}
    }
  },
  created() {
  },

  methods: {

    /** 打开取消试听 */
    cancelListen(row) {
      this.rowlist = row
      this.$refs.listenCancel.cancelVisible = true
    },

    /** 保存编辑 */
    saveReson(values) {
      const params = {
        ids: this.rowlist.id,
        status: '0',
        reason: values.reason
      }
      updateStatus(params).then(res => {
        if (res.data.errorCode === 0) {
          const payload = {
            pageSize: 5,
            pageIndex: 0,
            stuId: this.params.stuId,
            source: this.params.source
          }
          // 更新列表
          this.getListenList(payload, true)
          this.$message.success(res.data.errorMessage)
          this.$emit('toUpdateTable')
          this.$refs.listenCancel.cancelVisible = false
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    /** 添加试听记录 */
    openAdd(type, item) {
      this.$refs.listenAdd.showDialog(type, this.$props.params)
    },

    updateStatus(status, item) {
      console.log('status,item', status, item)
    },

    /** 更新状态 */
    getListenListDetail(value) {
      const payload = {
        pageSize: 5,
        pageIndex: 0,
        stuId: value.stuId,
        source: value.source
      }
      // 更新列表
      this.getListenList(payload, true)
      this.$emit('toUpdateTable')
    }

  }
}
</script>

<style lang="scss" scoped>
.listen-container {
  padding-left: 20px;
}
.listen-list-box {
  margin-top: 10px;
  height: calc(100vh - 330px);
  margin-right: -10px;
}
.listen-list {
  padding-right: 10px;
}
.leads-bottom-text {
  text-align: center;
  color: #999;
}
</style>
