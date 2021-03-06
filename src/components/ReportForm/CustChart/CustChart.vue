/**
 * 自定义图表组件
 *
 */
<template>
  <div style="width:100%;">
    <!-- 饼 -->
    <ve-pie
      v-if="type === 'pie'"
      :data="chartData"
      :colors="showColors"
      :extend="pieExtend"
    />
    <!-- 横条 -->
    <ve-bar
      v-else-if="type === 'bar'"
      :data="chartData"
      :settings="chartSettings"
      :extend="barExtend"
      :grid="{right: '10%', left: '5%'}"
    />
    <ve-chart
      v-else
      ref="chart"
      :data="chartData"
      :settings="chartSettings"
      :colors="showColors"
      :y-axis="yAxis"
      :tooltip="custTool"
      :extend="chartExtend"
      :grid="hasTitle ? {right: '5%'} : {top: 20, bottom: 20, right: '10%'}"
      :after-config="afterConfig"
      :height="height"
    />

  </div>
</template>

<script>
export default {
  props: {
    // 图表类型
    type: {
      type: String,
      required: true
    },
    // 图表图例
    legend: {
      type: Boolean,
      default: true
    },
    // 是否自定义图例
    custLegend: {
      type: Boolean,
      default: false
    },
    // 所有图例
    allCols: {
      type: Array,
      required: true
    },
    // 当前勾选图例
    showCols: {
      type: Array,
      required: true
    },
    // 图表数据
    dataSource: {
      type: Array,
      required: true
    },
    // 柱形堆叠图数据
    showSource: {
      type: Array,
      default: () => []
    },
    // 自定义图例时显示的曲线或者柱形
    showLines: {
      type: Array,
      default: () => []
    },
    // 显示的颜色
    showColors: {
      type: Array,
      required: true
    },
    // 自定义提示框
    formatter: {
      type: Function,
      default: undefined
    },
    // 柱形图堆叠
    stack: {
      type: Object,
      default: undefined
    },
    // 高度
    height: {
      type: String,
      default: '400px'
    },
    // 是否有标题
    hasTitle: {
      type: Boolean,
      required: true
    }
  },

  data() {
    const { legend, type, allCols, showCols, dataSource, formatter, stack } = this.$props

    const labelMap = {}
    const that = this
    // 图表继承
    this.chartExtend = {
      xAxis(v) {
        v && v.forEach(i => {
          // 坐标轴刻度标签的显示间隔
          // i.axisLabel = {
          //   interval: 1
          // }
          i.boundaryGap = type === 'histogram'
          i.axisLine = {
            show: true
          }
          i.splitLine = {
            show: true,
            lineStyle: {
              type: 'dashed'
            }
          }
          if (type === 'histogram') {
            i.axisPointer = {
              type: 'shadow'
            }
          }
        })
        return v
      },
      // 图例
      legend(v) {
        v.show = legend
        v.selectedMode = !legend
        v.top = legend ? '5%' : 'auto'
        v.right = '5%'
        return v
      },
      // 针对柱形图
      series(v) {
        v && v.forEach(i => {
          i.barMaxWidth = 50
          if (stack) {
            i.stack = stack
          }
        })
        return v
      }
    }
    // 饼图
    this.pieExtend = {
      series(v) {
        v && v.forEach(i => {
          // 标签
          i.label = {
            formatter: that.pieLabel,
            color: '#666'
          }
        })
        return v
      },
      // 图例
      legend(v) {
        v.selectedMode = false
        v.top = '5%'

        return v
      },
      tooltip(v) {
        v.confine = true
        v.backgroundColor = '#fff'
        v.borderColor = '#eee'
        v.borderWidth = 1
        v.textStyle = {
          color: '#666'
        }
        v.extraCssText = 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);'
        return v
      }
    }

    // 横条
    this.barExtend = {
      xAxis(v) {
        v && v.forEach(i => {
          i.splitLine = {
            show: true,
            lineStyle: {
              type: 'dashed'
            }
          }
        })
        return v
      },
      yAxis(v) {
        v && v.forEach(i => {
          i.axisLine = {
            show: true
          }
          i.axisPointer = {
            type: 'shadow'
          }
        })
        return v
      },
      legend(v) {
        v.show = false
        return v
      },
      series(v) {
        v && v.forEach(i => {
          i.barMaxWidth = 50
          i.label = {
            show: true,
            position: 'right'
          }
        })
        return v
      },
      tooltip(v) {
        v.backgroundColor = '#fff'
        v.borderWidth = 1
        v.borderColor = '#eee'
        v.extraCssText = 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);'
        v.textStyle = {
          color: '#666'
        }
        if (formatter && type === 'bar') {
          v.formatter = formatter
        }

        return v
      }
    }

    // 图表设置
    allCols && allCols.forEach((col) => {
      labelMap[col.key] = col.value
    })
    this.chartSettings = {
      type,
      labelMap
    }

    return {
      yAxis: {
        axisLine: {
          show: true
        },
        axisTick: { show: false },
        splitLine: {
          lineStyle: { type: 'dashed' }
        }
      },
      // 自定义提示框
      custTool: {
        enterable: true, // 可操作框内
        confine: true, // 框限制在图表的区域内
        position: (point) => { // 框位置
          point[0] += 5
          point[1] += 5
          return point
        },
        trigger: 'axis',
        backgroundColor: '#fff',
        borderColor: '#eee',
        borderWidth: 1,
        textStyle: {
          color: '#666'
        },
        extraCssText: 'max-height:350px;overflow:auto;',
        formatter: this.formatter
      },
      chartData: {
        columns: showCols,
        rows: dataSource
      }
    }
  },

  watch: {
    showSource(newProp) {
      if (this.type === 'histogram' && !this.stack) {
        this.chartData.rows = newProp
      }
    },
    showLines(newProp) {
      if (this.type === 'line' || (this.type === 'histogram' && this.stack)) {
        this.chartData.columns = newProp
      }
    },
    dataSource(newProp) {
      this.chartData.rows = newProp
      const newData = []
      if (this.type === 'histogram' && this.custLegend && !this.stack) {
        this.dataSource.forEach((item, index) => {
          if (index < 10) {
            newData.push(item)
          }
        })
        this.chartData.rows = newData
      }
    },
    allCols(newCol) {
      const labelMap = []
      newCol && newCol.forEach((col) => {
        labelMap[col.key] = col.value
      })
      this.chartSettings.labelMap = labelMap
    },
    showCols(newCol) {
      if (this.type === 'histogram' && !this.custLegend) {
        this.chartData.columns = newCol
      }
    }
  },

  mounted() {
    const newData = []
    if (this.type === 'histogram' && this.custLegend && !this.stack) {
      this.dataSource.forEach((item, index) => {
        if (index < 10) {
          newData.push(item)
        }
      })
      this.chartData.rows = newData
    } else if ((this.type === 'line' || (this.type === 'histogram' && this.stack)) && this.custLegend) {
      this.chartData.columns = this.showLines
    }
    // 解决容器宽度初始化未获取问题
    if (this.type !== 'pie' && this.type !== 'bar') {
      this.$nextTick(() => {
        this.$refs.chart.echarts.resize()
      })
    }
  },

  methods: {
    /** 对生成好的echarts配置进行额外的处理 */
    afterConfig(options) {
      options.legend.show = this.legend
      options.legend.selectedMode = !this.legend
      options.legend.top = this.legend ? '5%' : 'auto'

      return options
    },

    /** 饼图label显示 */
    pieLabel(params) {
      return `${params.name}: ${params.value} (${params.percent}%)`
    }
  }
}
</script>
