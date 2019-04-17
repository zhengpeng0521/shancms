<template>
  <div class="item">
    <h3 class="item-top">
      课程名称 : <span class="item-top-first">{{ item.courseName }}</span>
      预约时间 : <span>{{ item.auditionTime == null ? '--' : item.auditionTime + ' ~ ' + item.auditionEndTime || '--' }}</span>
    </h3>
    <div class="item-leads-content">
      <div>
        <img
          :src="item.headimgurl || 'https://img.ishanshan.com/gimg/img/e51c6060b326c9cf12ddb4f1c4e12443'"
          alt="头像"
          class="leads-pic"
        >
      </div>
      <div class="leads-right">
        <p class="leads-username">{{ item.stuName }}</p>
        <p>
          <span class="leads-item-label">试听状态 : </span>
          <span class="leads-item-value leads-item-left">
            <span v-if="!item.status">--</span>
            <StatusPoint
              v-else-if="item.status === '0'"
              :color="'#D0021B'"
              :text="'取消'"
            />
            <StatusPoint
              v-else-if="item.status === '1'"
              :color="'#5D9CEC'"
              :text="'已预约'"
            />
            <StatusPoint
              v-else-if="item.status === '2'"
              :color="'#88C70A'"
              :text="'已试听'"
            />
            <StatusPoint
              v-else-if="item.status === '3'"
              :color="'#D0021B'"
              :text="'旷课'"
            />
          </span>
        </p>
        <p class="leads-item-content">{{ item.remark }}</p>
        <div
          v-if="item.status != '0'"
          class="leads-btns"
        >
          <a @click="cancelListen(item)">取消</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import StatusPoint from '@/components/MiniCommon/StatusPoint'

export default {
  components: {
    StatusPoint
  },

  props: {
    item: {
      type: Object,
      required: true
    },
    cancelListen: {
      type: Function,
      required: true
    }
  },

  computed: {
    listenTime() {
      let time = moment(this.item.auditionTime).format('YYYY-MM-DD HH:mm') + '~'
      time += moment(this.item.auditionEndTime).format('HH:mm')
      return time
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
.item-top-first {
  margin-right: 10px;
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
.btn-text {
  margin-right: 20px;
}
</style>
