<template>
  <div class="combo_mgr">
    <div class="page_title_text">
      套餐管理
    </div>

    <div style="display: flex;color: #666666;">
      <div>
        <span>
          我的套餐：
        </span>

      </div>

      <div style="margin-left:10px">
        <p>
          <span>{{ zsbTitle }}</span><span class="remain_day">（剩{{ zsb }}天）</span>
        </p>
        <p class="saas_combo">
          <span>{{ saasTitle }}</span><span class="remain_day">（剩{{ saas }}天）</span>
        </p>

        <el-popover
          placement="top-start"
          width="240"
          trigger="hover"
        >

          <img
            class="connect_popover_img"
            src="http://img.ishanshan.com/gimg/img/f696b637df0aba27f96116ca10e6756c"
          >
          <el-button
            slot="reference"
            class="combo_btn"
            type="primary"
          >续费/升级</el-button>
        </el-popover>

      </div>

    </div>
  </div>
</template>

<script>
import { queryMealOpening } from '@/api/orgSet/comboMgr'//eslint-disable-line
export default {
  data() {
    return {
      zsb: '0',
      zsbTitle: '招生宝付费套餐',
      saas: '0',
      saasTitle: '云校付费套餐'
    }
  },
  mounted() {
    this.getDate()
  },
  methods: {
    getDate() {
      queryMealOpening().then(res => {
        if (res.data.errorCode === 0) {
          this.zsbTitle = res.data.data.zsbMealTitle
          this.zsb = res.data.data.zsbExpireDays
          this.saasTitle = res.data.data.saasMealTitle
          this.saas = res.data.data.saasExpireDays
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.combo_mgr {
  padding: 10px;
}

.remain_day {
  color: #46b6ee;
}

.connect_popover_img {
  width: 100%;
  height: 100%;
  border-radius: 5px;
}

.saas_combo {
  margin-top: 20px;
}

.combo_btn {
  margin-top: 20px;
}
</style>
