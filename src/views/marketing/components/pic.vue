<template>
  <div class="pic-box">
    <div
      v-if="data.length>0"
      class="picBoxCont"
    >
      <div
        v-for="(item,index) of data"
        :key="index"
        class="pic"
      >
        <div
          v-if="index<4"
          class="hotIcon"
        >
          <img
            src="https://img.ishanshan.com/gimg/n/20181008/b98bf7b1365be8676ec3985c0691add8"
            alt=""
          >
        </div>
        <div class="zhezhao">
          <div
            v-if="item.previewurl"
            class="erweimaBox"
          >
            <qrcode
              :value="item.previewurl"
              :options="{ width: 132,height:132,margin:0 }"
              class="erweima"
            />
          </div>
        </div>
        <div class="main">
          <img
            :src="item.icon"
            alt
          >
          <div class="tit">{{ item.title }}</div>
          <div class="main-bottom">
            <div class="box">
              <svg-icon
                icon-class="icon_sy_ck"
                style="color:#999;font-size:26px;padding-top:6px"
              />
              <span>{{ item.virtualViews }}</span>
            </div>
            <el-button
              type="primary"
              @click="picDetailBtn(item)"
            >创建</el-button>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="data.length === 0"
      class="picBoxCont"
    >
      <div class="zhanwei">
        <img
          style="width:51px;height:51px;"
          src="https://img.ishanshan.com/gimg/n/20190327/88826c90471a228009be72f913981612"
          alt=""
        >
        <p>抱歉 没有符合相应条件的模板</p>
      </div>
    </div>
    <PicDetail
      v-if="picDetailShow"
      :visible.sync="picDetailShow"
    />

  </div>
</template>
<script>
import Vue from 'vue'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import PicDetail from './picDetail'

Vue.component(VueQrcode.name, VueQrcode)
export default {
  components: {
    PicDetail
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
      obj: {}
    }
  },
  methods: {
    picDetailBtn(val) {
      // console.log(val, '111')
      this.obj = val
      this.picDetailShow = true
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
  background: rgba(240, 242, 245, 0.8);
  // height: calc(100vh - 430px);
}
.picBoxCont {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  min-height: calc(100vh - 100px);
  width: 100%;
  // padding-left: 30px;
  // background: rgb(240, 240, 244);
  .zhanwei {
    height: 200px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 5px;
    p {
      font-size: 14px;
      line-height: 14px;
      color: #666;
      margin-top: 10px;
    }
  }
}
.pic {
  height: 306px;
  min-width: 240px;
  // border: 1px solid #f00;
  // width: 22%;
  padding: 10px;
  position: relative;
  transition: all 1s;
  border-radius: 5px;
  text-align: left;
  background: rgba(255, 255, 255, 1);
  margin: 15px 15px;
  .hotIcon {
    width: 39px;
    height: 28px;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1000;
    img {
      width: 100%;
    }
  }
  .zhezhao {
    width: 220px;
    height: 220px;
    position: absolute;
    background: rgba(0, 0, 0, 0);
    transition: background 1s;
    display: flex;
    justify-content: center;
    align-items: center;
    .erweimaBox {
      width: 140px;
      height: 140px;
      padding: 4px;
      background: #fff;
      opacity: 0;
      transition: opacity 1s;
    }
    .erweima {
      opacity: 0;
      transition: opacity 1s;
    }
  }

  .main {
    img {
      width: 220px;
      height: 220px;
    }

    .tit {
      font-size: 14px;
      text-align: left;
      padding: 15px 0px 5px 0px;
      white-space: nowrap;
      margin-right: 10px;
      margin-left: 10px;
    }

    .main-bottom {
      display: flex;
      justify-content: space-between;
    }

    .box span {
      margin-left: 3px;
      display: inline-block;
      line-height: 25px;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      font-size: 12px;
    }
  }
}

.pic:hover .zhezhao {
  background: rgba(0, 0, 0, 0.5);
}
.pic:hover .erweima {
  opacity: 1;
}
.pic:hover .erweimaBox {
  opacity: 1;
}
.pic:hover {
  box-shadow: 10px 10px 15px 0 #999;
}
</style>
