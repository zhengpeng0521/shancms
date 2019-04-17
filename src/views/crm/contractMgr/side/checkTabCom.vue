<template>
  <div class="checkTabCom_container">
    <div class="checkTabCom_wrap">
      <p
        v-for="(item, index) of checkOrderList"
        :key="index + '_checkOrder'"
      >
        <span class="item_label">{{ index + 1 }}</span>
        <span class="item_label item_time">{{ item.createTime || '' }}</span>
        <span class="item_name">{{ item.operatorName || '' }}</span>
        <span class="item_name">{{ item.typeName || '' }}</span>
        <span class="item_name">{{ item.orderRemark || '' }}</span>
      </p>
    </div>
  </div>
</template>

<script>
import { queryOrderCheckRecord } from '@/api/crm/contract/contract.js'
export default {
  data() {
    return {
      checkOrderList: []
    }
  },
  methods: {
    getCheckTabList(purchaseId) {
      const params = {
        purchaseId: purchaseId
      }
      queryOrderCheckRecord(params).then(res => {
        if (res.data.errorCode === 0) {
          this.checkOrderList = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.checkTabCom_container {
  height: calc(100vh - 375px);
  overflow: auto;
  .checkTabCom_wrap {
    padding: 0 30px;
    p {
      font-size: 14px;
      line-height: 30px;
      .item_label {
        display: inline-block;
        text-align: right;
        margin-right: 10px;
        color: #999;
      }
      .item_name {
        color: #666;
        line-height: 30px;
        margin-right: 10px;
      }
    }
  }
}
</style>

