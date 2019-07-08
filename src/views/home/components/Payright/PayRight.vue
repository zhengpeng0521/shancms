<template>
  <div
    v-if="isShown"
    class="wrapWall"
  >
    <el-row v-show="dis">
      <el-col :span="24">
        <!-- <i class="el-icon-warning-outline"></i> -->
        <div class="leftWidrh">
          <!-- 左边部分 -->
          <span>
            您的
            <span
              v-for="item of list"
              :key="item.id"
            >「{{ item.mealTitle }}」套餐还剩{{ item.expireDays }}天过期。</span>为了不影响后续使用，请尽快续费。
          </span>
          <!-- <span class="nowXu"></span> -->

          <el-popover
            placement="top-start"
            width="240"
            trigger="hover"
          >
            <div style="text-align:center">请联系客服续费</div>
            <img
              class="connect_popover_img"
              src="http://img.ishanshan.com/gimg/img/f696b637df0aba27f96116ca10e6756c"
            >

            <el-button
              slot="reference"
              type="danger"
              round
            >立即续费</el-button>
          </el-popover>
        </div>
        <div>
          <!-- 删除按钮 -->
          <div
            class="del"
            @click="close"
          >X</div>
        </div>
      </el-col>
    </el-row>

    <!-- 弹出框 -->
    <el-dialog
      :visible.sync="centerDialogVisible"
      title="套餐过期"
      width="30%"
      center
    >
      <div style="text-align:center">
        <div style="padding-bottom:5px">
          您的
          <span
            v-for="item of expireResults"
            :key="item.id"
          >「{{ item.mealTitle }}」</span>
          套餐已经过期。
        </div>
        <div>为了不影响后续使用，请联系客服续费。</div>
        <img
          src="http://img.ishanshan.com/gimg/img/f696b637df0aba27f96116ca10e6756c"
          alt
        >
      </div>
      <!-- <div>客服热线：400-660-5733</div> -->
    </el-dialog>
  </div>
</template>
<script>
import { getInfoList } from '@/api/home/home'
export default {
  data() {
    return {
      list: [],
      expireResults: [],
      dis: false,
      centerDialogVisible: false,
      data: {
        isHome: 1
      },
      isShown: false
    }
  },
  mounted() {
    this.getInfoList()
  },
  methods: {
    getInfoList() {
      getInfoList(this.data).then(res => {
        const data = res.data
        // console.log(data);
        if (data.errorMessage === '成功') {
          const resultsL = data.mealResults.length
          const expireResultsL = data.expireResults.length
          // 头部的提示
          if (resultsL > 0) {
            this.list = data.mealResults
            this.dis = true
          } else {
            this.dis = false
          }
          // 弹窗
          if (expireResultsL > 0) {
            this.expireResults = data.expireResults
          } else {
            this.centerDialogVisible = false
            return
          }

          const onida = JSON.parse(localStorage.getItem('test'))

          if (onida === null || onida === undefined) {
            localStorage.setItem('test', JSON.stringify(data.expireResults))
            this.centerDialogVisible = true
          } else {
            // this.centerDialogVisible = false;
            // 判断两个数组的内容是不是一样，一样的去掉，取新的数组

            const newLostorg = new Set(onida)
            const newTan = new Set(data.expireResults)
            const arr = [...newTan].filter(x =>
              [...newLostorg].every(y => y.mealId !== x.mealId)
            )
            // console.log(newLostorg)
            // console.log(newTan)
            // console.log("arr", arr);
            // 如果arr为空 不显示反之显示（缓存 弹框赋予新数组）
            if (arr.length === 0) {
              // console.log(123)
              this.centerDialogVisible = false
            } else {
              localStorage.setItem('test', JSON.stringify(data.expireResults))
              this.expireResults = arr
              this.centerDialogVisible = true
            }
          }
        }
      })
    },

    close() {
      this.dis = false
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapWall /deep/ .el-col-24 {
  background: #f56c6c;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 2%;
  color: #fff;
}
.leftWidrh {
  width: 80%;
  line-height: 2;
}
.del {
  cursor: pointer;
}
.wrapWall /deep/ .el-button--mini,
.el-button--mini.is-round {
  color: #f56c6c;
  font-size: 13px;
}
.connect_popover_img {
  width: 100%;
  height: 100%;
  border-radius: 5px;
}
</style>

