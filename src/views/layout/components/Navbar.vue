<template>
  <div class="navbar">
    <!-- <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/> -->

    <!-- <breadcrumb class="breadcrumb-container"/>  -->
    <div class="left-menu">{{ orgName }}</div>
    <div class="right-menu">
      <el-dropdown
        trigger="click"
        size="medium"
      >
        <div class="userName">
          <img src="https://img.ishanshan.com/gimg/n/20190109/ca0a26277b5a7def2d874ce5d43d32e9">
          <span> {{ userName || '欧阳校长' }} </span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span
              style="display:block;"
              @click="updatePassFun"
            >修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span
              style="display:block;"
              @click="logout"
            >{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="right-menu">
      <div class="customer">
        <img src="https://img.ishanshan.com/gimg/n/20190402/7f9a502a9b4b3aefcdbbfdce485f930c">
        <span> 帮助中心 </span>
      </div>
    </div>
    <!-- <div class="upgrade_renew">
      <el-button
        type="warning"
        size="mini"
      >升级/续费</el-button>
    </div> -->
    <!-- <div class="current_day">
      <span>{{ title }}:</span>
      <span>剩下{{ zsb }}天</span>
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'
import { queryMealOpening } from '@/api/orgSet/comboMgr'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect,
    ThemePicker
  },
  data() {
    return {
      userName: '', // 用户名
      title: '',
      zsb: '',
      orgName: '' // 校区名
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar'
      // 'device'
    ])
  },
  mounted() {
    this.userName = this.$store.getters.name
    this.orgName = this.$store.getters.orgName
    // this.getDate()
  },
  methods: {
    // toggleSideBar() {
    //   this.$store.dispatch('toggleSideBar')
    // },
    /* 获取剩余天数 */
    getDate() {
      queryMealOpening().then(res => {
        const data = res.data
        if (res.data.errorCode === 0) {
          this.title = data.data && data.data.saasMealTitle
          this.zsb = data.data && data.data.zsbExpireDays
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 修改密码 */
    updatePassFun() {

    },
    /* 退出登录 */
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 40px;
  line-height: 40px;
  border-radius: 0px !important;
  border-bottom: 1px solid #ddd;
  padding-right: 20px;
  .hamburger-container {
    line-height: 40px;
    height: 40px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .left-menu {
    float: left;
    margin-left: 30px;
    color: #333;
    font-size: 14px;
    font-weight: 500;
  }
  .right-menu {
    float: right;
    height: 100%;
    font-size: 14px;
    margin-left: 30px;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international {
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .userName {
      float: right;
      color: #b3c1c8;
      cursor: pointer;
      img {
        vertical-align: middle;
      }
      span {
        vertical-align: middle;
        color: #333;
        margin: 0 2px 0 6px;
      }
    }
    .customer {
      float: right;
      color: #b3c1c8;
      cursor: pointer;
      img {
        vertical-align: middle;
      }
      span {
        vertical-align: middle;
        color: #333;
        margin-left: 5px;
      }
    }
  }
  .upgrade_renew {
    float: right;
    .el-button--warning {
      padding: 4px 12px;
      border-radius: 4px;
    }
  }
  .current_day {
    margin-right: 10px;
    color: #333;
    font-size: 14px;
    float: right;
  }
}
</style>
