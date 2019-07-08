/**
 * 运营妙计
 */
<template>
  <el-card
    v-loading="loading"
    shadow="never"
    element-loading-text="拼命加载中"
  >
    <div class="case-title">
      <h3>运营妙计</h3>
    </div>
    <div class="case-content">
      <!-- <a
        v-if="caseList.length > 0"
        :href="caseList[0].link"
        target="_blank"
        class="case-content-left"
      >
        <img :src="caseList[0].img">
        <div class="case-left-text">
          <p>{{ caseList[0].content }}</p>
        </div>
      </a>
      <a v-else>暂无数据</a>
      <ul class="case-content-list">
        <li
          v-for="(item, index) in caseSecond"
          :key="'case'+index"
          class="case-content-item"
        >
          <i class="case-circle" />
          <a
            :href="item.link"
            target="_blank"
          >{{ item.content }}</a>
        </li>
      </ul> -->
      <ul class="case-list">
        <li
          v-for="(item, index) in caseList"
          :key="'operating'+index"
        >
          <a
            v-log="{compName:'运营妙计',eventName:`${item.content||''}`}"
            :href="item.link"
            target="_blank"
          >
            <img :src="item.img">
            <p>{{ item.content }}</p>
          </a>
        </li>
      </ul>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      required: true
    },
    caseList: {
      type: Array,
      required: true
    }
  },

  data() {
    return {

    }
  },

  computed: {
    caseSecond() {
      if (this.caseList.length > 1) {
        return this.caseList.slice(1)
      }
    }
  },

  mounted() {
    this.$emit('didMount', 'case')
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";

.case-title {
  margin-bottom: 20px;
  h3 {
    font-size: 16px;
    line-height: 24px;
    color: #333;
  }
}

.case-content {
  @include flex;
}

.case-list li {
  margin-top: 20px;
  &:first-child {
    margin: 0;
  }

  a {
    display: flex;
    align-items: center;
    cursor: pointer;

    img {
      flex-basis: 60px;
      width: 60px;
      height: 60px;
    }

    p {
      flex: 1;
      line-height: 22px;
      margin-left: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    &:hover p {
      color: #46b6ee;
    }
  }
}
// .case-content-left {
//   display: block;
//   width: 122px;
//   height: 187px;
//   background: rgba(240, 242, 245, 0.6);

//   img {
//     width: 122px;
//     height: 122px;
//   }

//   .case-left-text {
//     padding: 12px 10px;
//   }
//   p {
//     line-height: 20px;
//     display: -webkit-box;
//     -webkit-box-orient: vertical;
//     -webkit-line-clamp: 2;
//     overflow: hidden;
//   }

//   &:hover p {
//     color: #46b6ee;
//   }
// }

// .case-content-list {
//   margin-left: 20px;
//   width: calc(100% - 142px);
// }
// .case-content-item {
//   margin-top: 8px;
//   width: 100%;
//   overflow: hidden;
//   white-space: nowrap;
//   text-overflow: ellipsis;

//   &:first-child {
//     margin: 0;
//   }

//   .case-circle {
//     display: inline-block;
//     width: 4px;
//     height: 4px;
//     background: #46b6ee;
//     border-radius: 50%;
//     vertical-align: middle;
//     margin-right: 5px;
//   }

//   &:hover {
//     a {
//       color: #46b6ee;
//     }
//   }
// }
</style>
