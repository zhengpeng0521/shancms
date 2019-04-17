<template>
  <side-dialog :visible.sync="sideDialogShow">
    <div class="courseInfo">
      <div class="info_head">
        <div class="head_top">
          <div class="top_left">
            <img src="https://img.ishanshan.com/gimg/n/20190330/c292523dd067406574b863e1558839bd">
            <div class="name">{{ sideInfo.title }}</div>
          </div>
          <div class="top_right">
            <el-button
              type="primary"
              @click="edit"
            >编辑</el-button>
            <el-button
              class="cancel_btn"
              @click="deleteFunc"
            >删除</el-button>
          </div>
        </div>
      </div>
      <div class="info_detail">
        <el-tabs v-model="activeName">
          <el-tab-pane
            label="详细信息"
            name="1"
          >
            <div class="detail_inner">
              <div class="detail_inner_message">
                <div class="inner_item">
                  <span class="inner_item_name">课程名称：</span>
                  <span class="inner_item_text">{{ sideInfo.title }}</span>
                </div>
                <div class="inner_item">
                  <span class="inner_item_name">每节课时消耗：</span>
                  <span class="inner_item_text">{{ sideInfo.cost }}</span>
                </div>
                <div
                  v-if="sideInfo.ageType == '1'"
                  class="inner_item"
                >
                  <span class="inner_item_name">上课月龄：</span>
                  <span class="inner_item_text">{{ sideInfo.minMa }}~{{ sideInfo.maxMa }}月</span>
                </div>
                <div
                  v-if="sideInfo.ageType == '2'"
                  class="inner_item"
                >
                  <span class="inner_item_name">上课年龄：</span>
                  <span class="inner_item_text">{{ Math.floor(sideInfo.minMa/12) }}~{{ Math.ceil(sideInfo.maxMa/12) }}岁</span>
                </div>
                <div class="inner_item">
                  <span class="inner_item_name">所属校区：</span>
                  <span class="inner_item_text">{{ sideInfo.orgName }}</span>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </side-dialog>
</template>
<script>
import SideDialog from '@/components/SideDialog'
export default {
  components: {
    SideDialog
  },
  data() {
    return {
      activeName: '1',
      sideDialogShow: false, // 显示侧边栏
      sideInfo: {}
    }
  },
  methods: {
    show(val) {
      this.sideDialogShow = true
      this.activeName = '1'
      this.sideInfo = val
    },
    cancel() {
      this.sideDialogShow = false
    },
    /* 编辑 */
    edit() {
      this.$emit('toParent', this.sideInfo)
    },
    /* 删除 */
    deleteFunc() {
      this.$emit('toDelete', this.sideInfo)
    }
  }
}
</script>
<style lang="scss" scoped>
.courseInfo /deep/ {
  .info_head {
    display: flex;
    flex-wrap: wrap;
    -webkit-box-pack: start;
    justify-content: flex-start;
    overflow: hidden;
    .head_top {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      -webkit-box-align: center;
      width: 100%;
      padding: 20px 20px;
      -webkit-box-pack: justify;
      justify-content: space-between;
      .top_left {
        width: 50%;
        display: flex;
        flex-wrap: nowrap;
        -webkit-box-align: center;
        align-items: center;
        img {
          width: 40px;
          height: 40px;
          margin-right: 20px;
        }
        .name {
          font-size: 16px;
          color: #333;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
        }
      }
      .top_right {
        -webkit-box-pack: end;
        justify-content: flex-end;
        width: 50%;
        display: flex;
        flex-wrap: nowrap;
        -webkit-box-align: center;
        align-items: center;
      }
    }
  }
  .info_detail /deep/ .el-tabs__nav-wrap::after {
    background: transparent;
  }
  .detail_inner {
    padding: 15px 20px 0;
    .detail_inner_message {
      display: flex;
      width: 100%;
      -webkit-box-orient: horizontal;
      -webkit-box-direction: normal;
      flex-direction: row;
      flex-wrap: wrap;
      -webkit-box-pack: start;
      justify-content: flex-start;
      .inner_item {
        height: 50px;
        line-height: 60px;
        border-bottom: 1px solid #ddd;
        width: calc((100% - 30px) / 2);
        overflow: hidden;
        white-space: nowrap;
      }
      .inner_item:nth-child(odd) {
        margin-right: 20px;
      }
      .inner_item_name {
        color: #999;
      }
      .inner_item_text {
        color: #666;
      }
    }
  }
}
</style>
