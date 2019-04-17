<template>
  <div
    v-loading="homeLoading"
    :style="homeLoading ? {overflow: 'hidden'} : {}"
    element-loading-text="拼命加载中"
    class="home-body-scroll"
  >
    <div class="home-container home-index-box">
      <!-- 机构数据 -->
      <OrgData
        v-if="moduleList.indexOf('orgData') > -1"
        :loading="orgLoading"
        :org-date="orgDate"
        :data-list="dataList"
        class="home-card"
        @didMount="didMount"
        @changeDate="changeDate"
        @openDialog="() => {openDialog('orgData')}"
      />
      <OrgDataDialog
        v-if="orgVisible"
        ref="orgData"
        :dialog-loading="loading"
        :select-list="selectList"
        :unselected-list="unselectedList"
        @saveSet="saveSet"
      />
      <div class="home-middle">
        <div class="home-left">
          <!-- 快捷入口 -->
          <QuickEntry
            v-if="moduleList.indexOf('shortCut') > -1"
            :loading="entryLoading"
            :entry-list="entryList"
            class="home-card"
            @didMount="didMount"
            @openDialog="openDialog"
          />
          <QuickEntryDialog
            ref="shortCut"
            :dialog-loading="loading"
            :select-list="selectList"
            :unselected-list="unselectedList"
            @saveSet="saveSet"
          />
          <!-- 今日签到 -->
          <TodaySign
            v-if="moduleList.indexOf('sign') > -1"
            :loading="signLoading"
            :select-loading="selectLoading"
            :sign-info="signInfo"
            :sign-date="signDate"
            :stu-list="stuList"
            class="home-card"
            @didMount="didMount"
            @openClassPlan="openClassPlan"
          />
          <PlanDialog
            ref="planDialog"
            :loading="signLoading"
            :plan-list="planList"
            @openStuAttendance="openStuAttendance"
          />
          <EditAndAttendance
            ref="editAttendance"
            :teacher-list="teacherList"
            @toUpdateTable="() => {}"
          />
          <!-- 销售概况 -->
          <Sales
            v-if="moduleList.indexOf('funnel') > -1"
            :loading="saleLoading"
            :sale-date="saleDate"
            :sale-funnel="saleFunnel"
            :sale-line="saleLine"
            class="home-card"
            @didMount="didMount"
            @tabChange="saleChange"
          />
          <!-- 最新推荐 -->
          <Recommended
            v-if="moduleList.indexOf('recommend') > -1"
            :loading="recommendLoading"
            :recommend-list="recommendList"
            class="home-card"
            @didMount="didMount"
          />
        </div>
        <div class="home-right">
          <!-- 待办事项 -->
          <Todos
            v-if="moduleList.indexOf('todoList') > -1"
            :loading="todoLoading"
            :todo-list="todoList"
            class="home-card"
            @didMount="didMount"
            @openTodoSet="openTodoSet"
          />
          <TodoDialog
            v-if="todoVisible"
            ref="todoDialog"
            :todo-set-list="todoSetList"
            :loading="loading"
            @saveSet="saveSet"
          />
          <!-- Banner -->
          <Banner
            v-if="moduleList.indexOf('banner') > -1"
            :loading="bannerLoading"
            :banner-list="bannerList"
            :banner-news="bannerNews"
            class="home-card"
            @didMount="didMount"
          />
          <!-- 运营妙计 -->
          <Operating
            v-if="moduleList.indexOf('sucCase') > -1"
            :loading="caseLoading"
            :case-list="caseList"
            class="home-card"
            @didMount="didMount"
          />
          <div
            class="home-set"
            @click="showHomeSet"
          ><i class="el-icon-plus icon-plus" />添加模块</div>
        </div>
      </div>
      <p class="home-bottom">
        <img src="https://img.ishanshan.com/gimg/user/n///1554345408.png">
      </p>
      <HomeSet
        ref="homeDialog"
        :todo-set-list="todoSetList"
        :loading="loading"
        @saveSet="saveSet"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import moment from 'moment'
import HomeSet from './components/HomeSet'
import OrgData from './components/OrgData'
import OrgDataDialog from './components/OrgData/OrgDataDialog'
import QuickEntry from './components/QuickEntry'
import QuickEntryDialog from './components/QuickEntry/QuickEntryDialog'
import TodaySign from './components/TodaySign'
import PlanDialog from './components/TodaySign/PlanDialog'
import EditAndAttendance from '@/views/teachManage/attendance/stuAttendance/dialog/editAndAttendance'
import Sales from './components/Sales'
import Recommended from './components/Recommended'
import Todos from './components/Todos'
import TodoDialog from './components/Todos/TodoDialog'
import Banner from './components/Banner'
import Operating from './components/Operating'
import { sortByObj } from '@/utils/arrayUtils'

export default {
  components: {
    HomeSet,
    OrgData,
    OrgDataDialog,
    QuickEntry,
    QuickEntryDialog,
    TodaySign,
    PlanDialog,
    EditAndAttendance,
    Sales,
    Recommended,
    Todos,
    TodoDialog,
    Banner,
    Operating
  },

  data() {
    return {
      orgVisible: false,
      todoVisible: false
    }
  },

  computed: {
    ...mapState('home', [
      'homeLoading',
      'moduleList',

      /** 弹窗 */
      'loading',
      'selectList',
      'unselectedList',

      /** 机构数据 */
      'orgLoading',
      'orgDate',
      'dataList',

      /** 快捷入口 */
      'entryLoading',
      'entryList',

      /** 今日签到 */
      'signLoading',
      'selectLoading',
      'stuList',
      'signInfo',
      'signDate',
      'planList',
      'teacherList',

      /** 销售概况 */
      'saleLoading',
      'saleDate',
      'saleFunnel',
      'saleLine',

      /** 最新推荐 */
      'recommendLoading',
      'recommendList',

      /** 待办事项 */
      'todoLoading',
      'todoList',

      /** banner */
      'bannerLoading',
      'bannerList',
      'bannerNews',

      /** 运营妙计 */
      'caseLoading',
      'caseList'
    ]),

    // 待办事项设置列表
    todoSetList() {
      const select = this.addKey(this.selectList, '1')
      const unselect = this.addKey(this.unselectedList, '0')

      const newList = select.concat(unselect)
      return sortByObj(newList, 'sort')
    }
  },

  mounted() {
    let menuIds = [...this.$store.getters.roles]
    menuIds = menuIds.join(',')

    // 获取显示模块
    this.homeInit({ type: 'home', menuIds })
  },

  methods: {
    ...mapMutations('home', [
      'UPDATE_STATE'
    ]),
    ...mapActions('home', [
      'homeInit', // 初始化

      'getSet',
      'updateSet',

      'getOrgData', // 获取机构数据
      'getSign', // 获取今日签到
      'getStuList', // 今日签到-学员下拉
      'getClassPlan', // 今日签到-排课列表
      'getTeacherList', // 今日签到-教师列表
      'getFunnel', // 获取销售漏斗
      'getLine', // 获取销售曲线
      'getRecommend', // 获取最新推荐
      'getTodos', // 获取待办事项
      'getTodoList',
      'getBanner', // 获取banner
      'getGoodCase' // 获取运营妙计
    ]),

    addKey(arr, bool) {
      const newArr = []
      for (let i = 0; i < arr.length; i++) {
        newArr.push({
          ...arr[i],
          isTip: bool
        })
      }
      return newArr
    },

    /** 页面各模块加载时获取数据 */
    didMount(type) {
      let menuIds = [...this.$store.getters.roles]
      menuIds = menuIds.join(',')

      switch (type) {
        case 'orgData':
          // 获取机构数据
          this.getOrgData({ dateType: '1', menuIds })
          break
        case 'entry':
          // 快捷入口
          this.getSet({ type: 'shortCut', menuIds, isEntry: true })
          break
        case 'sign':
          // 获取今日签到
          this.getSign()
          this.getStuList({ type: '2' })
          break
        case 'sale':
          // 销售概况
          this.getFunnel()
          this.getLine({ reqType: '1' })
          break
        case 'recommend':
          // 最新推荐
          this.getRecommend()
          break
        case 'todo':
          // 待办事项
          this.getTodos({ inteval: this.intevalTodo })
          break
        case 'banner':
          // banner
          this.getBanner()
          break
        case 'case':
          // 运营妙计
          this.getGoodCase()
          break
        default:
          break
      }
    },

    /** 待办事项轮询 */
    intevalTodo() {
      let times = 0
      const timer = setInterval(() => {
        if (times > 12) {
          clearInterval(timer)
        } else {
          this.getTodoList()
        }
        times += 1
      }, 5000)

      this.$once('hook:beforeDestroy', () => {
        clearInterval(timer)
      })
    },

    /** 打开弹窗 */
    openDialog(type) {
      const menuIds = [...this.$store.getters.roles]
      this.orgVisible = true
      this.$nextTick(() => {
        this.$refs[type].visible = true
        this.getSet({ type, menuIds: menuIds.join(',') })
      })
    },

    /** 保存配置 */
    saveSet(list, type, close) {
      const newList = [...list]
      this.updateSet({
        selectListStr: JSON.stringify(newList),
        inteval: this.intevalTodo,
        type,
        close
      })
    },

    /** 打开首页设置 */
    showHomeSet() {
      const menuIds = [...this.$store.getters.roles]
      this.$refs.homeDialog.visible = true
      this.getSet({ type: 'home', menuIds: menuIds.join(',') })
    },

    /** 改变机构日期 */
    changeDate(dateType) {
      const menuIds = [...this.$store.getters.roles]
      this.getOrgData({ dateType, menuIds: menuIds.join(',') })
    },

    /** 签到-打开排课列表 */
    openClassPlan(stuId) {
      if (stuId) {
        const now = moment().format('YYYY-MM-DD')

        this.$refs.planDialog.visible = true
        this.getClassPlan({
          startDate: now,
          endDate: now,
          pageIndex: 0,
          pageSize: 99999,
          stuId
        })
      }
    },

    /** 签到-打开考勤 */
    openStuAttendance(item) {
      this.getTeacherList()
      this.$refs.editAttendance.show(true, '1', item)
    },

    /** 销售获取折线图 */
    saleChange(payload) {
      this.getLine(payload)
    },

    /** 打开待办事项弹窗 */
    openTodoSet() {
      const menuIds = [...this.$store.getters.roles]
      this.todoVisible = true
      this.$nextTick(() => {
        this.$refs.todoDialog.visible = true
        this.getSet({ type: 'todoList', menuIds: menuIds.join(',') })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";

.home-body-scroll {
  height: calc(100vh - 68px);
  overflow: auto;
}
.home-container {
  min-width: 1060px;
  padding: 20px;
  background: rgba(240, 242, 245, 0.8);
}
.home-middle {
  @include flex;
  @include flexCenter(space-between);
}
.home-bottom {
  padding: 10px 0;
  text-align: center;
  img {
    width: 95px;
    height: 40px;
  }
}

.home-card {
  margin-bottom: 20px;
}

.home-left {
  width: 64%;
}

.home-right {
  width: calc(36% - 20px);
}

.home-set {
  cursor: pointer;
  height: 90px;
  border: 1px dashed #999;
  border-radius: 5px;
  font-size: 16px;
  color: #999;
  line-height: 90px;
  text-align: center;
  @include transition(all 0.3s);
  .icon-plus {
    font-size: 16px;
    color: #999;
    margin-right: 6px;
    @include transition(all 0.3s);
  }

  &:hover {
    color: #46b6ee;
    border-color: #46b6ee;
    .icon-plus {
      color: #46b6ee;
    }
  }
}
</style>

<style lang="scss">
.home-index-box .el-card__body {
  min-height: 100px;
  border-radius: 5px;
}
</style>
