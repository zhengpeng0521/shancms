/**
 * crm通用详情
 *  props：
 *    name           Str         学员姓名
 *    btns           Arr         头部按钮组，值为Obj{type: '按钮类型Str', label: '按钮名称Str', clickHandle: '点击事件Func'}
 *    headerInfo     Arr         头部显示信息，值为Obj{key: '数据key值', label: '展示label'}
 *    headerData     Obj         头部数据源
 *    baseInfo       Arr         左侧基础信息，同headerInfo
 *    baseData       Obj         基础信息数据源
 *    tabs           Arr         显示的tab页，默认全部
 *    defaultTab     Str         默认tab
 *
 *  tab名含义: leadsRecord-跟进记录
 *             visiteRecord-到访记录
 *             listenRecord-试听记录
 *             parent-家长信息
 *             contract-合同
 *             vipCard-学员账户
 *             nursery-托班套餐
 *             usedPeriods-已消耗课时
 *             orderClass-约课记录
 *             production-作品
 **/
<template>
  <SideDialog :visible.sync="visible">
    <div>
      <div
        ref="detailHeader"
        class="detail-header"
      >
        <div class="detail-header-top">
          <div>
            <img
              src="https://img.ishanshan.com/gimg/n/20190330/a904c3a3e85790862e0eacba8331c5e8"
              alt="头像"
            >
            <span class="detail-header-name">{{ name || '--' }}</span>
          </div>
          <div>
            <template v-for="(btn, index) in btns">
              <el-button
                v-if="!btn.btnId ? true : hasBtn(btn.btnId)"
                :key="'detailBtn_'+index"
                :type="btn.type"
                :class="btn.class"
                @click="btn.clickHandle"
              >{{ btn.label }}</el-button>
            </template>
          </div>
        </div>
        <div class="detail-header-info">
          <p
            v-for="(item, index) in headerInfo"
            :key="'detailInfo_'+index"
          >
            <span class="header-info-left">{{ item.label }} : </span>
            <span>{{ headerData[item.key] || '--' }}</span>
          </p>
        </div>
      </div>
      <div
        v-if="tabActive"
        :style="{height: `calc(100% - ${headerHeight}px)`}"
        class="detail-content"
      >
        <div
          v-if="baseInfo"
          class="detail-content-left"
        >
          <BlockTitle>
            <span style="color:#333;">基础信息</span>
          </BlockTitle>
          <ul class="detail-content-list">
            <li class="content-info-label">学员信息</li>
            <li
              v-for="(info, index) in baseInfo"
              :key="'baseInfo_'+index"
            >
              <span class="content-info-label">{{ info.label }} : </span>
              <el-popover
                v-if="info.popover"
                placement="top"
                trigger="hover"
              >
                <div style="text-align:center">{{ baseData[info.key] || '--' }}</div>
                <span
                  slot="reference"
                  style="color:#46b6ee;cursor:pointer"
                >查看</span>
              </el-popover>
              <span v-else>{{ baseData[info.key] || '--' }}</span>
            </li>
          </ul>
        </div>
        <div class="detail-content-right">
          <el-tabs
            ref="tabs"
            v-model="activeName"
            @tab-click="tabChange"
          >
            <el-tab-pane
              v-if="tabs.indexOf('leadsRecord') > -1"
              label="跟进记录"
              name="leadsRecord"
            >
              <span slot="label">跟进记录 ({{ leadsCount }})</span>
              <LeadsRecord
                v-if="visible && activeName === 'leadsRecord'"
                :params="params"
                :leads-record-list="leadsRecordList"
                :loading="loading"
                :has-more="hasMore"
                :loadmore="loadmore"
                :get-leads-record="getLeadsRecord"
                @toUpdateTable="getUpdateLeadsTable"
              />
            </el-tab-pane>
            <el-tab-pane
              v-if="tabs.indexOf('visiteRecord') > -1"
              label="到访记录"
              name="visiteRecord"
            >
              <span slot="label">到访记录 ({{ visiteCount }})</span>
              <VisiteRecord
                v-if="visible && activeName === 'visiteRecord'"
                :visite-record-list="visiteRecordList"
                :loading="loading"
                :has-more="hasMore"
                :params="params"
                :loadmore="loadmore"
                :get-visite-list="getVisiteList"
                @toUpdateTable="getUpdateVisitTable"
              />
            </el-tab-pane>
            <el-tab-pane
              v-if="tabs.indexOf('listenRecord') > -1"
              label="试听记录"
              name="listenRecord"
            >
              <span slot="label">试听记录 ({{ listenCount }})</span>
              <ListenRecord
                v-if="visible && activeName === 'listenRecord'"
                :listen-record-list="listenRecordList"
                :loading="loading"
                :has-more="hasMore"
                :params="params"
                :loadmore="loadmore"
                :get-listen-list="getListenList"
                @toUpdateTable="getUpdateListenTable"
              />
            </el-tab-pane>
            <el-tab-pane
              v-if="tabs.indexOf('parent') > -1"
              label="家长信息"
              name="parent"
            >
              <ParentInfo
                v-if="visible && activeName === 'parent'"
                :header-height="headerHeight"
                :params="params"
                :base-data="baseData"
              />
            </el-tab-pane>
            <el-tab-pane
              v-if="tabs.indexOf('contract') > -1"
              label="合同"
              name="contract"
            >
              <span
                slot="label"
                @click="getConRsuCount"
              >合同 ({{ contractCount }})</span>
              <Contract
                v-if="visible && activeName === 'contract'"
                ref="contractTab"
                :params="params"
                :header-height="headerHeight"
              />
            </el-tab-pane>
            <el-tab-pane
              v-if="tabs.indexOf('vipCard') > -1"
              label="学员账户"
              name="vipCard"
            >
              <VipCard
                v-if="visible && activeName === 'vipCard'"
                :header-height="headerHeight"
                :params="params"
              />
            </el-tab-pane>
            <el-tab-pane
              v-if="tabs.indexOf('nursery') > -1"
              label="托班套餐"
              name="nursery"
            >
              <Nursery
                v-if="visible && activeName === 'nursery'"
                :header-height="headerHeight"
                :params="params"
              />
            </el-tab-pane>
            <el-tab-pane
              v-if="tabs.indexOf('usedPeriods') > -1"
              label="已消耗课时"
              name="usedPeriods"
            >
              <UsedPeriods
                v-if="visible && activeName === 'usedPeriods'"
                :header-height="headerHeight"
                :params="params"
              />
            </el-tab-pane>
            <el-tab-pane
              v-if="tabs.indexOf('orderClass') > -1"
              label="约课记录"
              name="orderClass"
            >
              <OrderClass
                v-if="visible && activeName === 'orderClass'"
                :header-height="headerHeight"
                :params="params"
              />
            </el-tab-pane>
            <el-tab-pane
              v-if="tabs.indexOf('production') > -1"
              label="作品"
              name="production"
            >
              <Production
                v-if="visible && activeName === 'production'"
                :header-height="headerHeight"
                :params="params"
              />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </SideDialog>
</template>

<script>
import SideDialog from '@/components/SideDialog'
import BlockTitle from '@/components/MiniCommon/BlockTitle'
import LeadsRecord from './components/leadsRecord/LeadsRecord'
import VisiteRecord from './components/visiteRecord/VisiteRecord'
import ListenRecord from './components/listenRecord/ListenRecord'
import ParentInfo from './components/parentInfo/ParentInfo'
import Contract from './components/contract/Contract'
import VipCard from './components/vipCard/VipCard'
import Nursery from './components/nursery/Nursery'
import UsedPeriods from './components/usedPeriods/UsedPeriods'
import Production from './components/production/Production'
import OrderClass from './components/orderClass/OrderClass'
import { getLeadsRecord, getVisiteList, getListenList, queryOrder } from '@/api/crmDetail/crmDetail'

export default {
  components: {
    SideDialog,
    BlockTitle,
    LeadsRecord,
    VisiteRecord,
    ListenRecord,
    ParentInfo,
    Contract,
    VipCard,
    Nursery,
    UsedPeriods,
    Production,
    OrderClass
  },

  props: {
    name: {
      type: String,
      default: '暂无'
    },
    btns: {
      type: Array,
      default: () => []
    },
    headerInfo: {
      type: Array,
      default: () => []
    },
    headerData: {
      type: Object,
      default: () => {}
    },
    baseInfo: {
      type: Array,
      default: () => []
    },
    baseData: {
      type: Object,
      default: () => {}
    },
    tabs: {
      type: Array,
      default: () => ['leadsRecord', 'visiteRecord', 'listenRecord', 'parent', 'contract',
        'vipCard', 'nursery', 'usedPeriods', 'orderClass', 'production']
    },
    defaultTab: {
      type: String,
      default: 'leadsRecord'
    },
    params: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      tabActive: true,
      visible: false,
      headerHeight: 0,
      activeName: this.defaultTab,
      pageSize: 5,
      pageIndex: 0, // 当前页
      loading: false,
      hasMore: false,

      leadsRecordList: [], // 跟进记录列表
      leadsCount: 0, // 跟进记录条数

      visiteRecordList: [], // 到访记录列表
      visiteCount: 0, // 到访记录条数

      listenRecordList: [], // 试听记录列表
      listenCount: 0, // 试听记录条数

      contractCount: 0 // 合同总数
    }
  },

  watch: {
    visible(newProp) {
      if (newProp) {
        this.initData()
        // 获取头部高度
        this.$nextTick(function() {
          this.headerHeight = this.$refs.detailHeader.offsetHeight
        })
      }
    }
  },

  methods: {

    initData() {
      this.pageSize = 5
      this.pageIndex = 0
      const payload = {
        pageSize: this.pageSize,
        pageIndex: this.pageIndex
      }
      if (this.tabs.indexOf('leadsRecord') > -1) {
        const params = {
          ...payload,
          source: this.params.source,
          stuId: this.params.stuId
        }
        this.getLeadsRecord(params, true)
      }
      if (this.tabs.indexOf('visiteRecord') > -1) {
        const params = {
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          source: this.params.source,
          stuId: this.params.stuId
        }
        this.getVisiteList(params, true)
      }
      if (this.tabs.indexOf('listenRecord') > -1) {
        const params = {
          ...payload,
          source: this.params.source,
          stuId: this.params.stuId
        }
        this.getListenList(params, true)
      }
      this.getConRsuCount()
    },
    show() {
      this.visible = true
      this.tabActive = false
      const activeName = this.activeName
      this.activeName = ''
      this.$nextTick(function() {
        this.tabActive = true
        this.activeName = activeName
        this.initData()
      })
    },
    /** tab切换 */
    tabChange(tab, event) {
      const payload = {
        pageSize: this.pageSize,
        pageIndex: 0
      }
      switch (tab.name) {
        // 跟进记录
        case 'leadsRecord':
          this.getLeadsRecord(payload, true)
          break
        // 到访记录
        case 'visiteRecord':
          this.getVisiteList(payload, true)
          break
        // 试听记录
        case 'listenRecord':
          this.getListenList(payload, true)
          break
        default:
          break
      }
    },

    /* 获取合同数据总条数 */
    getConRsuCount() {
      const params = {
        stuId: this.params.stuId,
        condition: 'all'
      }
      queryOrder(params).then(res => {
        if (res.data.errorCode === 0) {
          this.contractCount = res.data.data.resultCount
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    /** 获取跟进记录 */
    async getLeadsRecord(payload, isFirst) {
      const params = {
        ...payload,
        source: this.params.source,
        stuId: this.params.stuId
      }
      this.loading = true
      const { data } = await getLeadsRecord(params)
      if (isFirst) {
        this.leadsRecordList = data.results
        this.pageIndex = data.data.pageIndex || 0
        this.leadsCount = data.data.resultCount
      } else {
        const oldList = [...this.leadsRecordList]
        const newList = oldList.concat(data.results)
        this.leadsRecordList = newList
        this.pageIndex = data.data.pageIndex || 0
        this.leadsCount = data.data.resultCount
      }
      if (data.data.pageCount > data.data.pageIndex + 1) {
        this.hasMore = true
      } else {
        this.hasMore = false
      }
      this.loading = false
    },
    /* 更新跟进的表格数据 */
    getUpdateLeadsTable() {
      this.$emit('toUpdateLeadsTable', this.params)
    },

    /** 获取到访记录 */
    async getVisiteList(payload, isFirst) {
      let params = {}
      params = {
        ...payload,
        source: this.params.source,
        stuId: this.params.stuId
      }
      this.loading = true
      const { data } = await getVisiteList(params)
      if (isFirst) {
        this.visiteRecordList = data.results
        this.pageIndex = data.data.pageIndex || 0
        this.visiteCount = data.data.resultCount
      } else {
        const oldList = [...this.visiteRecordList]
        const newList = oldList.concat(data.results)
        this.visiteRecordList = newList
        this.pageIndex = data.data.pageIndex || 0
        this.visiteCount = data.data.resultCount
      }

      if (data.data.pageCount > data.data.pageIndex + 1) {
        this.hasMore = true
      } else {
        this.hasMore = false
      }
      this.loading = false
    },
    /* 更新到访数据 */
    getUpdateVisitTable() {
      this.$emit('toUpdateVisitTable')
    },

    /* 更新试听数据 */
    getUpdateListenTable() {
      this.$emit('toUpdateListenTable')
    },

    /** 获取试听记录 */
    async getListenList(payload, isFirst) {
      const params = {
        ...payload,
        source: this.params.source,
        stuId: this.params.stuId
      }
      this.loading = true
      const { data } = await getListenList(params)
      if (isFirst) {
        this.listenRecordList = data.results
        this.pageIndex = data.data.pageIndex || 0
        this.listenCount = data.data.resultCount
      } else {
        const oldList = [...this.listenRecordList]
        const newList = oldList.concat(data.results)
        this.listenRecordList = newList
        this.pageIndex = data.data.pageIndex || 0
        this.listenCount = data.data.resultCount
      }

      if (data.data.pageCount > data.data.pageIndex + 1) {
        this.hasMore = true
      } else {
        this.hasMore = false
      }
      this.loading = false
    },

    /** 上拉加载 */
    loadmore() {
      const payload = {
        pageSize: this.pageSize,
        pageIndex: this.pageIndex + 1
      }
      if (this.activeName === 'leadsRecord') {
        if (this.hasMore) {
          this.getLeadsRecord(payload)
        }
      } else if (this.activeName === 'visiteRecord') {
        if (this.hasMore) {
          this.getVisiteList(payload)
        }
      } else if (this.activeName === 'listenRecord') {
        if (this.hasMore) {
          this.getListenList(payload)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";

// 头部 start
.detail-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
}
.detail-header-top {
  @include flex();
  @include flexCenter(space-between);
}
.detail-header-name {
  margin-left: 20px;
  display: inline-block;
  font-size: 16px;
  line-height: 40px;
  vertical-align: top;
}
.detail-header-info {
  margin-top: 20px;
  @include flex();
  @include flexWrap();

  p {
    width: 45%;
    margin-bottom: 10px;

    span {
      display: inline-block;
      width: 49%;
    }
    .header-info-left {
      text-align: right;
    }
  }
}
//头部 end

//内容 start
.detail-content {
  @include flex();
}
.detail-content-left {
  @include flexChild(0 0 200px);
  border-right: 1px solid #eee;
  padding: 20px 0 0 20px;
}
.detail-content-list li {
  margin-top: 6px;
}
.content-info-label {
  color: #999;
}

.detail-content-right {
  @include flexWidth();
  overflow: hidden;
}
.record-list-box {
  max-height: 100px;
  overflow: auto;
}
//内容 end
</style>

<style lang="scss">
.detail-content-right .el-tabs__nav-scroll {
  border-bottom: none;
}
</style>
