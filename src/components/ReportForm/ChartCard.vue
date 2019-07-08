/**
 * 图表卡片组件
 * props
 *   type        Str        图表类型 值:'line' 线图/'histogram' 柱形/'bar' 横向柱形/'pie' 饼图
 *   legend      Bool       是否显示默认图例
 *   custLegend  Bool       是否显示自定义图例（当legend为false）
 *   title       Str        标题, 默认'图表'
 *   extraTitle  Str        标题额外内容
 *   isCard      Bool       是否卡片
 *   exportFile  Func       导出
 *   allCols     Arr        所有的cols，例子：[{key: 'date', value: '日期'}]
 *   showCols    Arr        展示的cols  例子：['date', 'pv']第一个必须是x轴参数
 *   dataSource  Arr        数据源
 *   loading     Bool       加载状态
 *   stack       Obj        柱形图堆叠
 *   formatter   Func       格式化浮层
 **/
<template>
  <div :class="card.container">
    <div
      v-if="hasTitle"
      :class="card.header"
    >
      <h3>{{ title }}<span
        v-if="extraTitle"
        class="chart-extra-title"
      >({{ extraTitle }})</span></h3>
      <el-button
        v-if="!!exportFile"
        type="primary"
        icon="el-icon-document"
        class="report-export"
        @click="exportFile"
      >按查询结果导出</el-button>
    </div>

    <div
      v-loading="loading"
      element-loading-text="拼命加载中"
    >
      <div
        v-if="dataSource && dataSource.length > 0"
        class="chart-box"
      >
        <div class="chart-left">
          <CustChart
            :legend="legend"
            :cust-legend="custLegend"
            :type="type"
            :all-cols="allCols"
            :show-cols="showCols"
            :data-source="dataSource"
            :formatter="formatter"
            :show-source="showSource"
            :show-lines="showLines"
            :show-colors="showColors"
            :stack="stack"
            :height="height"
            :has-title="hasTitle"
          />
        </div>
        <!-- 折线或者堆叠柱形自定义 -->
        <div
          v-if="!legend && allCols && custLegend && (type === 'line' || stack)"
          class="chart-right"
        >
          <el-checkbox-group
            v-model="showLines"
            :min="2"
            @change="colsChange"
          >
            <ul class="chart-list">
              <li
                v-for="(item, index) in allCols"
                :key="'chart'+index"
              >
                <el-checkbox :label="item.key">
                  <el-popover
                    popper-class="legend-pop"
                    placement="top"
                    trigger="hover"
                  >
                    <div class="pop-content">{{ item.value }}</div>
                    <span
                      slot="reference"
                      class="legend-item"
                    >{{ item.value }}</span>
                  </el-popover>
                  <i
                    :style="{background: allColors[index]}"
                    class="legend-circle"
                  />
                </el-checkbox>
              </li>
            </ul>
          </el-checkbox-group>
        </div>
        <!-- 柱形自定义 -->
        <div
          v-else-if="!legend && allCols && custLegend && type === 'histogram'"
          class="chart-right"
        >
          <el-checkbox-group
            v-model="showBars"
            :min="1"
            @change="barsChange"
          >
            <ul class="chart-list">
              <li
                v-for="(item, index) in dataSource"
                :key="'histogram_'+index"
              >
                <el-checkbox :label="item.courseName">
                  <el-popover
                    popper-class="legend-pop"
                    placement="top"
                    trigger="hover"
                  >
                    <div class="pop-content">{{ item.courseName }}</div>
                    <span
                      slot="reference"
                      class="legend-item"
                    >{{ item.courseName }}</span>
                  </el-popover>
                  <i
                    :style="{background: allColors[0]}"
                    class="legend-circle"
                  />
                </el-checkbox>
              </li>
            </ul>
          </el-checkbox-group>
        </div>
      </div>
      <div
        v-else
        :style="{height}"
        class="data-empty"
      >
        <img src="https://img.ishanshan.com/gimg/user/n///1551164927.png">
        <span>暂无数据</span>
      </div>
    </div>
  </div>
</template>

<script>
import colors from './formColor'
import CustChart from './CustChart/CustChart'

export default {
  components: {
    CustChart
  },

  props: {
    type: {
      type: String,
      required: true
    },
    legend: {
      type: Boolean,
      default: true
    },
    custLegend: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '图表'
    },
    extraTitle: {
      type: String,
      default: undefined
    },
    isCard: {
      type: Boolean,
      default: true
    },
    exportFile: {
      type: Function,
      default: undefined
    },
    allCols: {
      type: Array,
      required: true
    },
    showCols: {
      type: Array,
      required: true
    },
    dataSource: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    },
    formatter: {
      type: Function,
      default: undefined
    },
    stack: {
      type: Object,
      default: undefined
    },
    height: {
      type: String,
      default: '400px'
    },
    hasTitle: {
      type: Boolean,
      default: true
    }
  },

  data() {
    const { isCard } = this.$props
    return {
      card: isCard ? {
        container: 'card-contariner',
        header: 'card-header'
      } : {}, // 卡片形式
      showBars: [], // 柱形自定义图例显示
      showSource: [], // 柱形堆叠数据
      allColors: colors, // 颜色列表
      isInit: true, // 是否首次加载
      isCols: true,
      showLines: [], // 展示的数据
      showColors: colors
    }
  },

  watch: {
    loading(newProp) {
      if (newProp) {
        this.isInit = true
        this.isCols = true
      }
    },
    // 柱形默认显示
    dataSource(newArr) {
      if (this.isInit) {
        const showBars = []
        newArr.forEach((item, index) => {
          if (index < 10) {
            showBars.push(item.courseName)
          }
        })
        this.showBars = showBars
        this.isInit = false
      }
      this.showColors = colors
    },
    // 折线默认显示
    showCols(newArr) {
      if (this.isCols) {
        const showLines = []
        if (this.type === 'line') {
          newArr.forEach((item, index) => {
            if (index < 6) {
              showLines.push(item)
            }
          })
        } else if (this.type === 'histogram' && this.stack) {
          newArr.forEach((item, index) => {
            if (index < 11) {
              showLines.push(item)
            }
          })
        }

        this.showLines = showLines
        this.isCols = false
      }
    }
  },

  methods: {
    /** 图例选择 */
    colsChange(value) {
      const { allCols, showCols } = this.$props
      const newShow = [showCols[0]]
      const newColors = []
      allCols && allCols.forEach((col, index) => {
        value.forEach((item) => {
          if (col.key === item) {
            newShow.push(item)
            newColors.push(colors[index])
          }
        })
      })

      this.showLines = newShow
      this.showColors = newColors
    },
    /** 柱形 */
    barsChange(value) {
      const newShow = []
      this.dataSource.forEach((item) => {
        value.forEach((child) => {
          if (item.courseName === child) {
            newShow.push(item)
          }
        })
      })
      this.showSource = newShow
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";

// ----------- 空数据 start -------------------------
.data-empty {
  height: 400px;
  @include flex;
  @include boxCol();
  @include flexCenter(center);
  @include itemCenter(center);
  color: #888;
  font-size: 14px;
  span {
    margin-top: 10px;
  }
}
// ----------- 空数据 end -------------------------

// ----------- 卡片 start -------------------------
.card-contariner {
  border: 1px solid #ddd;
  border-radius: 5px;
  .card-header {
    height: 49px;
    border-bottom: 1px solid #ddd;
    background: #f0f2f5;
    position: relative;
    h3 {
      line-height: 49px;
      padding-left: 10px;
    }
    .report-export {
      position: absolute;
      right: 10px;
      top: 11px;
    }
  }
  // 自定义图例
  .chart-list {
    margin: 20px 15px 0 0;
    padding: 15px;
    border-radius: 5px;
    border: 1px solid #ddd;
    max-height: 340px;
    overflow: auto;
    li {
      margin-top: 10px;
      &:first-child {
        margin: 0;
      }
    }
  }
  .legend-circle {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
}
// ----------- 空数据 end -------------------------

// ----------- 图表 start -------------------------
.chart-box {
  @include flex;
  .chart-left {
    @include flexWidth;
  }
  .chart-right {
    flex-basis: 180px;
  }
}
// ----------- 图表 end -------------------------

.pop-content {
  max-width: 150px;
}
.legend-item {
  display: inline-block;
  max-width: 90px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
}
.chart-extra-title {
  color: #999;
  margin-left: 5px;
  font-size: 12px;
}
</style>

<style lang="scss">
.legend-pop {
  min-width: 50px !important;
}
</style>
