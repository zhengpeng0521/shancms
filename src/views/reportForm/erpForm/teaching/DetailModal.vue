<template>
  <el-dialog
    :visible="detailVisible"
    title="授课明细"
    width="700px"
    @close="closeDetail"
  >
    <div
      v-loading="detailLoading"
      element-loading-text="拼命加载中"
      class="detail-table-box"
    >
      <div
        v-if="detailList.length > 0"
        class="detail-table-container"
      >
        <ul class="detail-table-header">
          <li />
          <li class="detail-table-name detail-table-bg">课程名称</li>
          <li class="detail-table-bg">授课课时数</li>
          <li class="detail-table-times">
            <div>
              <p class="detail-table-top detail-table-bg">授课节数</p>
              <ul class="detail-table-merge">
                <li>上课</li>
                <li>补课</li>
                <li>试听</li>
                <li>合计</li>
              </ul>
            </div>
          </li>
          <li class="detail-table-times">
            <div>
              <p class="detail-table-top detail-table-bg">教学人次</p>
              <ul class="detail-table-merge">
                <li>上课</li>
                <li>补课</li>
                <li>试听</li>
                <li>合计</li>
              </ul>
            </div>
          </li>
        </ul>
        <div class="detail-table-content">
          <div
            :style="{lineHeight: detailList.length > 0 ? (detailList.length+1)*50 + 'px': '50px'}"
            class="content-left"
          >{{ detailList[0].name }}</div>
          <div>
            <ul
              v-for="(item, index) in detailList"
              :key="'detail' + index"
              class="detail-table-list"
            >
              <li>{{ item.title }}</li>
              <li>{{ item.teacherHours }}</li>
              <li>{{ item.tattend }}</li>
              <li>{{ item.tmakeup }}</li>
              <li>{{ item.taudition }}</li>
              <li>{{ parseFloat(item.tattend)+parseFloat(item.tmakeup)+parseFloat(item.taudition) }}</li>
              <li>{{ item.sattend }}</li>
              <li>{{ item.smakeup }}</li>
              <li>{{ item.saudition }}</li>
              <li>{{ parseFloat(item.sattend)+parseFloat(item.smakeup)+parseFloat(item.saudition) }}</li>
            </ul>
            <ul class="detail-table-list detail-table-total">
              <li>汇总</li>
              <li>{{ detailTotal.teacherHours }}</li>
              <li>{{ detailTotal.tAttend }}</li>
              <li>{{ detailTotal.tMakeup }}</li>
              <li>{{ detailTotal.tAudition }}</li>
              <li>{{ parseFloat(detailTotal.tAttend)+parseFloat(detailTotal.tMakeup)+parseFloat(detailTotal.tAudition) }}</li>
              <li>{{ detailTotal.sAttend }}</li>
              <li>{{ detailTotal.sMakeup }}</li>
              <li>{{ detailTotal.sAudition }}</li>
              <li>{{ parseFloat(detailTotal.sAttend)+parseFloat(detailTotal.sMakeup)+parseFloat(detailTotal.sAudition) }}</li>
            </ul>
          </div>
        </div>
      </div>
      <NullData v-else />
    </div>
  </el-dialog>
</template>

<script>
import NullData from '@/components/MiniCommon/NullData'

export default {
  components: {
    NullData
  },

  props: {
    detailVisible: {
      type: Boolean,
      required: true
    },
    closeDetail: {
      type: Function,
      required: true
    },
    detailLoading: {
      type: Boolean,
      required: true
    },
    detailList: {
      type: Array,
      default: () => []
    },
    detailTotal: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";

.detail-table-box {
  margin-bottom: 10px;
  overflow: auto;
  max-height: 410px;
  margin-right: -10px;
}
.detail-table-container {
  border: 1px solid #e9e9e9;
  width: 822px;
  border-bottom: none;
  border-right: none;

  .detail-table-name {
    width: 180px;
  }
  .detail-table-times {
    width: 200px;
    line-height: 50px;
  }
}

.detail-table-bg {
  background-color: rgb(245, 245, 245);
}

.detail-table-header {
  width: 820px;
  line-height: 100px;
  @include flex();

  li {
    width: 120px;
    height: 100px;
    border-right: 1px solid #e9e9e9;
    border-bottom: 1px solid #e9e9e9;
    text-align: center;
  }
  .detail-table-top {
    height: 50px;
    border-bottom: 1px solid #e9e9e9;
  }
  .detail-table-merge {
    @include flex();

    li {
      height: 50px;
    }
    li:last-child {
      border-right: none;
    }
  }
}

.detail-table-content {
  @include flex();
  width: 820px;

  .content-left {
    width: 120px;
    border-right: 1px solid #e9e9e9;
    border-bottom: 1px solid #e9e9e9;
    text-align: center;
  }
}
.detail-table-list {
  @include flex();

  li {
    width: 50px;
    line-height: 50px;
    border-right: 1px solid #e9e9e9;
    border-bottom: 1px solid #e9e9e9;
    text-align: center;

    &:first-child {
      width: 180px;
    }
    &:nth-child(2) {
      width: 120px;
    }
  }
}
.detail-table-total {
  background: rgb(252, 221, 79);
}
</style>
