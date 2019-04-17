<template>
  <div>
    <el-dialog
      :visible.sync="addAuditionDialogShow"
      :append-to-body="true"
      title="预约试听"
      class="addAuditionDialog_container"
      @close="cancelDialog('addAuditionForm')"
    >
      <el-form
        ref="addAuditionForm"
        :model="addAuditionData"
        :rules="rules"
        label-width="90px"
      >
        <el-form-item
          label="跟进人:"
          prop="people"
        >
          <el-input
            v-model="addAuditionData.people"
            clearable
            placeholder="请输入跟进人"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="跟进学员:"
          prop="orders"
        >
          <el-select
            v-model="addAuditionData.orders"
            :disabled="isDisabledOrder"
            placeholder="请选择当前校区下的跟进学员"
            clearable
            style="width:100%"
            @change="allSelectStuChange"
          >
            <el-option
              v-for="item in allStudentList"
              :key="item.stuId"
              :label="item.stuName"
              :value="item.stuId"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="试听年月:"
          prop="year"
        >
          <el-date-picker
            v-model="addAuditionData.year"
            type="month"
            placeholder="请选择试听年月"
            format="yyyy-MM"
            value-format="yyyy-MM"
            @change="yearMonthChange(addAuditionData.year)"
          />
        </el-form-item>
        <el-form-item
          label="可选日期:"
          prop="data"
        >
          <el-select
            v-model="addAuditionData.data"
            placeholder="请选择可安排试听日期"
            style="width:100%"
            @change="selectClassChange(addAuditionData.data)"
          >
            <el-option
              v-for="item in allSelectDateList"
              :key="item.dateId"
              :label="item.dateId"
              :value="item.dateId"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="选择课程:"
          prop="class"
        >
          <el-select
            v-model="addAuditionData.class"
            placeholder="请选择当前校区下的课程"
            clearable
            style="width:100%"
            @change="selectClassChangeValue(addAuditionData.class)"
          >
            <el-option
              v-for="item in allSeleClassList"
              :key="item.courseId"
              :label="item.courseName"
              :value="item.courseId"
            />
          </el-select>
        </el-form-item>
        <div v-show="isShowClassTable">
          <el-table
            ref="multipleTable"
            :data="addAuditionData.allClassListTable"
            style="width: 100%;margin-bottom: 20px;"
            border
            @row-click="showRow"
          >
            <!-- <el-table-column
              type="selection"
              width="43"
            /> -->
            <el-table-column
              width="50"
              label=""
            >
              <template slot-scope="scope">
                <el-radio
                  v-model="scope.row.id"
                  :label="radioItem"
                  class="radio"
                >&nbsp;</el-radio>
              </template>
            </el-table-column>
            <el-table-column
              label="时段"
              width="90"
            >
              <template slot-scope="scope">{{ scope.row.startTime + '-' + scope.row.endTime }}</template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="课程名称"
              width="90"
            >
              <template slot-scope="scope">{{ scope.row.courseName }}</template>
            </el-table-column>
            <el-table-column
              prop="address"
              label="排课标题"
              width="92"
            >
              <template slot-scope="scope">{{ scope.row.title }}</template>
            </el-table-column>
            <el-table-column
              prop="address"
              label="预约人数"
              width="70"
            >
              <template slot-scope="scope">
                {{ scope.row.maxTryNum == -1 ? scope.row.tryNum+ '/'+(scope.row.maxNum-scope.row.mulStuArr.length-scope.row.stuArr.length) :
                scope.row.tryNum+ '/'+scope.row.maxTryNum }}
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              label="教室"
              width="80"
            >
              <template slot-scope="scope">{{ scope.row.roomName }}</template>
            </el-table-column>
            <el-table-column
              prop="address"
              label="主教"
              width="75"
            >
              <template slot-scope="scope">{{ scope.row.mtNames }}</template>
            </el-table-column>
          </el-table>
        </div>
        <el-form-item
          label="备注:"
          prop="detail"
        >
          <el-input
            v-model="addAuditionData.detail"
            clearable
            type="textarea"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog('addAuditionForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('addAuditionForm')"
        >保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  summaryQueryRead, // 在读学员下拉数据
  leadsSummary, // 名单学员下拉框
  tryDayQuery, // 可试听排课日期
  tryCourseQuery, // 可试听排课课程
  queryCpClass, // 查询排课列表
  createSubscribeAudition // 确定创建预约试听
} from '@/api/crm/auditionMgr/auditionMgr.js'
export default {
  components: {

  },
  data() {
    return {
      addAuditionDialogShow: false,
      isShowClassTable: true, // 是否显示课程表格
      addAuditionData: {
        people: '',
        orders: '', // 跟进名单
        year: '', // 试听年月
        data: '', // 可选日期
        class: '', // 选择课程
        detail: '', // 备注
        allClassListTable: [] // 所有可选课程表格数据
      },
      radioItem: '',
      selected: {}, // 课程被选的数据
      rules: {
        orders: [
          { required: true, message: '请选择跟进名单', trigger: 'change' }
        ],
        year: [
          { required: true, message: '请选择试听年月', trigger: 'change' }
        ],
        data: [
          { required: true, message: '请选择可选日期', trigger: 'change' }
        ],
        detail: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ]
      },
      allStudentList: [], // 名单学员下拉数据
      allSelectDateList: [], // 所有可选日期数据
      allSeleClassList: [], // 所有选择课程下拉数据
      isDisabledOrder: false,
      typeAdd: '',
      rowInfo: {},
      sourceType: '',
      stuId: '' // 跟进名单id
      // allClassListTable: [] // 所有可选课程表格数据
    }
  },
  methods: {
    /* 显示弹框 */
    showDialog(type = '', rowlist = {}) {
      this.rowInfo = rowlist
      this.typeAdd = type
      this.sourceType = rowlist.source || ''
      if(type == 'edit') { //eslint-disable-line
        this.isDisabledOrder = true
        this.$nextTick(() => {
          this.addAuditionData.orders = rowlist.name
          this.stuId = rowlist.id
        })
      } else {
        this.allStudentList = []
        this.leadsSummaryFun()
        this.summaryQueryReadFun()
        this.isDisabledOrder = false
      }
      this.addAuditionData.people = this.$store.getters.name
      this.isShowClassTable = false
      this.addAuditionDialogShow = !this.addAuditionDialogShow
    },
    /* 关闭弹框 */
    cancelDialog(formName) {
      this.addAuditionDialogShow = false
      this.$refs[formName].resetFields()
    },
    /* 学员名单下拉框列表 */
    leadsSummaryFun() {
      leadsSummary().then(res => {
        if (res.data.errorCode === 0) {
          const lantenStudent = res.data.results
          lantenStudent && lantenStudent.length > 0 && lantenStudent.map(item => {
            this.allStudentList.push(item)
          })
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 在读学员下拉框列表 */
    summaryQueryReadFun() {
      summaryQueryRead().then(res => {
        if (res.data.errorCode === 0) {
          const readStudent = res.data.results
          readStudent && readStudent.length > 0 && readStudent.map(item => {
            this.allStudentList.push(item)
          })
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 跟进学员下拉值改变 */
    allSelectStuChange(value) {
      this.allStudentList && this.allStudentList.length > 0 && this.allStudentList.map(item => {
        if(value == item.stuId) { //eslint-disable-line
          this.sourceType = item.source
          this.stuId = item.stuId
        }
      })
    },
    /* 试听年月值改变 */
    yearMonthChange(value) {
      if (value && value.length > 0) {
        this.tryDayQueryFun(value)
        this.isShowClassTable = false
        this.addAuditionData.data = ''
        this.allSelectDateList = []
        this.addAuditionData.class = ''
        this.allSeleClassList = []
      } else {
        this.isShowClassTable = false
        this.addAuditionData.data = ''
        this.allSelectDateList = []
        this.addAuditionData.class = ''
        this.allSeleClassList = []
      }
    },
    /* 可试听排课日期 */
    tryDayQueryFun(date) {
      const params = {
        month: date
      }
      tryDayQuery(params).then(res => {
        if (res.data.errorCode === 0) {
          const allDateListData = res.data.dayList
          allDateListData && allDateListData.map(item => {
            this.allSelectDateList.push({ dateId: item })
          })
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 可选日期值改变 */
    selectClassChange(value) {
      if (value && value.length > 0) {
        this.tryCourseQueryFun(value)
        this.queryCpClassFun('1', value)
        this.isShowClassTable = true
        this.addAuditionData.class = ''
      } else {
        this.isShowClassTable = false
        this.addAuditionData.class = ''
      }
    },
    /* 可试听排课课程数据 */
    tryCourseQueryFun(date) {
      const params = {
        studyDate: date
      }
      tryCourseQuery(params).then(res => {
        if (res.data.errorCode === 0) {
          this.allSeleClassList = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 选择课程下拉框值改变 */
    selectClassChangeValue(value) {
      this.queryCpClassFun('2', value)
    },
    /* 查询排课列表数据 */
    queryCpClassFun(type, date) {
      let params = {}
      if(type && type == '1') { //eslint-disable-line
        params = {
          startDate: date,
          endDate: date,
          canTry: '1',
          pageIndex: 0,
          pageSize: 999999
        }
      } else {
        params = {
          courseId: date,
          startDate: this.addAuditionData.data,
          endDate: this.addAuditionData.data,
          canTry: '1',
          pageIndex: 0,
          pageSize: 999999
        }
      }
      queryCpClass(params).then(res => {
        if (res.data.errorCode === 0) {
          this.addAuditionData.allClassListTable = res.data.results
          this.addAuditionData.allClassListTable.map((item, index) => {
            item.id = index
          })
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    // 被选课程赋值给radio
    showRow(row) {
      this.radioItem = row.id
      this.selected = row
    },
    /* 确定新增预约试听信息 */
    createSubscribeAuditionFun() {
      const params = {
        stuId: this.stuId, // 学员id
        pcId: this.selected.cpdId, // 课程id
        cpdId: this.selected.cpdId,
        courseName: this.selected.courseName, // 课程名称
        auditionTime: this.selected.studyDate + ' ' + this.selected.startTime, // 开始时间
        auditionEndTime: this.selected.studyDate + ' ' + this.selected.endTime, // 结束时间
        remark: this.addAuditionData.detail, // 备注
        source: this.sourceType, // 来源
        cpmId: this.selected.cpmId // 排课编号
        // subscribeCreateType: '' // 预约试听是否进行人数试听人数满员校
      }
      createSubscribeAudition(params).then(res => {
        if (res.data.errorCode === 0) {
          this.addAuditionDialogShow = false
          this.$message.success(res.data.errorMessage)
          if(this.typeAdd == 'edit') { //eslint-disable-line
            this.$emit('toOfflineDetailPage', params)
            this.$emit('toOfflinePage')
          } else {
            this.$emit('toOfflinePage')
          }
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 确定提交弹框表单内容 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (JSON.stringify(this.selected) != "{}") { //eslint-disable-line
            this.createSubscribeAuditionFun()
          } else {
            this.$message.warning('请选择预约排课')
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.addAuditionDialog_container /deep/ {
  .el-dialog {
    width: 600px !important;
  }
}
</style>

