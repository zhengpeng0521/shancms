<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <div class="logo_img">
      <img :src="imgUrl">
    </div>
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      unique-opened
    >
      <sidebar-item
        v-for="route in permission_routers"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import { getOrgan } from '@/api/sider/side'
export default {
  components: { SidebarItem },
  data() {
    return {
      imgUrl: 'https://img.ishanshan.com/gimg/n/20190109/48067037b325bb90a8eca894be0266de'
    }
  },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  mounted() {
    this.getOrgImg()
  },
  methods: {
    getOrgImg() {
      getOrgan().then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.imgUrl = data.schoolLogo || 'https://img.ishanshan.com/gimg/n/20190109/48067037b325bb90a8eca894be0266de'
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.logo_img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0px auto 8px;
  // background: url("https://img.ishanshan.com/gimg/n/20190109/48067037b325bb90a8eca894be0266de");
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}
</style>
