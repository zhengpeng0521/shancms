/**
 * 销售概况
 */
<template>
  <el-card
    v-loading="loading"
    shadow="never"
    element-loading-text="拼命加载中"
  >
    <div class="sale-title">
      <h3>销售概况</h3>
      <span>更新时间: {{ saleDate }}</span>
    </div>
    <div class="sale-content">
      <div class="sale-funnel">
        <div class="sale-funnel-box">
          <div
            v-for="(item, index) in saleFunnel"
            :key="'funnel' + index"
            class="sale-funnel-flex"
          >
            <div class="sale-funnel-one">{{ item.rate || '0%' }}</div>
            <div class="sale-funnel-line" />
            <div>
              <el-tooltip
                effect="dark"
                placement="right"
              >
                <div slot="content">{{ item.name || '未跟进' }}</div>
                <span class="funnel-tip-text">{{ item.name || '未跟进' }}</span>
              </el-tooltip>
              <span>{{ item.num || '0' }}人</span>
            </div>
          </div>
        </div>
      </div>
      <div class="sale-line home-sale-line">
        <el-select
          v-model="reqType"
          placeholder="请选择"
          class="sale-line-date"
          @change="(value) => {$emit('tabChange', {dataType: activeName === 'potential' ? '1' : '2', reqType: value})}"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-tabs
          v-model="activeName"
          @tab-click="(tab) => {$emit('tabChange', {dataType: tab.name === 'potential' ? '1' : '2', reqType})}"
        >
          <el-tab-pane
            label="新增潜在学员"
            name="potential"
          >
            <ChartCard
              v-if="activeName === 'potential'"
              v-bind="lineProps"
              :loading="loading"
              :data-source="saleLine"
              :is-card="false"
            />
          </el-tab-pane>
          <el-tab-pane
            label="新增在读学员"
            name="student"
          >
            <ChartCard
              v-if="activeName === 'student'"
              v-bind="lineProps"
              :loading="loading"
              :data-source="saleLine"
              :is-card="false"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </el-card>
</template>

<script>
import ChartCard from '@/components/ReportForm/ChartCard'

export default {
  components: {
    ChartCard
  },

  props: {
    loading: {
      type: Boolean,
      required: true
    },
    saleDate: {
      type: String,
      required: true
    },
    saleFunnel: {
      type: Array,
      required: true
    },
    saleLine: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      activeName: 'potential',
      lineProps: {
        type: 'line',
        legend: false,
        height: '200px',
        hasTitle: false,
        allCols: [
          { key: 'num', value: '学员数' }
        ],
        showCols: ['date', 'num']
      },
      options: [{ value: '1', label: '近半月' }, { value: '2', label: '近半年' }],
      reqType: '1'
    }
  },

  mounted() {
    this.$emit('didMount', 'sale')
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";

.sale-title {
  @include flex;
  @include flexCenter(space-between);

  h3 {
    font-size: 16px;
    line-height: 24px;
    color: #333;
  }
  span {
    color: #999;
    font-size: 12px;
    line-height: 24px;
  }
}

.sale-content {
  margin-top: 20px;
  @include flex;
}

// -------------------漏斗start-----------------
.sale-funnel {
  width: 40%;
  @include flex;
  @include flexCenter(center);
  @include itemCenter(center);
}
.sale-funnel-box {
  width: 250px;
}

.sale-funnel-flex {
  @include flex;
  @include itemCenter(center);

  div:first-child {
    line-height: 24px;
    text-align: center;
    color: #fff;
    position: relative;

    &:before {
      content: "";
      position: absolute;
      bottom: -8px;
      left: -22px;
      display: block;
      width: 28px;
      height: 28px;
      background: #fff;
      @include transform(rotate(70deg));
    }
    &:after {
      content: "";
      position: absolute;
      bottom: -8px;
      right: -22px;
      display: block;
      width: 28px;
      height: 28px;
      background: #fff;
      @include transform(rotate(20deg));
    }
  }

  // 漏斗线
  div:nth-child(2) {
    width: 9px;
    height: 1.6px;
    background: linear-gradient(0, rgba(130, 82, 219, 0.6), #8252db);
    z-index: 9;
  }

  div:last-child {
    z-index: 9;
    margin-left: 4px;

    span {
      margin-left: 4px;
      vertical-align: middle;
    }
  }

  .funnel-tip-text {
    display: inline-block;
    max-width: 56px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #999;
  }

  // 漏斗1
  &:first-child {
    .sale-funnel-one {
      width: 140px;
      border-radius: 6px;
      background: linear-gradient(
        180deg,
        rgb(130, 82, 219) 0%,
        rgba(130, 82, 219, 0.6) 100%
      );

      &:before {
        content: "";
        position: absolute;
        bottom: -5px;
        left: -14px;
        display: block;
        width: 18px;
        height: 18px;
        background: #fff;
        @include transform(rotate(70deg));
      }
      &:after {
        content: "";
        position: absolute;
        bottom: -5px;
        right: -14px;
        display: block;
        width: 18px;
        height: 18px;
        background: #fff;
        @include transform(rotate(20deg));
      }
    }
  }

  // 漏斗2
  &:nth-child(2) {
    margin-top: 2px;
    .sale-funnel-one {
      width: 126px;
      margin: 0 7px;
      background: linear-gradient(
        180deg,
        rgb(63, 138, 232) 0%,
        rgba(63, 138, 232, 0.6) 100%
      );
    }
    .sale-funnel-line {
      width: 17px;
      margin-left: -9px;
      background: linear-gradient(0, rgba(63, 138, 232, 0.6), #3f8ae8);
    }
  }

  // 漏斗3
  &:nth-child(3) {
    margin-top: 2px;
    .sale-funnel-one {
      width: 108px;
      margin: 0 16px;
      background: linear-gradient(
        180deg,
        rgb(78, 176, 217) 0%,
        rgba(78, 176, 217, 0.6) 100%
      );
    }
    .sale-funnel-line {
      width: 27px;
      margin-left: -18px;
      background: linear-gradient(0, rgba(78, 176, 217, 0.6), #4eb0d9);
    }
  }

  // 漏斗4
  &:nth-child(4) {
    margin-top: 2px;
    .sale-funnel-one {
      width: 90px;
      margin: 0 25px;
      background: linear-gradient(
        180deg,
        rgb(100, 194, 162) 0%,
        rgba(100, 194, 162, 0.6) 100%
      );
    }
    .sale-funnel-line {
      width: 35px;
      margin-left: -26px;
      background: linear-gradient(0, rgba(100, 194, 162, 0.6), #64c2a2);
    }
  }

  // 漏斗5
  &:nth-child(5) {
    margin-top: 2px;
    .sale-funnel-one {
      width: 70px;
      margin: 0 35px;
      background: linear-gradient(
        180deg,
        rgb(234, 212, 59) 0%,
        rgba(234, 212, 59, 0.6) 100%
      );
    }
    .sale-funnel-line {
      width: 44px;
      margin-left: -36px;
      background: linear-gradient(0, rgba(234, 212, 59, 0.6), #ead43b);
    }
  }

  // 漏斗6
  &:nth-child(6) {
    margin-top: 2px;
    .sale-funnel-one {
      width: 52px;
      margin: 0 44px;
      background: linear-gradient(
        180deg,
        rgb(239, 160, 58) 0%,
        rgba(239, 160, 58, 0.6) 100%
      );
    }
    .sale-funnel-line {
      width: 53px;
      margin-left: -46px;
      background: linear-gradient(0, rgba(239, 160, 58, 0.6), #efa03a);
    }
  }

  // 漏斗7
  &:nth-child(7) {
    margin-top: 2px;
    .sale-funnel-one {
      width: 35px;
      margin: 0 52px;
      border-radius: 0px 0px 5px 5px;
      background: linear-gradient(
        180deg,
        rgb(228, 83, 60) 0%,
        rgba(228, 83, 60, 0.6) 100%
      );
      &:before,
      &:after {
        display: none;
      }
    }
    .sale-funnel-line {
      width: 56px;
      margin-left: -48px;
      background: linear-gradient(0, rgba(228, 83, 60, 0.6), #e4533c);
    }
  }

  // 漏斗最后一个
  // &:last-child .sale-funnel-one {
  //   border-radius: 0px 0px 5px 5px;
  //   &:before,
  //   &:after {
  //     display: none;
  //   }
  // }
}
// -------------------漏斗end-----------------

// -------------------曲线start-----------------
.sale-line {
  @include flexWidth;
  margin-left: 20px;
  position: relative;
}
.sale-line-date {
  position: absolute;
  right: 0;
  top: 4px;
  width: 100px;
  z-index: 999;
}
// -------------------曲线end-----------------
</style>

<style lang="scss">
.home-sale-line {
  .el-tabs__nav-scroll {
    border: none;
    padding: 0;
  }
  .el-tabs__nav-wrap::after {
    display: none;
  }
  .el-tabs__item {
    width: 80px;
  }
  .el-tabs__active-bar {
    margin: 0 20px;
  }
  .el-tabs__content {
    padding: 0;
  }
}
</style>
