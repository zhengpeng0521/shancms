<template>
  <div>
    <el-tabs
      v-model="activeName"
      tab-position="left"
      @tab-click="handleClick"
    >
      <el-tab-pane
        v-if="hasMenu('4100201')"
        label="进货"
        name="first"
      >
        <StockComponent v-if="activeName === 'first'" />
      </el-tab-pane>
      <el-tab-pane
        v-if="hasMenu('4100202')"
        label="退货"
        name="second"
      >
        <ReturnComponent v-if="activeName === 'second'" />
      </el-tab-pane>
      <el-tab-pane
        v-if="hasMenu('4100203')"
        label="报损"
        name="third"
      >
        <BreakageComponent v-if="activeName === 'third'" />
      </el-tab-pane>
      <el-tab-pane
        v-if="hasMenu('4100204')"
        label="领用"
        name="fourth"
      >
        <ReceiveComponent v-if="activeName === 'fourth'" />
      </el-tab-pane>
      <el-tab-pane
        v-if="hasMenu('4100205')"
        label="退领"
        name="five"
      >
        <BackComponent v-if="activeName === 'five'" />
      </el-tab-pane>
      <el-tab-pane
        v-if="hasMenu('4100206')"
        label="库存调整"
        name="six"
      >
        <AdjustmentComponent v-if="activeName === 'six'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import StockComponent from './components/stockCom/stockComponent.vue'
import ReturnComponent from './components/returnCom/returnComponent.vue'
import BreakageComponent from './components/breakageCom/breakageComponent.vue'
import ReceiveComponent from './components/receiveCom/receiveComponent.vue'
import BackComponent from './components/backCom/backComponent.vue'
import AdjustmentComponent from './components/adjustmentCom/adjustmentComponent.vue'
export default {
  components: {
    StockComponent, // 进货页面组件
    ReturnComponent, // 退货页面组件
    BreakageComponent, // 报损页面组件
    ReceiveComponent, // 领用页面组件
    BackComponent, // 退领页面组件
    AdjustmentComponent // 调整库存页面组件
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tabs--left {
  height: calc(100vh - 148px) !important;
}
</style>

