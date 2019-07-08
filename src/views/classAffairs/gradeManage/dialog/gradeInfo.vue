<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    title="班级信息"
    width="600px"
  >
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item
        label="托班类型："
        prop="clsType"
      >
        <el-select
          v-model="ruleForm.clsType"
          placeholder="请选择托班类型"
          style="width:100%"
          filterable
          @change="setClsName('clsType')"
        >
          <el-option
            v-for="item in classTypeList"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="学员大小："
        prop="month"
      >
        <el-radio-group
          v-model="ruleForm.month"
          @change="setClsName('month')"
        >
          <el-radio label="1">月龄</el-radio>
          <el-radio label="2">年龄</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="ruleForm.month == '1'">
        <el-form-item
          label="最小月龄："
          prop="min"
        >
          <el-input
            :min="1"
            v-model.number="ruleForm.min"
            placeholder="最小月龄"
            type="number"
            @change="setClsName('min')"
          />
        </el-form-item>
        <el-form-item
          label="最大月龄："
          prop="max"
        >
          <el-input
            :min="1"
            v-model.number="ruleForm.max"
            placeholder="最大月龄"
            type="number"
            @change="setClsName('max')"
          />
        </el-form-item>
        <el-form-item
          label="班级名称："
          prop="clsName"
        >
          <el-input
            v-model="ruleForm.clsName"
            placeholder="请输入班级名称"
          />
        </el-form-item>
      </div>
      <div v-if="ruleForm.month == '2'">
        <el-form-item
          label="最小年龄："
          prop="minAge"
        >
          <el-input
            :min="1"
            v-model.number="ruleForm.minAge"
            placeholder="最小年龄"
            type="number"
            @change="setClsName('minAge')"
          />
        </el-form-item>
        <el-form-item
          label="最大年龄："
          prop="maxAge"
        >
          <el-input
            :min="1"
            v-model.number="ruleForm.maxAge"
            placeholder="最大年龄"
            type="number"
            @change="setClsName('maxAge')"
          />
        </el-form-item>
        <el-form-item
          label="班级名称："
          prop="clsName"
        >
          <el-input
            v-model="ruleForm.clsName"
            placeholder="请输入班级名称"
          />
        </el-form-item>
      </div>
      <el-form-item
        label="主教："
        prop="mTeachers"
      >
        <el-select
          v-model="ruleForm.mTeachers"
          placeholder="请选择主教"
          multiple
          filterable
          style="width:100%"
        >
          <el-option
            v-for="item in teacherList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="助教：">
        <el-select
          v-model="ruleForm.aTeachers"
          placeholder="请选择助教"
          multiple
          filterable
          style="width:100%"
        >
          <el-option
            v-for="item in teacherList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="保育员：">
        <el-select
          v-model="ruleForm.nurserys"
          placeholder="请选择保育员"
          multiple
          filterable
          style="width:100%"
        >
          <el-option
            v-for="item in teacherList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="教室："
        prop="clsRoomId"
      >
        <el-select
          v-model="ruleForm.clsRoomId"
          placeholder="请选择教室"
          style="width:100%"
          filterable
        >
          <el-option
            v-for="item in classroomList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="预招人数："
        prop="number"
      >
        <el-input
          :min="0"
          v-model.number="ruleForm.number"
          type="number"
          placeholder="预招人数"
        />
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        class="cancel_btn"
        @click="resetForm"
      >取消</el-button>
      <el-button
        type="primary"
        @click="submitForm"
      >保存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { queryClassroomList, getClassType, tenantUserSummaryQuery, createClass } from '@/api/nurseryClass/gradeManage'
export default {
  data() {
    /* 校验最大人数*/
    var checkMaxNum = (rule, value, callback) => {
      if (!(/^[1-9][0-9]*$/.test(value))) {
        callback('只能输入大于0的正整数')
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      ruleForm: {
        clsType: '',
        month: '1',
        min: '',
        max: '',
        minAge: '',
        maxAge: '',
        clsName: '',
        mTeachers: [],
        aTeachers: [],
        nurserys: [],
        clsRoomId: '',
        number: ''
      },
      rules: {
        clsType: [
          { required: true, message: '请选择托班类型', trigger: 'change' }
        ],
        month: [
          { required: true, message: '请选择学员大小', trigger: 'change' }
        ],
        min: [
          { required: true, message: '请输入最小月龄', trigger: 'change' },
          { validator: checkMaxNum }
        ],
        minAge: [
          { required: true, message: '请输入最小年龄', trigger: 'change' },
          { validator: checkMaxNum }
        ],
        max: [
          { required: true, message: '请输入最大月龄', trigger: 'change' },
          { validator: checkMaxNum }
        ],
        maxAge: [
          { required: true, message: '请输入最大年龄', trigger: 'change' },
          { validator: checkMaxNum }
        ],
        clsName: [
          { required: true, message: '班级名称', trigger: 'change' }
        ],
        mTeachers: [
          { required: true, message: '请选择主教', trigger: 'change' }
        ],
        clsRoomId: [
          { required: true, message: '请选择教室', trigger: 'change' }
        ],
        number: [
          { required: true, message: '请输入预招人数', trigger: 'change' }
        ]
      },
      classTypeList: [],
      teacherList: [],
      classroomList: []
    }
  },
  methods: {
    show() {
      this.getClassType()
      this.getTeacher()
      this.getClassroomList()
      this.dialogVisible = true
    },
    /* 获取托班类型 */
    getClassType() {
      const params = {
        dictkey: 'nurseryType'
      }
      getClassType(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.classTypeList = data.results
        } else {
          this.$message.error(data.errorMessage || '获取托班列表失败')
        }
      })
    },
    /* 教师列表 */
    getTeacher() {
      tenantUserSummaryQuery().then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.teacherList = data.results
        } else {
          this.$message.error(data.errorMessage || '获取员工列表失败')
        }
      })
    },
    /* 教室列表 */
    getClassroomList() {
      const params = {
        status: '1'
      }
      queryClassroomList(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.classroomList = data.results
        } else {
          this.$message.error(data.errorMessage || '获取教室列表失败')
        }
      })
    },
    /* 生成班级名称 */
    setClsName(type) {
      const month = this.ruleForm.month == '2' ? '岁' : '个月' //eslint-disable-line
      if (this.ruleForm.month == '1') { //eslint-disable-line
        if (type == 'clsType') { //eslint-disable-line
          let clsName = ''
          if (this.ruleForm.min && this.ruleForm.max) {
            this.classTypeList.map((item, index) => {
              if (item.key == this.ruleForm.clsType) { //eslint-disable-line
                clsName = item.value
              }
            })
            this.ruleForm.clsName = clsName + '班' + this.ruleForm.min + month + '-' + this.ruleForm.max + month
          }
        } else if (type == 'month') { //eslint-disable-line
          let clsName = ''
          if (this.ruleForm.clsType && this.ruleForm.min && this.ruleForm.max) {
            this.classTypeList.map((item, index) => {
              if (item.key == this.ruleForm.clsType) { //eslint-disable-line
                clsName = item.value
              }
            })
            this.ruleForm.clsName = clsName + '班' + this.ruleForm.min + month + '-' + this.ruleForm.max + month
          }
        } else if (type == 'min') { //eslint-disable-line
          let clsName = ''
          if (this.ruleForm.clsType && this.ruleForm.min && this.ruleForm.max) {
            this.classTypeList.map((item, index) => {
              if (item.key == this.ruleForm.clsType) { //eslint-disable-line
                clsName = item.value
              }
            })
            this.ruleForm.clsName = clsName + '班' + this.ruleForm.min + month + '-' + this.ruleForm.max + month
          }
        } else if (type == 'max') { //eslint-disable-line
          let clsName = ''
          if (this.ruleForm.clsType && this.ruleForm.min && this.ruleForm.max) {
            this.classTypeList.map((item, index) => {
              if (item.key == this.ruleForm.clsType) { //eslint-disable-line
                clsName = item.value
              }
            })
            this.ruleForm.clsName = clsName + '班' + this.ruleForm.min + month + '-' + this.ruleForm.max + month
          }
        }
      } else if (this.ruleForm.month == '2') { //eslint-disable-line
        if (type == 'clsType') { //eslint-disable-line
          let clsName = ''
          if (this.ruleForm.minAge && this.ruleForm.maxAge) {
            this.classTypeList.map((item, index) => {
              if (item.key == this.ruleForm.clsType) { //eslint-disable-line
                clsName = item.value
              }
            })
            this.ruleForm.clsName = clsName + '班' + this.ruleForm.minAge + month + '-' + this.ruleForm.maxAge + month
          }
        } else if (type == 'month') { //eslint-disable-line
          let clsName = ''
          if (this.ruleForm.clsType && this.ruleForm.minAge && this.ruleForm.maxAge) {
            this.classTypeList.map((item, index) => {
              if (item.key == this.ruleForm.clsType) { //eslint-disable-line
                clsName = item.value
              }
            })
            this.ruleForm.clsName = clsName + '班' + this.ruleForm.minAge + month + '-' + this.ruleForm.maxAge + month
          }
        } else if (type == 'minAge') { //eslint-disable-line
          let clsName = ''
          if (this.ruleForm.clsType && this.ruleForm.minAge && this.ruleForm.maxAge) {
            this.classTypeList.map((item, index) => {
              if (item.key == this.ruleForm.clsType) { //eslint-disable-line
                clsName = item.value
              }
            })
            this.ruleForm.clsName = clsName + '班' + this.ruleForm.minAge + month + '-' + this.ruleForm.maxAge + month
          }
        } else if (type == 'maxAge') { //eslint-disable-line
          let clsName = ''
          if (this.ruleForm.clsType && this.ruleForm.minAge && this.ruleForm.maxAge) {
            this.classTypeList.map((item, index) => {
              if (item.key == this.ruleForm.clsType) { //eslint-disable-line
                clsName = item.value
              }
            })
            this.ruleForm.clsName = clsName + '班' + this.ruleForm.minAge + month + '-' + this.ruleForm.maxAge + month
          }
        }
      }
    },
    submitForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.ruleForm.month == '1') { //eslint-disable-line
            if (this.ruleForm.max < this.ruleForm.min) {
              this.$message.error('最大月龄不能小于最小月龄')
              return
            }
          } else {
            if (this.ruleForm.maxAge < this.ruleForm.minAge) {
              this.$message.error('最大年龄不能小于最小年龄')
              return
            }
          }
          let max = ''
          let min = ''
          if (this.ruleForm.month == '1') { //eslint-disable-line
            min = this.ruleForm.min
            max = this.ruleForm.max
          } else if (this.ruleForm.month == '2') { //eslint-disable-line
            min = this.ruleForm.minAge
            max = this.ruleForm.maxAge
          }
          let aTeachers = ''
          if (this.ruleForm.aTeachers !== '' && this.ruleForm.aTeachers != null && this.ruleForm.aTeachers !== undefined) {
            aTeachers = this.ruleForm.aTeachers.join(',')
          }
          let mTeachers = ''
          if (this.ruleForm.mTeachers !== '' && this.ruleForm.mTeachers != null && this.ruleForm.mTeachers !== undefined) {
            mTeachers = this.ruleForm.mTeachers.join(',')
          }
          let nurserys = ''
          if (this.ruleForm.nurserys !== '' && this.ruleForm.nurserys != null && this.ruleForm.nurserys !== undefined) {
            nurserys = this.ruleForm.nurserys.join(',')
          }
          const params = {
            clsRoomId: this.ruleForm.clsRoomId,
            clsType: this.ruleForm.clsType,
            month: this.ruleForm.month,
            max: max,
            min: min,
            clsName: this.ruleForm.clsName,
            aTeachers: aTeachers,
            mTeachers: mTeachers,
            nurserys: nurserys,
            number: this.ruleForm.number
          }
          createClass(params).then(res => {
            const data = res.data
            if (data.errorCode === 0) {
              this.dialogVisible = false
              this.$emit('toUpdateTable')
              this.$refs['ruleForm'].resetFields()
              this.ruleForm.mTeachers = []
              this.ruleForm.nurserys = []
              this.ruleForm.aTeachers = []
              this.$message.success(data.errorMessage)
            } else {
              this.$message.error(data.errorMessage || '新建班级失败')
            }
          })
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.$refs['ruleForm'].resetFields()
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
