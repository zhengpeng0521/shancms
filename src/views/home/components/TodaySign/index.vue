/**
 * 今日签到
 */
<template>
  <el-card
    v-loading="loading"
    shadow="never"
    element-loading-text="拼命加载中"
  >
    <div class="sign-title">
      <h3>今日签到</h3>
      <span>更新时间: {{ signDate }}</span>
    </div>
    <div class="sign-content">
      <div class="sign-item sign-content-stu">
        <h3>立即签到</h3>
        <el-select
          v-model="stuId"
          :loading="selectLoading"
          filterable
          clearable
          placeholder="请选择学员"
          class="sign-stu-select"
          @change="(value) => {$emit('openClassPlan', value)}"
        >
          <el-option
            v-for="item in stuList"
            :key="item.stuId"
            :label="item.stuName"
            :value="item.stuId"
          />
        </el-select>
        <el-button
          type="primary"
          plain
          class="sign-btn"
          @click="showSign"
        >扫码签到</el-button>
        <SignBySelf
          v-if="isShow"
          ref="signBySelf"
        />
      </div>
      <div class="sign-item">
        <h3>上课签到</h3>
        <p><span>上课</span><span>{{ (signInfo.skrs || '0') + '人' }}</span></p>
        <p><span>预约</span><span>{{ (signInfo.skTotal || '0') + '人' }}</span></p>
        <p><span>请假</span><span>{{ (signInfo.qjrs || '0') + '人' }}</span></p>
        <p><span>旷课</span><span>{{ (signInfo.kkrs || '0') + '人' }}</span></p>
      </div>
      <div class="sign-item">
        <h3>补课签到</h3>
        <p><span>补课</span><span>{{ (signInfo.bkrs || '0') + '人' }}</span></p>
        <p><span>预约</span><span>{{ (signInfo.bkTotal || '0') + '人' }}</span></p>
        <p><span>请假</span><span>{{ (signInfo.bkqj || '0') + '人' }}</span></p>
        <p><span>旷课</span><span>{{ (signInfo.bkkk || '0') + '人' }}</span></p>
      </div>
      <div class="sign-item">
        <h3>试听签到</h3>
        <p><span>试听</span><span>{{ (signInfo.strs || '0') + '人' }}</span></p>
        <p><span>预约</span><span>{{ (signInfo.stTotal || '0') + '人' }}</span></p>
        <p><span>缺席</span><span>{{ (signInfo.stkk || '0') + '人' }}</span></p>
      </div>
    </div>
  </el-card>
</template>

<script>
import SignBySelf from './SignBySelf'

export default {
  components: {
    SignBySelf
  },

  props: {
    loading: {
      type: Boolean,
      required: true
    },
    selectLoading: {
      type: Boolean,
      required: true
    },
    signDate: {
      type: String,
      required: true
    },
    signInfo: {
      type: Object,
      required: true
    },
    stuList: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      stuId: '',
      isShow: false
    }
  },

  mounted() {
    this.$emit('didMount', 'sign')
  },

  methods: {
    showSign() {
      this.isShow = true
      this.$nextTick(() => {
        this.$refs.signBySelf.showSwitch()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";

.sign-title {
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

.sign-content {
  margin-top: 20px;
  @include flex;
  @include flexCenter(space-around);

  h3 {
    text-align: center;
    color: #333;
  }
}
.sign-item {
  width: 149px;
  height: 151px;

  &:not(:first-child) {
    border: 1px solid #ddd;
    border-top: 6px solid #46b6ee;
    border-radius: 8px;
    padding: 0 20px;

    h3 {
      margin: 24px 0 16px;
    }

    p {
      margin-bottom: 4px;
      @include flex;
      @include flexCenter(space-between);
      &:last-child {
        margin: 0;
      }
      span {
        color: #666;
        line-height: 14px;
      }
    }
  }
  &:nth-child(3) {
    border-top-color: #88c70a;
  }
  &:nth-child(4) {
    border-top-color: #ffb512;
  }
}

.sign-content-stu {
  padding: 0 10px;
  @include flex;
  @include boxCol;
  @include flexCenter(center);
  @include itemCenter(center);

  .sign-stu-select {
    margin: 10px 0 18px;
  }
  .sign-btn {
    background: #fff;
    color: #46b6ee;
    border-color: #46b6ee;
    &:hover {
      background: #46b6ee;
      color: #fff;
    }
  }
}
</style>
