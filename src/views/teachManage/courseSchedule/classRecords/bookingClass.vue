<template>
  <div class="bookingClass">
    <div class="common_block">
      <div class="title_block" />
      <div class="title_content">预约上课</div>
    </div>
    <el-form label-width="100px">
      <div class="form_content">
        <el-form-item label="预约上课：">
          <el-radio-group
            v-model="orderClass"
            @change="orderChange"
          >
            <el-radio label="1">选择在读学员</el-radio>
            <el-radio label="2">选择班级</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="orderClass=='1'">
          <el-select
            v-model="classStu"
            multiple
            filterable
            placeholder="选择在读学员"
          >
            <el-option
              v-for="item in newStuList"
              :key="item.stuId"
              :label="item.stuName"
              :value="item.stuId"
            />
          </el-select>
          <div
            class="actSearch"
            @click="accurateSearch('classStu')"
          >精确查找</div>
        </el-form-item>
        <el-form-item v-if="orderClass=='2'">
          <el-select
            v-model="gradeChoose"
            placeholder="选择班级"
            filterable
          >
            <el-option
              v-for="item in gradeList"
              :key="item.clsId"
              :label="item.clsName"
              :value="item.clsId"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="isRepeat"
          label="预约补课："
        >
          <el-select
            v-model="missLesson"
            multiple
            placeholder="选择在读学员"
            filterable
          >
            <el-option
              v-for="item in newStuList"
              :key="item.stuId"
              :label="item.stuName"
              :value="item.stuId"
            />
          </el-select>
          <div
            class="actSearch"
            @click="accurateSearch('missLesson')"
          >精确查找</div>
        </el-form-item>
        <el-form-item
          v-if="isRepeat"
          label="预约试听："
        >
          <el-radio-group v-model="orderTry">
            <el-radio label="1">选择在读学员</el-radio>
            <el-radio label="2">选择潜在学员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="orderTry=='1' && isRepeat">
          <el-select
            v-model="tryStuChoose"
            multiple
            filterable
            placeholder="选择在读学员"
          >
            <el-option
              v-for="item in newStuList"
              :key="item.stuId"
              :label="item.stuName"
              :value="item.stuId"
            />
          </el-select>
          <div
            class="actSearch"
            @click="accurateSearch('tryStuChoose')"
          >精确查找</div>
        </el-form-item>
        <el-form-item v-if="orderTry=='2' && isRepeat">
          <el-select
            v-model="tryChooseList"
            multiple
            filterable
            placeholder="选择潜在学员"
          >
            <el-option
              v-for="item in list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <div
            class="actSearch"
            @click="listSearch"
          >精确查找</div>
        </el-form-item>
        <el-button
          :loading="submitLoading"
          type="primary"
          @click="submit"
        >生成</el-button>
      </div>
    </el-form>
    <SelectStudent
      v-if="isShow"
      ref="selectStu"
      @toParent="getSelectData"
      @toclose="close"
    />
    <SelectList
      v-if="isListShow"
      ref="selectList"
      @toParent="getListSelectData"
      @toclose="closeList"
    />
    <OrderCourseSuccess
      ref="orderCourseSuccess"
      @toUpdateForm="getUpdateForm"
      @toUpdateTable="getUpdateTable"
    />
    <!-- 预约上课异常提示 -->
    <BookingError ref="bookingError" />
  </div>
</template>
<script>
import SelectStudent from './dialog/selectStudent'
import SelectList from './dialog/selectList'
import BookingError from './dialog/bookingError'

import OrderCourseSuccess from './dialog/orderCourseSuccess'
import { stuSummaryQuery, classGradeSummary, stuCreateOrMul, clueStuSummaryQuery } from '@/api/teachManage/arrangeCourse'
export default {
  components: {
    SelectStudent,
    SelectList,
    OrderCourseSuccess,
    BookingError
  },
  props: {
    rowInfo: {
      type: Object,
      default: () => {
        return {}
      }  //eslint-disable-line
    },
    createList: {
      type: Object,
      default: () => {
        return {}
      }  //eslint-disable-line
    }
  },
  data() {
    return {
      orderClass: '1', // 预约上课
      classStu: [], // 预约上课选择学员
      gradeChoose: '', // 预约上课选择班级
      missLesson: '', // 预约补课的选择学员
      orderTry: '1', // 预约试听
      tryStuChoose: [], // 预约试听的选择学员
      tryChooseList: [], // 预约试听的选择名单
      newStuList: [], // 学员列表
      gradeList: [], // 班级列表
      list: [], // 名单列表
      isShow: false, // 学员选择列表显示
      isListShow: false, // 名单列表显示
      isRepeat: false,
      startDate: '',
      endDate: '',
      submitLoading: false // 保存的loading事件
    }
  },
  mounted() {
    this.getStuList()
    this.clueStuSummaryQuery()
  },
  methods: {
    show(val, start, end, courseId) {
      if (val) {
        if (val == '0') { //eslint-disable-line
          this.isRepeat = true
      } else if (val == '1') { //eslint-disable-line
          this.isRepeat = false
        }
      }
      if (courseId) {
        const params = {
          courseId: courseId
        }
        classGradeSummary(params).then(res => {
          const data = res.data
          if (data.errorCode === 0) {
            this.gradeList = data.results
          } else {
            this.$message.error(data.errorMessage || '获取班级摘要列表失败')
          }
        })
      }
      this.startDate = start
      this.endDate = end
    },
    /* 继续排课 */
    getUpdateForm(val) {
      this.$emit('toUpdateForm', val)
    },
    /* 查看 */
    getUpdateTable() {
      this.$emit('toUpdateTable', this.startDate, this.endDate)
    },
    /* 学员列表 */
    getStuList() {
      stuSummaryQuery({ type: '2', pageSize: 99999 }).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          const stuList = data.results
          stuList.map((item, index) => {
            const stuObj = {}
            const name = item.stuName + ' (' + item.month + '月)'
            stuObj.stuName = name
            stuObj.stuId = item.stuId
            this.newStuList.push(stuObj)
          })
        } else {
          this.$message.error(data.errorMessage || '获取学员摘要列表失败')
        }
      })
    },
    /* 名单列表摘要 */
    clueStuSummaryQuery() {
      this.list = []
      clueStuSummaryQuery().then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          const list = data.list
          list.map((item, index) => {
            const stuObj = {}
            let name = ''
            name = item.clueName + '(' + item.month + '月)'
            stuObj.name = name
            stuObj.id = item.clueId
            this.list.push(stuObj)
          })
        } else {
          this.$message.error(data.errorMessage || '学员名单失败')
        }
      })
    },
    orderChange(val) {

    },
    /* 生成 */
    submit() {
      const cpdIds = this.createList.cpdIdList && this.createList.cpdIdList.join(',')
      const stuIds = this.classStu && this.classStu.join(',')
      const mulStuIds = this.missLesson && this.missLesson.join(',')
      let clueStuIds = ''
      if (this.orderTry == '1') { //eslint-disable-line
        clueStuIds = this.tryStuChoose && this.tryStuChoose.join(',')
      } else if (this.orderTry == '2') { //eslint-disable-line
        clueStuIds = this.tryChooseList && this.tryChooseList.join(',')
      }
      const params = {
        cpmId: this.createList.cpmId,
        cpdIds: cpdIds,
        status: '1',
        mulCpmId: this.createList.cpmId,
        mulCpdIds: cpdIds,
        audittionTime: this.createList.audittionTime,
        auditionEndTime: this.createList.auditionEndTime,
        courseName: this.createList.courseName,
        source: this.orderTry,
        stuId: stuIds,
        mulStuId: mulStuIds,
        clueStuId: clueStuIds,
        clsId: this.gradeChoose
      }
      this.submitLoading = true
      stuCreateOrMul(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.$refs.orderCourseSuccess.show()
        } else {
          if (data.type === 1 || data.type === 2 || data.type === 3 || data.type === 4 || data.type === 5) {
            this.$refs.bookingError.show(data)
          } else {
            this.$message.error(!data.errorMessageMain ? data.errorMessage : ((data.errorMessageMain && (data.errorMessageMain + ',')) + data.errorMessage) || '学员约课失败')
          }
        }
        this.submitLoading = false
      })
    },
    /* 精选查找 */
    accurateSearch(type) {
      if (type == 'classStu') { //eslint-disable-line
        this.isShow = true
        this.$nextTick(() => {
          this.$refs.selectStu.show('1', this.classStu)
        })
      } else if (type == 'missLesson') { //eslint-disable-line
        this.isShow = true
        this.$nextTick(() => {
          this.$refs.selectStu.show('2', this.missLesson)
        })
      } else if(type == 'tryStuChoose') { //eslint-disable-line
        this.isShow = true
        this.$nextTick(() => {
          this.$refs.selectStu.show('3', this.tryStuChoose)
        })
      }
    },
    close(val) {
      this.isShow = val
    },
    closeList(val) {
      this.isListShow = val
    },
    /* 名单的精确查找 */
    listSearch() {
      this.isListShow = true
      this.$nextTick(() => {
        this.$refs.selectList.show(this.tryChooseList)
      })
    },
    getSelectData(val, type) {
      if (type == '1') { //eslint-disable-line
        this.classStu = val
      } else if (type == '2') { //eslint-disable-line
        this.missLesson = val
      } else if(type == '3') { //eslint-disable-line
        this.tryStuChoose = val
      }
    },
    getListSelectData(val) {
      this.tryChooseList = val
    }
  }
}
</script>
<style lang="scss" scoped>
.bookingClass {
  padding: 5px 20px 0 20px;
  .common_block {
    margin-top: 15px;
    overflow: hidden;
    height: 25px;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -webkit-box-pack: start;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 10px;
    .title_block {
      height: 14px;
      width: 8px;
      background: #46b6ee;
      margin-right: 10px;
      border-radius: 3px;
    }
    .title_content {
      line-height: 25px;
    }
  }
  .form_content {
    width: 1000px;
    -webkit-box-orient: horizontal;
    flex-direction: row;
    flex-wrap: wrap;
    -webkit-box-direction: normal;
    .actSearch {
      display: inline-block;
      margin-left: 10px;
      color: #46b6ee;
      cursor: pointer;
    }
  }
}
</style>
