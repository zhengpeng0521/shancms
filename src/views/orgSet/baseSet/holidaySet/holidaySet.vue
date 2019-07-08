<template>

  <div class="holiday-content">

    <div class="holiday-content-left">
      <div style="margin-bottom:5px">
        <span
          class="choice-btn"
          @click="lastYear"
        >上一年</span>

        <span style="padding: 0px 25px;color：#666666 ; cursor: pointer;">{{ selectDate[0].year }}年</span>
        <span
          class="choice-btn"
          @click="nextYear"
        >下一年</span>

      </div>

      <div class="calendar-container">

        <div
          v-for="(item, key) in selectDate"
          :key="'date_'+key"
          class="calendar-box"
        >
          <p class="month">

            {{ item.month+1 }}月
          </p>

          <ul class="week">
            <li
              v-for="(o,index) in 7"
              :key="o"
            >{{ formatWeek(index) }}</li>
          </ul>
          <ul class="date">
            <!-- 上月日期 -->
            <li
              v-for="o in lastMonthDays(item)"
              :key="o+50"
              class="none-week"
            >{{ lastMonthStartDay(item)+o-1 }}</li>
            <!-- 本月日期 -->
            <li
              v-for="day in nowMonthDays(item)"
              :key="day"
              :class="[{ active: item.year==year&&item.month==month && day==today},{ activeChoice:getSetDay(item,day)}]"
              @click="clickEvent(item,day)"
            >{{ day }}</li>
            <!-- 下月日期 -->
            <li
              v-for="day in (42 - lastMonthDays(item) - nowMonthDays(item))"
              :key="day+100"
              class="none-week"
            >{{ day }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="holiday-content-right">

      <div class="holiday-list">

        <p class="holiday-title">节假日列表</p>

        <ul class="holiday-item-box">

          <li
            v-for="(item,index) in holidayList"
            :key="index"
          >
            <span style="width: 120px;text-align: center;">
              {{ item.hday }}
            </span>
            <span class="holiday-edit">
              <span v-if="!item.isEdit">{{ item.content }}</span>
              <el-input
                v-else
                v-model="item.content"
                placeholder="请输入节假日名称"
              />

            </span>
            <span>

              <el-button
                v-if="item.isEdit"
                type="text"
                @click="saveHoliday(item,index)"
              >保存</el-button>

              <el-button
                v-else
                type="text"
                @click="editHoliday(item,index)"
              >编辑</el-button>

              <el-button
                v-if="!item.isEdit"
                type="text"
                @click="deleteHoliday(item,index)"
              >删除</el-button>

              <el-button
                v-else
                type="text"
                @click="cancelEdit(item,index)"
              >取消</el-button>
            </span>
          </li>

        </ul>

      </div>

    </div>
  </div>
</template>

<script>
import { holidayList, holidayUpdate, holidayDelete, holidayCreate } from '@/api/orgSet/baseSet'
export default {
  // props: ['start-date'],
  data() {
    const newMonth = []
    const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    const now = new Date()
    months.forEach((item) => {
      const date = new Date(now.setMonth(item))
      newMonth.push(this.getDate(date))
    })

    return {
      selectDate: newMonth, // 选择日期列表
      // nowDate: this.getDate(new Date()), // 当前设置时间 默认为当前系统时间
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      today: new Date().getDate(),
      isToday: false,

      holidayList: [],
      saveNowDate: []
    }
  },

  mounted() {
    this.getHolidayList()
  },
  methods: {
    getHolidayList() {
      holidayList().then(res => {
        if (res.data.errorCode === 0) {
          this.holidayList = res.data.results
          this.holidayList.forEach(v => {
            this.saveNowDate.push(v.hday)
          })
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    nowMonthDays(item) {
      return this.calcDays(item.year, item.month)
    },

    lastMonthDays(item) {
      return this.startWeek(item)
    },
    lastMonthStartDay(item) {
      return this.calcLastMonthDays(item.year, item.month) - (this.startWeek(item) - 1)
    },
    getDate(date) {
      return {
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDay(),
        date: date.getDate()
      }
    },
    formatWeek(day) {
      switch (day) {
        case 0:
          return '日'
        case 1:
          return '一'
        case 2:
          return '二'
        case 3:
          return '三'
        case 4:
          return '四'
        case 5:
          return '五'
        case 6:
          return '六'
      }
    },
    // 判断闰年
    isLeapYear(year) {
      return (year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0)
    },
    // 根据日子计算星期
    calcWeekend(year, month, day) {
      return new Date(year, month, day).getDay()
    },
    // 计算某年某月的天数
    calcDays(year, month) {
      const monthDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      if (this.isLeapYear(year) && month === 1) { return 29 } else { return monthDay[month] }
    },

    // 计算上个月天数
    calcLastMonthDays(year, month) {
      if (month === 0) {
        return this.calcDays(year - 1, 11)
      } else {
        return this.calcDays(year, month - 1)
      }
    },

    getSetDay(val, day) {
      // const date = val.year + '-' + (val.month + 1) + '-' + day
      let date = ''
      if ((val.month + 1) < 10) {
        if (day < 10) {
          date = val.year + '-' + '0' + (val.month + 1) + '-' + '0' + day
        } else {
          date = val.year + '-' + '0' + (val.month + 1) + '-' + day
        }
      } else {
        if (day < 10) {
          date = val.year + '-' + (val.month + 1) + '-' + '0' + day
        } else {
          date = val.year + '-' + (val.month + 1) + '-' + day
        }
      }

      return this.saveNowDate.indexOf(date) !== -1
    },

    // 去年
    lastYear() {
      this.selectDate.forEach(item => {
        item.year--
      })
    },
    // 下一年
    nextYear() {
      this.selectDate.forEach(item => {
        item.year++
      })
    },
    // 计算当月开始星期几
    startWeek(item) {
      return this.calcWeekend(item.year, item.month, 1)
    },

    clickEvent(val, day) {
      let hday = ''
      if ((val.month + 1) < 10) {
        if (day < 10) {
          hday = val.year + '-' + '0' + (val.month + 1) + '-' + '0' + day
        } else {
          hday = val.year + '-' + '0' + (val.month + 1) + '-' + day
        }
      } else {
        if (day < 10) {
          hday = val.year + '-' + (val.month + 1) + '-' + '0' + day
        } else {
          hday = val.year + '-' + (val.month + 1) + '-' + day
        }
      }
      const newHolidayDate = {
        hday: hday,
        content: '',
        isEdit: true

      }

      this.holidayList.push(newHolidayDate)
    },

    saveHoliday(item, index) {
      const tmp = Object.assign({}, item)

      if (tmp.content) {
        const data = {
          hday: tmp.hday,
          content: tmp.content,
          year: this.selectDate[0].year
        }

        if (tmp.id) {
          // tmp.isEdit = true
          data.id = tmp.id
          holidayUpdate(data).then(res => {
            if (res.data.errorCode === 0) {
              tmp.isEdit = false
              this.getHolidayList()
            } else {
              this.$message.error(res.data.errorMessage)
            }
          })
        } else {
          holidayCreate(data).then(res => {
            if (res.data.errorCode === 0) {
              this.getHolidayList()
              tmp.isEdit = false
            } else {
              this.$message.error(res.data.errorMessage)
            }
          })
        }
      } else {
        this.$message.warning('请输入节假日名称')
      }
      // this.holidayList.splice(index, 1, tmp)
    },
    deleteHoliday(item, index) {
      const data = {
        id: item.id
      }
      holidayDelete(data).then(res => {
        if (res.data.errorCode === 0) {
          this.getHolidayList()
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    editHoliday(item, index) {
      const tmp = Object.assign({}, item)
      tmp.isEdit = true
      this.holidayList.splice(index, 1, tmp)
    },

    cancelEdit(item, index) {
      const tmp = Object.assign({}, item)
      tmp.isEdit = false
      this.holidayList.splice(index, 1)
    }

  }
}
</script>

<style lang="scss" scoped>
.holiday-content {
  display: flex;
  height: calc(100vh - 156px);
  overflow: auto;
}
.holiday-content-left {
  max-width: 600px;

  ul > li {
    font-size: 14px;
    /* width: calc(94vw / 7); */
    cursor: pointer;
    // width: 26px;
    // height: 30px;
    // text-align: center;
    // line-height: 30px;
    width: 20px;
    height: 20px;
    font-size: 12px;
    font-family: HelveticaNeue;
    color: #666;
    line-height: 20px;
    text-align: center;
    margin-left: 5px;
    &:hover {
      background-color: #e0f1ff;
    }
  }

  ul li:nth-of-type(7n + 0) {
    color: red;
  }
  ul li:nth-of-type(7n + 1) {
    color: red;
  }
}
.holiday-content-right {
  // max-width: 600px;
  // border: 1px solid #ddd;
  width: 400px;
  height: 720px;
  border-radius: 5px;
  float: left;
  margin-top: 22px;
  ul > li {
    display: flex;
    margin: 10px;
    justify-content: space-between;
    line-height: 30px;
  }
}

.holiday-list {
  border: 1px solid #f0f2f5;
  border-radius: 5px;
}

.holiday-title {
  height: 50px;
  background-color: #f0f2f5;
  line-height: 50px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #333333;
  padding: 0 20px;
  border-radius: 5px 5px 0 0;
  border: 1px solid #f0f2f5;
}
.holiday-item-box {
  height: 670px;
  overflow: auto;
  width: 100%;
  border-top: none;
}
.holiday-edit {
  margin: 0 10px;
}
.active {
  background-color: #46b6ee;
  color: #fff !important;
}

.choice-btn {
  color: #46b6ee;
  cursor: pointer;
}

.calendar-container {
  /* padding: 2vw 3vw;
   */
  display: flex;
  flex-wrap: wrap;
  // width: 600px;
}

.calendar-box {
  width: 184px;

  border: 1px solid #ddd;
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.year {
  text-align: center;
  margin-bottom: 10px;
  height: 30px;
}
.week,
.date {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  list-style: none;
}
.week {
  // border-bottom: 0.5px solid #ddd;
  // margin-bottom: 5px;
  height: 24px;
  background: #f5f5f8;
}

// li:{
//   background-color: #e0f1ff;
//     cursor: pointer;
// }
.none-week {
  color: #aaa;
  visibility: hidden;
}

.month {
  width: 100%;
  height: 28px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  line-height: 30px;
  text-align: center;
  margin-top: 18px;
  color: #333;
  margin: 0;
}
.year > div {
  height: 30px;
  overflow: hidden;
}
.year span {
  line-height: 30px;
  font-size: 20px;
  display: inline-block;
  width: 10%;
}
.year p {
  line-height: 2;
  width: 50%;
  display: inline-block;
}

.activeChoice {
  background-color: #46b6ee;
  color: #ffffff !important;
}
</style>
