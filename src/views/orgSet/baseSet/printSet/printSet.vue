<template>
  <div>
    <el-tabs
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

    </el-tabs>
  </div>
</template>
<script>

import signIn from './components/signIn'
import attend from './components/attendance'
export default {
  components: {
    signIn,
    attend
  },
  data() {
    return {
      activeTab: 'sign'
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tabs--left {
  height: calc(100vh - 148px) !important;
}
</style>
