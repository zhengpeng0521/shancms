<template>
  <div class="pic-box">
    <div
      v-for="(item,index) of data"
      :key="index"
      class="pic"
    >
      <div class="main">
        <div class="top">
          <img
            :src="item.icon"
            alt
          >
          <div class="createNum"><span>{{ item.amount }}</span>家机构已创建</div>
        </div>
        <div class="tit">{{ item.title }}</div>
        <div class="intro">{{ item.intro }}</div>
        <div class="main-bottom">
          <el-button
            type="primary"
            @click="picDetailBtn(item)"
          >创建</el-button>
        </div>
      </div>
    </div>
    <creatLeaflet
      v-if="creatLeafletShow"
      :visible.sync="creatLeafletShow"
    />
  </div>
</template>
<script>
// import { orgLeafletModelList } from '@/api/marketing/offlineLeaflet.js'
import creatLeaflet from './creatLeaflet'
// import PullTo from 'vue-pull-to'
export default {
  components: {
    creatLeaflet
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      picDetailShow: false,
      // loadmore组件参数
      // pageSize: 20,
      // pageIndex: 0,
      // // pageArr: [],
      // pageCount: 0,
      // textInfo: false,
      creatLeafletShow: false,
      obj: {}
    }
  },

  methods: {
    picDetailBtn(val) {
      this.obj = val
      // console.log(val, 'val')
      this.creatLeafletShow = true
    }

  }
}
</script>
<style lang='scss' scoped>
.pic-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding-left: 30px;
  background: rgb(240, 240, 244);
  // height: 500px;
  height: calc(100vh - 150px);
  // overflow: auto;
  // border: 1px solid #0f0;
}
.leads-bottom-text {
  text-align: center;
  color: #999;
  width: 100%;
  height: 20px;
}
.pic {
  position: relative;
  transition: all 1s;
  border-radius: 5px;
  text-align: left;
  margin-right: 25px;
  margin-bottom: 25px;
  .main {
    height: 300px;
    width: 200px;
    background: rgba(255, 255, 255, 1);
    border-radius: 5px;
    .top {
      width: 100%;
      height: 200px;
      position: relative;
      img {
        width: 100%;
        height: 100%;
      }
      .createNum {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 26px;
        background-color: rgba(0, 0, 0, 0.6);
        width: 100%;
        padding-left: 10px;
        color: white;
        font-size: 14px;
        line-height: 26px;
        span {
          color: #108ee9;
          font-size: 14px;
          line-height: 26px;
        }
      }
    }

    .tit {
      font-size: 14px;
      color: #666;
      text-align: left;
      padding: 5px 0px 0px 0px;
      overflow: hidden;
      white-space: nowrap;
      margin-right: 10px;
      margin-left: 10px;
      text-overflow: ellipsis;
    }
    .intro {
      font-size: 12px;
      color: #999;
      margin-left: 10px;
      margin-right: 10px;
      height: 18px;
      margin-bottom: 10px;
      overflow: hidden;
      margin-top: 5px;
    }
    .main-bottom {
      display: flex;
      justify-content: flex-end;
      margin-right: 10px;
    }

    .box span {
      margin-left: 10px;
      display: inline-block;
      line-height: 25px;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      font-size: 12px;
    }
  }
}
.pic:hover {
  box-shadow: 10px 10px 15px 0 #999;
}
</style>
