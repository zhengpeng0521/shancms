<template>
  <div class="item">
    <h3 class="item-top">跟进时间 : <span>{{ item.createTime }}</span></h3>
    <div class="item-leads-content">
      <div>
        <img
          :src="item.headimgurl || 'https://img.ishanshan.com/gimg/img/e51c6060b326c9cf12ddb4f1c4e12443'"
          alt="头像"
          class="leads-pic"
        >
      </div>
      <div class="leads-right">
        <p class="leads-username">{{ item.uname }}</p>
        <p>
          <span class="leads-item-label">跟进家长 : </span>
          <span class="leads-item-value leads-item-left">{{ item.parentName || '--' }}</span>
          <span class="leads-item-label">跟进方式 : </span>
          <span class="leads-item-value">{{ item.typeValue || '--' }}</span>
        </p>
        <p class="leads-item-content">{{ item.content }}</p>
        <div class="leads-btns">
          <a @click="openEdit">编辑</a>
          <Confirm
            :placement="'left'"
            :confirm="deleteItem"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Confirm from '@/components/MiniCommon/Confirm'

export default {
  components: {
    Confirm
  },

  props: {
    item: {
      type: Object,
      required: true
    },
    openEdit: {
      type: Function,
      required: true
    },
    deleteItem: {
      type: Function,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";

.item {
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 20px;
}
.item-top {
  border-bottom: 1px solid #ddd;
  background: #f4f6f8;
  padding: 0 20px;
  font-size: 14px;
  line-height: 32px;

  span {
    color: #333;
  }
}
.item-leads-content {
  padding: 20px;
  @include flex();
}
.leads-pic {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 16px;
  background: #ddd;
}
.leads-right {
  width: 100%;
}

.leads-username {
  font-size: 16px;
  color: #46b6ee;
  margin-bottom: 14px;
}
.leads-item-label {
  color: #999;
}
.leads-item-value {
  color: #666;
}
.leads-item-left {
  margin-right: 40px;
}
.leads-item-content {
  margin: 26px 0 20px;
}
.leads-btns {
  text-align: right;

  a {
    color: #46b6ee;

    &:first-child {
      margin-right: 20px;
    }
  }
}
</style>
