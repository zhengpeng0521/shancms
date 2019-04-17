<template>
  <el-dialog
    :visible="modalVisible"
    title="数据来源"
    width="600px"
    @close="closeModal"
  >
    <div
      v-loading="modalLoading"
      :class="modalLoading ? 'channel-modal-body-null' : 'channel-modal-body'"
      element-loading-text="拼命加载中"
    >
      <div class="channel-left">
        <div>来源类型</div>
        <div
          :style="{height: firstHeight, lineHeight: firstHeight}"
          class="channel-left-content"
        >一级来源</div>
        <div
          :style="{height: secondHeight, lineHeight: secondHeight}"
          class="channel-left-content"
        >二级来源</div>
        <div :style="{height: '40px'}">总数</div>
      </div>
      <div class="channel-right">
        <ul class="channel-right-title">
          <li>来源名称</li>
          <li>名单数量</li>
          <li>占比</li>
        </ul>
        <template v-if="channel.length > 0">
          <div
            v-for="(first, index) in channel"
            :key="'first_'+index"
          >
            <ul class="channel-right-content">
              <li>{{ first.name }}</li>
              <li>{{ first.num }}</li>
              <li>{{ first.ratio }}</li>
            </ul>
          </div>
        </template>
        <div
          v-else
          class="channel-right-content-null"
        />
        <template v-if="secondChannel.length > 0">
          <div
            v-for="(sec, index) in secondChannel"
            :key="'sec_'+index"
          >
            <ul class="channel-right-content">
              <li>{{ sec.name }}</li>
              <li>{{ sec.num }}</li>
              <li>{{ sec.ratio }}</li>
            </ul>
          </div>
        </template>
        <div
          v-else
          class="channel-right-content-null"
        />
        <div>
          <ul class="channel-right-content">
            <li>--</li>
            <li>{{ total }}</li>
            <li>--</li>
          </ul>
        </div>
      </div>
    </div>
    <div slot="footer">
      <el-button
        type="primary"
        @click="closeModal"
      >确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState('saleWork', [
      'modalVisible',
      'modalLoading',
      'channel',
      'secondChannel',
      'total'
    ]),

    firstHeight() {
      const height = this.channel.length > 0 ? this.channel.length * 40 + 'px' : '40px'
      return height
    },
    secondHeight() {
      const height = this.secondChannel.length > 0 ? this.secondChannel.length * 40 + 'px' : '40px'
      return height
    }
  },

  methods: {
    ...mapMutations('saleWork', [
      'UPDATE_STATE'
    ]),

    /** 关闭 */
    closeModal() {
      this.UPDATE_STATE({ modalVisible: false })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";

.channel-modal-body,
.channel-modal-body-null {
  @include flex();
  border-top: 1px solid #ddd;
  border-left: 1px solid #ddd;
  text-align: center;
  line-height: 40px;
  color: #666;
}
.channel-modal-body-null {
  border: 1px solid #ddd;
}
.channel-left {
  width: calc(100% / 4);

  div {
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;

    &:first-child {
      background: #f0f2f5;
      border-bottom: none;
    }
  }

  .channel-left-content {
    min-height: 40px;
  }
}

.channel-right-content-null {
  width: 100%;
  height: 40px;
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}
.channel-right {
  @include flexWidth();

  .channel-right-title {
    @include flex();

    li {
      border-right: 1px solid #ddd;
      background: #f0f2f5;
      @include flexWidth();
    }
  }

  .channel-right-content {
    @include flex();

    li {
      @include flexWidth();
      border-right: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
      height: 40px;
    }
  }
}
</style>
