/**
 * 最新推荐
 */
<template>
  <el-card
    v-loading="loading"
    shadow="never"
    element-loading-text="拼命加载中"
  >
    <div class="recommond-title">
      <h3>最新推荐</h3>
    </div>
    <el-row :gutter="10">
      <el-col
        v-for="(col, index) in recommendList"
        :span="6"
        :key="'recommend' + index"
      >
        <div
          :style="{backgroundImage: `url(${col.image})`}"
          class="recommend-item"
          @click="() => {goLink(col)}"
        />
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="visible"
      title="提示"
      width="500px"
      @close="close"
    >
      <span>您没有{{ tipText }}访问权限，请联系管理员设置或开通相应套餐</span>
      <span slot="footer">
        <el-button
          type="primary"
          @click="visible = false"
        >确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      required: true
    },
    recommendList: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      tipText: '对应菜单',
      visible: false
    }
  },

  mounted() {
    this.$emit('didMount', 'recommend')
  },

  methods: {
    goLink(col) {
      if (col.jumpEnable) {
        // type 1.内链 2.外链
        if (col.type + '' === '1') {
          const linkList = col.link.split('?')
          if (linkList.length === 3) {
            // 操作params封装
            const actionParams = linkList[2]
            const params = {}
            actionParams.split('&').map((item) => {
              if (item.indexOf('=') >= 0) {
                params[item.split('=')[0]] = item.split('=')[1]
              } else {
                params.action = item
              }
            })
            // 判断是否有对应菜单权限
            if (params.menuId && !this.hasMenu(params.menuId)) {
              this.visible = true
              if (params.menuName) {
                this.tipText = ' "' + params.menuName + '" '
              } else {
                this.tipText = '对应菜单'
              }
              return
            }
            this.$router.push({ name: linkList[0], params: { activeTab: linkList[1], ...params }})
          } else if (linkList.length === 2) {
            this.$router.push({ name: linkList[0], params: { activeTab: linkList[1] }})
          } else if (linkList.length === 1) {
            this.$router.push({ name: linkList[0] })
          }
        } else {
          window.open(col.link)
        }
      } else {
        this.visible = true
      }
    },

    close() {
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.recommond-title {
  margin-bottom: 12px;
  h3 {
    font-size: 16px;
    line-height: 24px;
    color: #333;
  }
}
.recommend-item {
  cursor: pointer;
  height: 80px;
  max-width: 262px;
  margin: 0 auto;
  font-size: 16px;
  color: #fff;
  line-height: 80px;
  text-align: center;
  border-radius: 4px;
  background-color: rgba(158, 158, 158, 0.1);
  background-repeat: no-repeat;
  background-position: center;
  background-size: auto 80px;
}
</style>
