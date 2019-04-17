// import DatePicker from '@/components/date-picker/index'
import DayCopy from './dayCopy/classDayCopy.vue'
import WeekCopy from './weekCopy/classWeekCopy.vue'
export default {
  components: {
    // DatePicker
    DayCopy,
    WeekCopy
  },
  data() {
    return {
      activeName: 'week',
      isShow: false // 日复制显示
    }
  },
  methods: {
    handleClick(tab) {
      if (tab.paneName === 'day') {
        this.isShow = true
        this.$nextTick(() => {
          this.$refs.day.clearSelection()
        })
      } else if (tab.paneName === 'week') {
        this.$refs.week.clearSelection()
      }
    }
  }
}
