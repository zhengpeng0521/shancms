<template>
  <div
    v-loading="loading"
    :class="loading ? 'leads-table-null' : 'leads-table'"
    element-loading-text="拼命加载中"
  >
    <div class="leads-left">
      <div>来源类型</div>
      <div
        :style="{height: firstHeight, lineHeight: firstHeight}"
        class="leads-left-content"
      >一级来源</div>
      <div
        :style="{height: secondHeight, lineHeight: secondHeight}"
        class="leads-left-content"
      >二级来源</div>
      <div :style="{height: '50px'}">总数</div>
    </div>
    <div class="leads-right">
      <ul class="leads-right-title">
        <li>来源名称</li>
        <li>名单数量</li>
        <li>占比</li>
        <li>转为学员数量</li>
        <li>转化率</li>
      </ul>
      <template v-if="firstSource.length > 0">
        <div
          v-for="(first, index) in firstSource"
          :key="'first'+index"
        >
          <ul class="leads-right-content">
            <li>{{ first.sourceName }}</li>
            <li>{{ first.sourceNum }}</li>
            <li>{{ first.sourceRate }}</li>
            <li>{{ first.turnStu }}</li>
            <li>{{ first.turnStuRate }}</li>
          </ul>
        </div>
      </template>
      <div
        v-else
        class="leads-right-null"
      />
      <template v-if="secSource.length > 0">
        <div
          v-for="(sec, index) in secSource"
          :key="'sec'+index"
        >
          <ul class="leads-right-content">
            <li>{{ sec.sourceName }}</li>
            <li>{{ sec.sourceNum }}</li>
            <li>{{ sec.sourceRate }}</li>
            <li>{{ sec.turnStu }}</li>
            <li>{{ sec.turnStuRate }}</li>
          </ul>
        </div>
      </template>
      <div
        v-else
        class="leads-right-null"
      />
      <div
        v-for="(total, index) in totalSource"
        :key="'total'+index"
      >
        <ul class="leads-right-content">
          <li>{{ total.sourceName || '--' }}</li>
          <li>{{ total.sourceNum }}</li>
          <li>{{ total.sourceRate || '--' }}</li>
          <li>{{ total.turnStu }}</li>
          <li>{{ total.turnStuRate }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      required: true
    },
    firstSource: {
      type: Array,
      required: true
    },
    secSource: {
      type: Array,
      required: true
    },
    totalSource: {
      type: Array,
      required: true
    }
  },

  computed: {
    firstHeight() {
      const height = this.firstSource.length > 0 ? this.firstSource.length * 50 + 'px' : '50px'
      return height
    },
    secondHeight() {
      const height = this.secSource.length > 0 ? this.secSource.length * 50 + 'px' : '50px'
      return height
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";

.leads-table,
.leads-table-null {
  @include flex();
  margin-top: 20px;
  border-top: 1px solid #ddd;
  border-left: 1px solid #ddd;
  text-align: center;
  line-height: 50px;
  color: #666;
}
.leads-table-null {
  border: 1px solid #ddd;
}
.leads-left {
  width: calc(100% / 6);

  div {
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;

    &:first-child {
      background: #f0f2f5;
      border-bottom: none;
    }
  }

  .leads-left-content {
    min-height: 50px;
  }
}
.leads-right {
  @include flexWidth();

  .leads-right-title {
    @include flex();

    li {
      border-right: 1px solid #ddd;
      background: #f0f2f5;
      @include flexWidth();
    }
  }

  .leads-right-content {
    @include flex();

    li {
      @include flexWidth();
      border-right: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
      height: 50px;
    }
  }
  .leads-right-null {
    height: 50px;
    width: 100%;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
  }
}
</style>

