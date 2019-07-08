<template>
  <div>
    <div class="print_set_container">
      <!-- <el-tabs
      v-model="activeTab"
      tab-position="left"
    >
      <el-tab-pane
        v-if="hasMenu('9030101')"
        label="签到打印"
        name="sign"
      >
        <signIn v-if="activeTab === 'sign'" />
      </el-tab-pane>
      <el-tab-pane
        v-if="hasMenu('9030102')"
        label="考勤打印"
        name="attendance"
      >
        <attend v-if="activeTab === 'attendance'" />
      </el-tab-pane>

    </el-tabs> -->
      <!-- 新版 产品需求 -->
      <h3 class="print_title">签到打印</h3>
      <signIn ref="signIn" />
      <h3
        class="print_title"
        style="margin-top:20px;"
      >考勤打印</h3>
      <attend ref="attence" />
    </div>

    <div class="btn_group">
      <el-button
        :loading="loading"
        type="primary"
        style="margin-right:10px;"
        @click="saveAll()"
      >保存</el-button>
      <Confirm
        :is-button="true"
        :loading="loading"
        :confirm="resetSign"
        text="还原默认设置并保存"
        content="确定还原默认？"
        btn-class="btn_reset"
      />
    </div>
  </div>
</template>
<script>
import signIn from './components/signIn'
import attend from './components/attendance'
import Confirm from '@/components/MiniCommon/Confirm'

export default {
  components: {
    signIn,
    attend,
    Confirm
  },
  data() {
    return {
      // activeTab: 'sign',
      loading: false
    }
  },

  methods: {
    /** 还原默认 */
    resetSign() {
      this.$refs.signIn.resetSign(this.$refs.attence.resetAttend)
    },
    /** 保存 */
    saveAll() {
      this.loading = true
      this.$refs.signIn.saveSign(this.$refs.attence.subAttend)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tabs--left {
  height: calc(100vh - 148px) !important;
}

.print_set_container {
  height: calc(100vh - 204px);
  overflow: auto;
}

.print_title {
  font-size: 20px;
  margin-bottom: 20px;
}

.btn_group /deep/ {
  display: flex;
  // justify-content: flex-end;
  padding: 20px;
  border-top: 1px solid #ddd;

  .btn_reset {
    margin-right: 10px;
  }
}
</style>
