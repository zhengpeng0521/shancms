<template>
  <div>
    <div>
      <el-tabs
        v-model="activeName"
        tab-position="left"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-if="hasMenu('5040201')"
          label="周复制"
          name="week"
        >
          <WeekCopy ref="week" />
        </el-tab-pane>
        <el-tab-pane
          v-if="hasMenu('5040202')"
          label="
            日复制"
          name="day"
        >
          <DayCopy
            v-if="isShow"
            ref="day"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script src="./classCopyTable.js"></script>
<style lang="scss" scoped>
.el-tabs--left {
  height: calc(100vh - 148px) !important;
}
</style>
