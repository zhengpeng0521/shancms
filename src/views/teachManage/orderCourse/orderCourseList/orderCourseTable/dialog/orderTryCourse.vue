<template>
  <div class="updateSignType">
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      title="预约试听"
      width="400px"
      @close="resetForm('ruleForm')"
    >
      <div>
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="70px"
        >
          <el-form-item label="类型：">
            <el-radio-group
              v-model="ruleForm.orderType"
              @change="orderTypeChange"
            >
              <el-radio label="1">学员</el-radio>
              <el-radio label="2">名单</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="ruleForm.orderType == '1' || ruleForm.orderType == ''"
            prop="stuId"
            label="姓名："
          >
            <el-select
              v-model="ruleForm.stuId"
              filterable
              placeholder="选择学员"
              style="width:200px"
            >
              <el-option
                v-for="item in newStuList"
                :key="item.stuId"
                :label="item.stuName"
                :value="item.stuId"
              />
            </el-select>
            <span
              class="search"
              @click="actSearch()"
            >精确查找</span>
          </el-form-item>
          <el-form-item
            v-if="ruleForm.orderType == '2'"
            label="姓名："
            prop="list"
          >
            <el-select
              v-model="ruleForm.list"
              filterable
              placeholder="选择名单"
              style="width:200px"
            >
              <el-option
                v-for="item in list"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <span
              class="search"
              @click="actSearchList()"
            >精确查找</span>
          </el-form-item>
        </el-form>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="resetForm('ruleForm')"
        >取消</el-button>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
        >确定</el-button>
      </span>
    </el-dialog>
    <SingleSelectStu
      v-if="isSingleSelect"
      ref="selectStu"
      @toParent="getCheckList"
      @close="toCloseStu"
    />
    <SingleSelectList
      v-if="isSingleList"
      ref="selectList"
      @toParent="getSelectList"
      @toClose="toCloseList"
    />
    <ContinueTry
      ref="continueTry"
      @toUpdateOnceOrder="getUpdateOnceOrder"
    />
  </div>
</template>
<script>
import SingleSelectStu from './singleSelectStu'
import SingleSelectList from './singleSelectList'
import ContinueTry from './continueTry'
// import { getStuChooseList } from '@/api/course'
import { stuSummaryQuery, queryClueStuList, getAvailableStatus, clueStuSummaryQuery, tryCreate } from '@/api/teachManage/orderCourse'
import { queryCRMStuList } from '@/api/teachManage/grade'
export default {
  components: {
    SingleSelectStu,
    SingleSelectList,
    ContinueTry
  },
  data() {
    return {
      dialogVisible: false,
      ruleForm: {
        orderType: '', // 类型
        stuId: '', // 学员
        list: '' // 名单
      },
      rules: {
        orderType: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ]
      },
      newStuList: [],
      list: [],
      detailList: {}, // 详细信息
      isSingleSelect: false,
      isSingleList: false
    }
  },
  methods: {
    show(val, detail) {
      this.dialogVisible = true
      this.ruleForm.orderType = ''
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })
      this.detailList = detail
    },
    /* 学员列表 */
    getStuList() {
      this.newStuList = []
      stuSummaryQuery({ type: '2' }).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          const stuList = data.results
          stuList.map((item, index) => {
            const stuObj = {}
            let name = ''
            if (this.detailList.courseAgeType == '1') { //eslint-disable-line
              name = item.stuName + '(' + item.month + '月)'
            } else {
              name = item.stuName + '(' + Math.floor(item.month / 12) + '岁)'
            }
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
            if (this.detailList.courseAgeType == '1') { //eslint-disable-line
              name = item.clueName + '(' + item.month + '月)'
            } else {
              name = item.clueName + '(' + Math.floor(item.month / 12) + '岁)'
            }
            stuObj.name = name
            stuObj.id = item.clueId
            this.list.push(stuObj)
          })
        } else {
          this.$message.error(data.errorMessage || '学员名单失败')
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.ruleForm.orderType == '1') { //eslint-disable-line
            if (this.ruleForm.stuId) {
              const params = {
                cpmId: this.detailList.cpmId,
                cpdId: this.detailList.cpdId
              }
              getAvailableStatus(params).then(res => {
                const data = res.data
                if (data.errorCode === 0) {
                  if (data.availableTryNumStatus) {
                    this.$refs.continueTry.show(this.detailList, this.ruleForm.stuId, '1')
                  } else {
                    const startDate = this.detailList.studyDate + ' ' + this.detailList.startTime
                    const endDate = this.detailList.studyDate + ' ' + this.detailList.endTime
                    const payload = {
                      stuId: this.ruleForm.stuId,
                      auditionTime: startDate,
                      auditionEndTime: endDate,
                      courseName: this.detailList.courseName,
                      source: '1',
                      cpmId: this.detailList.cpmId,
                      cpdId: this.detailList.cpdId,
                      subscribeCreateType: '1'
                    }
                    tryCreate(payload).then(res => {
                      const data = res.data
                      if (data.errorCode === 0) {
                        this.dialogVisible = false
                        this.$message.success(data.errorMessage)
                        this.$emit('toUpdateOnceOrder', this.detailList)
                      } else {
                        this.$message.error(data.errorMessage || '预约试听失败')
                      }
                    })
                  }
                } else {
                  this.$message.error(data.errorMessage)
                }
              })
            } else {
              this.$message.error('请选择学员')
            }
          } else if (this.ruleForm.orderType == '2') { //eslint-disable-line
            if (this.ruleForm.list) {
              const params = {
                cpmId: this.detailList.cpmId,
                cpdId: this.detailList.cpdId
              }
              getAvailableStatus(params).then(res => {
                const data = res.data
                if (data.errorCode === 0) {
                  if (data.availableTryNumStatus) {
                    this.$refs.continueTry.show(this.detailList, this.ruleForm.list, '2')
                  } else {
                    const startDate = this.detailList.studyDate + ' ' + this.detailList.startTime
                    const endDate = this.detailList.studyDate + ' ' + this.detailList.endTime
                    const payload = {
                      stuId: this.ruleForm.list,
                      auditionTime: startDate,
                      auditionEndTime: endDate,
                      courseName: this.detailList.courseName,
                      source: '2',
                      cpmId: this.detailList.cpmId,
                      cpdId: this.detailList.cpdId,
                      subscribeCreateType: '1'
                    }
                    tryCreate(payload).then(res => {
                      const data = res.data
                      if (data.errorCode === 0) {
                        this.dialogVisible = false
                        this.$message.success(data.errorMessage)
                        this.$emit('toUpdateOnceOrder', this.detailList)
                      } else {
                        this.$message.error(data.errorMessage || '预约试听失败')
                      }
                    })
                  }
                } else {
                  this.$message.error(data.errorMessage)
                }
              })
            } else {
              this.$message.error('请选择名单')
            }
          }
        } else {
          return false
        }
      })
    },
    toCloseStu() {
      this.isSingleSelect = false
    },
    toCloseList() {
      this.isSingleList = false
    },
    resetForm(formName) {
      this.dialogVisible = false
      this.ruleForm.stuId = ''
      this.ruleForm.list = ''
      this.$refs['ruleForm'].clearValidate()
    },
    /* 类型切换 */
    orderTypeChange(val) {
      this.ruleForm.stuId = ''
      this.ruleForm.list = ''
      this.$refs['ruleForm'].clearValidate()
      if (val == '1') { //eslint-disable-line
        if (this.detailList) {
          this.getStuList()
        }
      } else if (val == '2') { //eslint-disable-line
        this.clueStuSummaryQuery()
      }
    },
    /* 精确查找 */
    actSearch() {
      this.isSingleSelect = true
      let list = []
      if (this.ruleForm.stuId) {
        const params = {
          type: '2'
        }
        queryCRMStuList(params).then(res => {
          const data = res.data
          if (data.errorCode === 0) {
            list = data.results
            list.map(item => {
            if (item.id == this.ruleForm.stuId) { //eslint-disable-line
                this.$nextTick(() => {
                  this.$refs.selectStu.show(item)
                })
              }
            })
          }
        })
      } else {
        this.$nextTick(() => {
          this.$refs.selectStu.show()
        })
      }
    },
    /* 名单精确查找 */
    actSearchList() {
      this.isSingleList = true
      let list = []
      if (this.ruleForm.list) {
        const params = {
          pageSize: 20,
          pageIndex: 0
        }
        queryClueStuList(params).then(res => {
          const data = res.data
          if (data.errorCode === 0) {
            list = data.results
            list.map(item => {
            if (item.id == this.ruleForm.list) { //eslint-disable-line
                this.$nextTick(() => {
                  this.$refs.selectList.show(item)
                })
              }
            })
          }
        })
      } else {
        this.$nextTick(() => {
          this.$refs.selectList.show()
        })
      }
    },
    /* 获取精确查找的数据 */
    getCheckList(val) {
      console.info('val stuId', val)
      this.ruleForm.stuId = val
    },
    /* 获取名单精确 */
    getSelectList(val) {
      console.info(val, 'val')
      this.ruleForm.list = val
    },
    getUpdateOnceOrder(detail) {
      this.$emit('toUpdateOnceOrder', detail)
    }
  }
}
</script>
<style lang="scss" scoped>
.search {
  color: #46b6ee;
  cursor: pointer;
  float: right;
}
</style>
