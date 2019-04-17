<template>
  <div>
    <FormSearch
      ref="formSearch"
      v-bind="formSearchProps"
      :loading="loading"
    />
    <div class="slient-student-chart">
      <div class="slient-student-box">
        <div class="slient-card">
          <div class="slient-card-title">
            <el-button
              type="primary"
              icon="el-icon-document"
              @click="() => {exportFile('noUse')}"
            >按查询结果导出</el-button>
          </div>
          <div
            v-loading="loading"
            element-loading-text="拼命加载中"
            class="slient-card-content"
          >
            <p class="slient-card-num">{{ stuNum }}</p>
            <p class="slient-card-text">选定时间内, 未消耗课时的学员</p>
            <div>
              <img
                class="slient-card-pic"
                src="https://img.ishanshan.com/gimg/img/3bcdde1747456a414161cf5fad246b12"
              >
            </div>
          </div>
        </div>
        <SlientStuChart
          :loading="loading"
          :first-source="orderStu"
          :second-source="studentList"
          :export-file="exportFile"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { fmtDateFormat } from '@/utils/dateFormat'
import FormSearch from '@/components/ReportForm/FormSearch'
import SlientStuChart from './SlientStuChart'
import { exportFile } from '@/utils/exportFile'

export default {
  components: {
    FormSearch,
    SlientStuChart
  },

  data() {
    return {
      formSearchProps: {
        searchHandle: this.makeForm
      }
    }
  },

  computed: {
    ...mapState('slientStu', [
      'loading',
      'searchValue',
      'stuNum',
      'orderStu',
      'studentList'
    ])
  },

  mounted() {
    const payload = {
      startDate: fmtDateFormat(this.$refs.formSearch.formSearch.date[0], 'yyyy-MM-dd'),
      endDate: fmtDateFormat(this.$refs.formSearch.formSearch.date[1], 'yyyy-MM-dd')
    }
    this.getSlience(payload)
  },

  methods: {
    ...mapActions('slientStu', [
      'getSlience'
    ]),

    /** 生成报表 */
    makeForm(values, extra) {
      const payload = {
        startDate: values.date[0],
        endDate: values.date[1]
      }
      this.getSlience(payload)
    },

    /** 导出 */
    exportFile(type) {
      const params = { ...this.searchValue }
      if (type === 'noUse') {
        if (this.stuNum > 0) {
          exportFile(`${window.REPORT_URL}/erp/stats/silenceCost/costExport`, params)
        } else {
          this.$message.error('暂无数据导出')
        }
      } else {
        if (this.orderStu[0].num > 0 || this.studentList[0].num > 0) {
          exportFile(`${window.REPORT_URL}/erp/stats/silenceCost/purExport`, params)
        } else {
          this.$message.error('暂无数据导出')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";

.slient-student-chart {
  height: calc(100vh - 145px);
  overflow: auto;
  padding-right: 10px;
  margin-right: -10px;
}
.slient-student-box {
  @include flex();
}
.slient-card {
  min-width: 410px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-right: 20px;

  .slient-card-title {
    height: 49px;
    border-bottom: 1px solid #ddd;
    background: #f0f2f5;
    padding: 0 10px;
    @include flex();
    @include flexCenter(flex-end);
    @include itemCenter(center);
  }

  .slient-card-content {
    height: 400px;
    @include flex();
    @include boxCol();
    @include flexCenter(center);
    @include itemCenter(center);

    .slient-card-pic {
      @include transition(transform 0.3s);
    }

    .slient-card-num {
      margin-bottom: 20px;
      height: 80px;
      line-height: 80px;
      font-size: 80px;
      color: #666;
    }

    .slient-card-text {
      margin-bottom: 30px;
      height: 18px;
      line-height: 18px;
      font-size: 18px;
      color: #999;
    }

    &:hover .slient-card-pic {
      @include transform(scale(1.1, 1.1));
    }
  }
}
</style>
