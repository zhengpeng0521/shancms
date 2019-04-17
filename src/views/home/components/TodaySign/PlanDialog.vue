<template>
  <el-dialog
    :visible.sync="visible"
    title="排课查询"
    width="600px"
  >
    <div class="plan-list">
      <ul v-if="planList.length > 0">
        <li
          v-for="(plan, index) in planList"
          :key="'plan'+index"
          class="plan-item"
          @click="$emit('openStuAttendance', plan)"
        >
          <div class="plan-item-box">
            <span>{{ plan.courseName || '佚名课程' }}</span>
            <div>
              <span>上课人数: </span>
              <span v-if="plan.maxAttNum === -1">{{ plan.num }}</span>
              <span
                v-else
                :style="{ color : '#ff7f75' }"
              >{{ plan.num + '/'+ plan.maxAttNum }}</span>
            </div>
            <div>
              <span>补课人数: </span>
              <span v-if="isNaN(parseFloat(plan.mulNum)) && isNaN(parseFloat(plan.maxMulNum))">--</span>
              <span v-else-if="plan.maxMulNum === -1">{{ plan.mulNum }}</span>
              <span
                v-else
                :style="{color: '#ff7f75'}"
              >{{ plan.mulNum + '/' + plan.maxMulNum }}</span>
            </div>
            <div>
              <span>试听人数: </span>
              <span v-if="isNaN(parseFloat(plan.tryNum)) && isNaN(parseFloat(plan.maxTryNum))">--</span>
              <span v-else-if="plan.maxTryNum === -1">{{ plan.tryNum }}</span>
              <span
                v-else
                :style="{color: '#ff7f75'}"
              >{{ plan.tryNum + '/' + plan.maxTryNum }}</span>
            </div>
          </div>
          <div class="plan-item-content">
            <p>
              <span>主教: </span>
              <span>{{ plan.mtNames }}</span>
            </p>
            <p>
              <span>校区: </span>
              <span>{{ plan.orgName }}</span>
            </p>
            <p>
              <span>教室: </span>
              <span>{{ plan.roomName }}</span>
            </p>
            <p>
              <span>上课时间: </span>
              <span>{{ plan.studyDate + ' ' + plan.startTime + '~' + plan.endTime }}</span>
            </p>
          </div>
        </li>
      </ul>
      <NullData
        v-else
        class="null-data"
      />
    </div>

    <span slot="footer">
      <el-button
        type="primary"
        @click="visible = false"
      >关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import NullData from '@/components/MiniCommon/NullData'

export default {
  components: {
    NullData
  },

  props: {
    loading: {
      type: Boolean,
      required: true
    },
    planList: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      visible: false
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";

.null-data {
  height: 400px;
}

.plan-list {
  min-height: 400px;
}
.plan-item {
  background: #f5f5f5;
  padding: 0 20px;
  margin-bottom: 10px;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 2px 2px #ddd;
  &:hover {
    opacity: 0.8;
  }
}
.plan-item-box {
  line-height: 40px;
  border-bottom: 1px solid #ddd;
  @include flex;
  @include flexCenter(space-between);
}
.plan-item-content {
  padding-top: 15px;
  @include flex;
  @include flexWrap;

  p {
    width: 50%;
    margin-bottom: 10px;

    &:nth-child(2n) {
      text-align: right;
    }
  }
}
</style>
