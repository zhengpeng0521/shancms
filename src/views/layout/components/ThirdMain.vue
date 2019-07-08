<template>
  <section class="third-main">
    <el-tabs
      ref="thirdMain"
      v-model="activeName"
      :tab-position="tabPosition"
      @tab-click="handleClick"
    >
      <el-tab-pane
        v-for="item in subMenus"
        :key="item.name"
        :label="item.meta.title"
        :name="item.name"
      >
        <tm-view v-if="item.name === activeName" :info="item"/>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import TmView from './tm.js'
export default {
  components: {
    TmView
  },
  data() {
    return {
      subMenus: [],
      activeName: '',
      tabPosition: 'top'
    }
  },

  computed: {
    ...mapState('changeThirdMain', ['tabsName', 'isChange'])
  },
  watch: {
    tabsName(nweval, oldval) {
      if (this.isChange) {
        this.activeName = nweval
        setTimeout(() => {
          this.CHANGE_SWITCH()
        }, 1000)
      }
    }
  },

  // updated() {
  //   if (this.isChange) {
  //     this.activeName = this.tabsName
  //     console.log('触发三级菜单的跳转this.activeName', this.activeName)
  //   }
  // },
  mounted() {
    if (this.$route.path.indexOf('report') > -1) {
      this.tabPosition = 'left'
    } else {
      this.tabPosition = 'top'
    }
    // 跳转路由后跳转三级菜单
    if (
      this.$router.history.current.params &&
      this.$router.history.current.params.activeTab
    ) {
      this.changeTabs(this.$router.history.current.params.activeTab)
    }

    this.subMenus = this.$route.meta.cn
    if (this.subMenus.length > 0) {
      this.activeName = this.subMenus[0].name
    }
  },
  destroyed() {
    this.activeName = ''
    this.CHANGE_SWITCH()
  },
  methods: {
    ...mapActions('changeThirdMain', ['changeTabs']),

    ...mapMutations('changeThirdMain', ['CHANGE_SWITCH']),

    handleClick(tab, event) {
      this.changeTabs(this.activeName)
      window.__ml &&
        window.__ml.api &&
        window.__ml.api(tab.label, true, 0, 200, '三级菜单模块')
    }
  }
}
</script>

<style lang="scss" scoped>
.third-main /deep/ {
  /*84 = navbar + tags-view = 50 +34 */
  width: 100%;
  height: calc(100vh - 67px);
  position: relative;
  overflow: auto;
  padding: 8px 0 0 20px;
  .el-tabs__header {
    padding-right: 20px;
    margin: 0;
    margin-bottom: 20px;
  }
  .el-tabs--left .el-tabs__header {
    padding-right: 20px;
  }
  .el-tabs__nav-scroll {
    border-bottom: 0;
    padding-left: 0;
  }
  .el-tabs__item {
    padding: 0 25px;
  }
}
</style>
<style lang="scss">
.el-tabs__content {
  padding-right: 20px;
}
.el-tabs--left {
  height: 100%;
  .is-left {
    height: 100%;
    .el-tabs__nav-scroll {
      padding-left: 10px;
    }
    .el-tabs__nav-wrap {
      padding-right: 10px;
    }
  }
}
.el-tabs--left .el-tabs__nav-scroll {
  height: auto;
}
.el-tabs--left .el-tabs__active-bar.is-left {
  width: 0;
}
.el-tabs--left .el-tabs__item.is-left {
  color: #666 !important;
  transition: all 0.5s;
}
.el-tabs--left .el-tabs__item.is-active {
  background: rgba(70, 182, 238, 0.2);
}
.el-tabs--left .el-tabs__item:hover {
  color: #46b6ee !important;
}
</style>

