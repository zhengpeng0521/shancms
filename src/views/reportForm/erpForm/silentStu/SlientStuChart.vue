<template>
  <div
    v-loading="loading"
    element-loading-text="拼命加载中"
    class="slient-chart-card"
  >
    <div class="slient-chart-title">
      <h3>未开课包学员<span class="slient-help">( 选定时间内, 审核通过的合同里, 未使用过课时的学员 )</span></h3>
      <el-button
        type="primary"
        icon="el-icon-document"
        @click="() => {exportFile('noPkg')}"
      >按查询结果导出</el-button>
    </div>
    <div class="slient-chart-content">
      <div class="slient-chart-left">
        <ve-pie
          v-if="firstSource.length > 0 && firstSource[0].num > 0"
          :data="leftData"
          :settings="leftSettings"
          :legend-visible="false"
          :extend="chartExtend"
        />
        <NullData
          v-else
          class="null-data-box"
        />
      </div>
      <div class="slient-chart-right">
        <ve-pie
          v-if="secondSource.length > 0 && secondSource[0].num > 0"
          :data="rightData"
          :settings="rightSettings"
          :legend-visible="false"
          :extend="chartExtend"
        />
        <NullData
          v-else
          class="null-data-box"
        />
      </div>
    </div>
  </div>
</template>

<script>
import NullData from '@/components/MiniCommon/NullData'

export default {
  components: {
    NullData
  },

  props: {
    loading: {
      type: Boolean,
      required: true
    },
    firstSource: {
      type: Array,
      required: true
    },
    secondSource: {
      type: Array,
      required: true
    },
    exportFile: {
      type: Function,
      required: true
    }
  },

  data() {
    this.chartExtend = {
      tooltip(v) {
        v.backgroundColor = '#fff'
        v.borderWidth = 1
        v.borderColor = '#eee'
        v.extraCssText = 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);'
        v.confine = true
        v.textStyle = {
          color: '#666'
        }
        return v
      }
    }

    this.leftSettings = {
      level: [
        ['总学员'],
        ['新签学员', '续约学员']
      ]
    }

    this.rightSettings = {
      level: [
        ['总学员'],
        ['新学员', '老学员']
      ]
    }

    return {
      leftData: {
        columns: ['type', 'num'],
        rows: []
      },
      rightData: {
        columns: ['type', 'num'],
        rows: []
      }
    }
  },

  watch: {
    firstSource(newProp) {
      this.leftData.rows = newProp
    },
    secondSource(newProp) {
      this.rightData.rows = newProp
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";

.slient-chart-card {
  border: 1px solid #ddd;
  border-radius: 5px;
  min-width: 700px;
  @include flexWidth();
}
.slient-chart-title {
  height: 49px;
  border-bottom: 1px solid #ddd;
  background: #f0f2f5;
  padding: 0 10px;
  @include flex();
  @include flexCenter(space-between);
  @include itemCenter(center);

  .slient-help {
    margin-left: 5px;
    color: #999;
    font-size: 12px;
  }
}
.slient-chart-content {
  height: 400px;
  @include flex();

  .slient-chart-left,
  .slient-chart-right {
    @include flexWidth();
  }
}
</style>
