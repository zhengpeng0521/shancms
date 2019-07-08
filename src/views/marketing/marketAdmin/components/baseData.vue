<template>
  <div class="baseDataContainer">
    <div class="top">
      <div class="header"><i /><span class="title">数据总览</span></div>
      <div class="dataBorder">
        <div class="left">
          <span class="tit">总扫描次数</span>
          <p>{{ totalScanNum }}</p>
          <div class="foot"><span>今天:{{ todayScanNum }}</span><span>昨天:{{ yestadayScanNum }}</span></div>
        </div>
        <div class="right">
          <span class="tit">总有效次数</span>
          <p>{{ totalEffectNum }}</p>
          <div class="foot"><span>今天:{{ todayEffectNum }}</span><span>昨天:{{ yestadayEffectNum }}</span></div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="header"><i /><span class="title">数据趋势</span></div>
      <div class="footer-cont">
        <div class="btn">
          <el-radio-group
            v-model="radioval"
            size="mini"
            class="radioBox"
            @change="handleTapShow(radioval)"
          >
            <el-radio-button label="扫描次数" />
            <el-radio-button label="有效用户" />
            <el-radio-button label="采单人员" />
          </el-radio-group>
          <el-radio-group
            v-model="radio2"
            @change="handleDataRadio(radio2)"
          >
            <el-radio label="7天">7天</el-radio>
            <el-radio label="30天">30天</el-radio>
            <el-radio label="全部">全部</el-radio>
          </el-radio-group>

        </div>
        <div v-show="tapShow">
          <div
            v-if="radioval==='扫描次数'||radioval==='有效用户'"
            class="viewNum"
          >{{ viewNum }}<span>次</span></div>
          <div
            v-if="radioval==='采单人员'"
            class="viewBox"
          >
            <div
              v-for="(val,key,index) in viewObj"
              :key="index"
              class="viewCard"
            >{{ key }}：<span>{{ viewObj[key] }}</span>人</div>
          </div>
          <ChartCard
            v-if="radioval==='扫描次数'"
            v-bind="stuNumProps"
            :loading="loading"
            :data-source="chartList"
            :is-card="isCard"
            type="line"
          />
          <ChartCard
            v-if="radioval==='有效用户'"
            v-bind="stuNumProps1"
            :loading="loading1"
            :data-source="chartList1"
            type="line"
          />
          <ChartCard
            v-if="radioval==='采单人员'"
            v-bind="stuNumProps2"
            :loading="loading2"
            :data-source="chartList2"
            type="line"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { objListSortOfTime } from '@/utils/arrayUtils'
import ChartCard from '@/components/ReportForm/ChartCard'
import { viewDataByDaysQuery, countDataByDaysQuery, countDataByDaysOnMemberQuery } from '@/api/marketing/marketAdmin'
export default {
  components: { ChartCard },

  data() {
    return {
      radioval: '扫描次数',
      radio2: '7天',
      tapShow: true,
      // 扫描次数
      totalScanNum: 0,
      todayScanNum: 0,
      yestadayScanNum: 0,
      // 有效次数
      totalEffectNum: 0,
      todayEffectNum: 0,
      yestadayEffectNum: 0,
      // 看板总次数
      viewNum: 0,
      viewObj: {},
      loading: false,
      isCard: false,
      chartList: [],
      stuNumProps: {
        title: '',
        type: 'line',
        allCols: [
          { key: 'views', value: '扫描次数' }
        ],
        showCols: ['view_date', 'views']
      },
      chartList1: [],
      loading1: false,
      stuNumProps1: {
        title: '',
        type: 'line',
        allCols: [
          { key: 'count', value: '有效用户' }
        ],
        showCols: ['view_date', 'count']
      },
      chartList2: [],
      loading2: false,
      stuNumProps2: {
        title: '',
        type: 'line',
        allCols: [
          { key: 'count', value: 'value' }
        ],
        showCols: ['view_date', '武田', '管理员']
      },
      timeObj: {
        startDate: '',
        endDate: ''
      },
      timeArr: []
    }
  },
  mounted() {
    const sevenDate = this.getWeekTime(new Date())
    this.timeObj = {
      startDate: sevenDate[0],
      endDate: sevenDate[sevenDate.length - 1]
    }
    const params = {
      activityId: this.$parent.id,
      startDate: sevenDate[0],
      endDate: sevenDate[sevenDate.length - 1]
    }
    this.viewDataByDaysQuery(params)
    const dataArr = this.getAllTime(new Date(this.$parent.createTime))
    this.timeArr = []
    dataArr.map((res) => {
      this.timeArr.push({ view_date: res, views: 0 })
    })
    const params1 = {
      activityId: this.$parent.id,
      startDate: dataArr[0],
      endDate: dataArr[dataArr.length - 1]
    }
    viewDataByDaysQuery(params1).then((res) => {
      if (res.data.errorCode === 0) {
        this.totalScanNum = res.data.allCount
      } else {
        this.$message.error(res.errorMessage)
      }
    })
    countDataByDaysQuery(params1).then((res) => {
      if (res.data.errorCode === 0) {
        res.data.list.forEach(item => {
          // 今天数据
          if (item.view_date === dataArr[dataArr.length - 1]) {
            this.todayEffectNum = item.count || '0'
          } else {
            this.todayEffectNum = '0'
          }

          // 昨天数据
          if (item.view_date === dataArr[dataArr.length - 2]) {
            this.yestadayEffectNum = item.count || '0'
          } else {
            this.yestadayEffectNum = '0'
          }
        })
        this.totalEffectNum = res.data.allCount
      } else {
        this.$message.error(res.errorMessage)
      }
    })
  },
  methods: {
    getWeekTime(nowdate) {
      const weekArr = []
      for (let i = 6; i >= 0; i--) {
        const oneweekdate = new Date(nowdate - i * 24 * 3600 * 1000)
        const y = oneweekdate.getFullYear()
        let m = oneweekdate.getMonth() + 1
        let d = oneweekdate.getDate()
        if (Number(m) < 10) {
          m = `0${m}`
        }
        if (Number(d) < 10) {
          d = `0${d}`
        }
        const formatwdate = y + '-' + m + '-' + d
        weekArr.push(formatwdate)
      }
      return weekArr
    },
    getMonthTime(nowDate) {
      const weekArr = []
      for (let i = 29; i >= 0; i--) {
        const oneweekdate = new Date(nowDate - i * 24 * 3600 * 1000)
        const y = oneweekdate.getFullYear()
        let m = oneweekdate.getMonth() + 1
        let d = oneweekdate.getDate()
        if (Number(m) < 10) {
          m = `0${m}`
        }
        if (Number(d) < 10) {
          d = `0${d}`
        }
        const formatwdate = y + '-' + m + '-' + d
        weekArr.push(formatwdate)
      }
      return weekArr
    },
    getAllTime(nowDate) {
      const a = new Date(nowDate) - 24 * 3600 * 1000// 开始时间
      const b = new Date()// 今天
      const n = parseInt((b - a) / (24 * 3600 * 1000))
      const weekArr = []
      for (let i = n; i >= 0; i--) {
        const oneweekdate = new Date(b - i * 24 * 3600 * 1000)
        const y = oneweekdate.getFullYear()
        let m = oneweekdate.getMonth() + 1
        let d = oneweekdate.getDate()
        if (Number(m) < 10) {
          m = `0${m}`
        }
        if (Number(d) < 10) {
          d = `0${d}`
        }
        const formatwdate = y + '-' + m + '-' + d
        weekArr.push(formatwdate)
      }
      return weekArr
    },
    handleTapShow(value) {
      if (value === '扫描次数') {
        this.isradio2()
        const params = {
          activityId: this.$parent.id,
          startDate: this.timeObj.startDate,
          endDate: this.timeObj.endDate
        }
        this.viewDataByDaysQuery(params)
      } else if (value === '有效用户') {
        this.isradio2()
        const params = {
          activityId: this.$parent.id,
          startDate: this.timeObj.startDate,
          endDate: this.timeObj.endDate
        }
        this.countDataByDaysQuery(params)
      } else if (value === '采单人员') {
        this.isradio2()
        const params = {
          startDate: this.timeObj.startDate,
          endDate: this.timeObj.endDate,
          activityId: this.$parent.id
        }
        this.countDataByDaysOnMemberQuery(params)
      }
    },
    handleDataRadio(val) {
      if (val === '7天') {
        this.isradio2()
        const params = {
          activityId: this.$parent.id,
          startDate: this.timeObj.startDate,
          endDate: this.timeObj.endDate
        }
        this.isradioval(params)
      } else if (val === '30天') {
        this.isradio2()
        const params = {
          activityId: this.$parent.id,
          startDate: this.timeObj.startDate,
          endDate: this.timeObj.endDate
        }
        this.isradioval(params)
      } else if (val === '全部') {
        this.isradio2()
        const params = {
          activityId: this.$parent.id,
          startDate: this.timeObj.startDate,
          endDate: this.timeObj.endDate
        }
        this.isradioval(params)
      }
    },
    viewDataByDaysQuery(params) {
      this.loading = true
      viewDataByDaysQuery(params).then((res) => {
        if (res.data.errorCode === 0) {
          const list = []
          this.timeArr.map((val) => {
            if (res.data.list.length > 0) {
              res.data.list.every((item, index) => {
                if (val.view_date === item.view_date) {
                  list.push({ view_date: val.view_date, views: item.views })
                  return false
                } else {
                  list.push({ view_date: val.view_date, views: 0 })
                  return false
                }
              })
            } else {
              list.push({ view_date: val.view_date, views: 0 })
            }
          })
          this.viewNum = res.data.allCount
          this.chartList = [...list]
          this.stuNumProps.showCols = ['view_date', 'views']
          this.todayScanNum = this.chartList[this.chartList.length - 1].views
          this.yestadayScanNum = this.chartList[this.chartList.length - 2].views
        } else {
          this.$message.error(res.errorMessage)
        }
        this.loading = false
      })
    },
    countDataByDaysQuery(params) {
      this.loading1 = true
      countDataByDaysQuery(params).then((res) => {
        if (res.data.errorCode === 0) {
          const list = []
          this.timeArr.map((val) => {
            if (res.data.list.length > 0) {
              res.data.list.every((item, index) => {
                if (item.view_date === val.view_date) {
                  list.push({ view_date: val.view_date, count: item.count })
                  return false
                } else {
                  list.push({ view_date: val.view_date, count: 0 })
                  return false
                }
              })
            } else {
              list.push({ view_date: val.view_date, count: 0 })
            }
          })
          this.viewNum = res.data.allCount
          this.chartList1 = [...list]
          this.stuNumProps1.showCols = ['view_date', 'count']
          this.todayEffectNum = this.chartList1[list.length - 1].count
          this.yestadayEffectNum = this.chartList1[list.length - 2].count
        } else {
          this.$message.error(res.errorMessage)
        }
        this.loading1 = false
      })
    },
    countDataByDaysOnMemberQuery(params) {
      this.loading2 = true
      countDataByDaysOnMemberQuery(params).then((res) => {
        if (res.data.errorCode === 0) {
          const reList = []
          const obj = { ...res.data.data }
          for (var key in obj) {
            const newObj = {}
            obj[key].map((val, index) => {
              newObj.view_date = key
              newObj[val.member_name] = val.count
            })
            reList.push(newObj)
          }
          const numberObj = { ...reList[0] }
          delete numberObj.view_date
          reList.map((val) => {
            for (var n in numberObj) {
              numberObj[n] += val[n]
            }
          })
          this.viewObj = numberObj
          const list = objListSortOfTime(reList, 'view_date', 'YYYY-MM-DD')
          const arr = []
          for (var i in list[0]) {
            if (i !== 'view_date') {
              arr.push(i)
            }
          }
          this.stuNumProps2.showCols = ['view_date', ...arr]
          this.chartList2 = list
        } else {
          this.$message.error(res.errorMessage)
        }
        this.loading2 = false
      })
    },
    isradio2() {
      if (this.radio2 === '7天') {
        const dataArr = this.getWeekTime(new Date())
        this.timeObj.endDate = dataArr[dataArr.length - 1]
        this.timeObj.startDate = dataArr[0]
        this.timeArr = []
        dataArr.map((res) => {
          this.timeArr.push({ view_date: res, views: 0 })
        })
      } else if (this.radio2 === '30天') {
        const dataArr = this.getMonthTime(new Date())
        this.timeObj.startDate = dataArr[0]
        this.timeObj.endDate = dataArr[dataArr.length - 1]
        this.timeArr = []
        dataArr.map((res) => {
          this.timeArr.push({ view_date: res, views: 0 })
        })
      } else if (this.radio2 === '全部') {
        const dataArr = this.getAllTime(new Date(this.$parent.createTime))
        this.timeObj.endDate = dataArr[dataArr.length - 1]
        this.timeObj.startDate = dataArr[0]
        this.timeArr = []
        dataArr.map((res) => {
          this.timeArr.push({ view_date: res, views: 0 })
        })
      }
    },
    isradioval(params) {
      if (this.radioval === '扫描次数') {
        this.viewDataByDaysQuery(params)
      } else if (this.radioval === '有效用户') {
        this.countDataByDaysQuery(params)
      } else if (this.radioval === '采单人员') {
        this.countDataByDaysOnMemberQuery(params)
      }
    }

  }
}
</script>
<style lang="scss" scoped>
.baseDataContainer {
  .header {
    i {
      display: inline-block;
      width: 6px;
      height: 14px;
      background: rgba(70, 182, 238, 1);
      border-radius: 2px;
    }
    .title {
      font-size: 16px;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 14px;
      margin-left: 12px;
    }
  }
  .dataBorder {
    margin-top: 15px;
    display: flex;
    .left,
    .right {
      width: 250px;
      height: 154px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 2px 7px 0px rgba(63, 72, 83, 0.3);
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .tit {
        font-size: 14px;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 20px;
        margin-top: 25px;
      }
      p {
        width: 32px;
        height: 36px;
        font-size: 30px;
        font-family: DIN-Medium;
        font-weight: 500;
        color: rgba(230, 67, 64, 1);
        line-height: 36px;
        margin-top: 11px;
        margin-bottom: 17px;
      }
      .foot {
        width: 100%;
        display: flex;
        justify-content: space-around;
        span {
          font-size: 14px;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          line-height: 20px;
        }
      }
    }
    .right {
      margin-left: 20px;
    }
  }
  .footer {
    margin-top: 30px;
    .footer-cont {
      margin-top: 15px;
      .btn {
        width: calc(100% - 20px);
        padding-right: 20px;
        display: flex;
        justify-content: space-between;
      }
      .viewNum {
        width: 100%;
        text-align: center;
        font-size: 30px;
        font-family: DIN-Medium;
        font-weight: 500;
        color: rgba(70, 182, 238, 1);
        line-height: 36px;
        span {
          font-size: 14px;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          line-height: 20px;
          margin-left: 4px;
        }
      }
      .viewBox {
        width: 100%;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 10px;
        line-height: 20px;
        .viewCard {
          width: 16%;
          text-align: center;
          display: inline-block;
          span {
            color: rgba(70, 182, 238, 1);
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.baseDataContainer .footer .btn .radioBox .is-active {
  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background: #fff;
    border-color: #46b6ee;
    color: #46b6ee;
  }
}
</style>

