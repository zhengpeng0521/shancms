<template>
  <div class="classContent">
    <el-button
      type="primary"
      style="margin-bottom:10px"
      @click="edit"
    >编辑</el-button>
    <div class="render_item">
      <div>课堂内容：</div>
      <div>{{ classData.content || '--' }}</div>
    </div>
    <div class="render_item">
      <div>课后作业：</div>
      <div>{{ classData.homework || '--' }}</div>
    </div>
    <div>
      <div class="render_item">
        <div>课堂图片：</div>
        <div>共{{ picNum }}张</div>
      </div>
      <div style="margin-left:62px">
        <div
          v-for="(item,index) of picArr"
          :key="index"
          class="render_img"
        >
          <a
            :href="item"
            target="_blank"
            class="uploadExample"
          >
            <img :src="item">
            <span>预览</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      picNum: 0, // 图片张数
      picArr: [], // 图片列表
      classData: {} // 上课数据
    }
  },
  methods: {
    getList(val) {
      this.classData = val
      if (val.picList && val.picList.length > 0) {
        this.picNum = val.picList.length
        this.picArr = val.picList
      } else {
        this.picNum = 0
        this.picArr = []
      }
    },
    /* 编辑课堂内容 */
    edit() {
      this.$emit('toClassContentEdit', this.classData)
    }
  }
}
</script>
>
<style lang="scss" scoped>
.render_item {
  display: flex;
  flex-wrap: nowrap;
  margin-bottom: 10px;
  color: rgba(0, 0, 0, 0.65);
  div:first-child {
    width: 8.5%;
  }
  div:last-child {
    width: 91.5%;
  }
}
.render_img {
  float: left;
  margin-left: 10px;
  .uploadExample {
    position: relative;
    display: inline-block;
    height: 96px;
    padding: 8px;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    vertical-align: top;
    margin-right: 10px;
    img {
      width: 78px;
      height: 78px;
    }
    span {
      position: absolute;
      bottom: 8px;
      left: 8px;
      width: 78px;
      height: 18px;
      color: #fff;
      line-height: 20px;
      text-align: center;
      font-size: 12px;
      background: #000;
      opacity: 0.5;
    }
  }
}
</style>
