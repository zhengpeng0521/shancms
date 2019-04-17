<template>
  <div class="aaddSetmealDialog_container">
    <el-dialog
      :visible.sync="aaddSetmealDialogShow"
      title="合同套餐"
      @close="cancelDialog('aaddSetmealForm')"
    >
      <el-form
        ref="aaddSetmealForm"
        :model="addSermealData"
        :rules="rules"
        label-width="90px"
      >
        <el-form-item
          label="套餐类型:"
          prop="type"
        >
          <el-radio-group
            v-model="addSermealData.type"
            @change="changeRadio(addSermealData.type)"
          >
            <el-radio
              :disabled="radioTypeDis"
              label="1"
            >课时套餐</el-radio>
            <el-radio
              :disabled="radioTypeDis"
              label="3"
            >托班套餐</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="isChangeRadio">
          <el-form-item
            label="产品名称:"
            prop="name"
          >
            <el-input
              v-model="addSermealData.name"
              :rules="{
                required: true, message: '产品名称不能为空', trigger: 'change'
              }"
              clearable
              placeholder="请输入产品名称"
            />
          </el-form-item>
          <el-form-item
            label="课时数量:"
            prop="amount"
          >
            <el-input
              v-model="addSermealData.amount"
              clearable
              placeholder="正数，可精确到小数点后2位"
            />
          </el-form-item>
          <el-form-item
            label="课时类型:"
            prop="cType"
            class="classType"
          >
            <el-radio-group
              v-model="addSermealData.cType"
              @change="cTypeChange(addSermealData.cType)"
            >
              <el-radio label="1">通用课时:机构下所有课程都可以使用</el-radio>
              <el-radio label="2">专用课时:需要指定某个课程使用这种课时(需要开通教学模块才能使用)</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="isClassArray">
            <el-form-item
              v-for="(item, index) of addSermealData.scope"
              :key="index + '_scopeIndex'"
              :prop="'scope.'+index+'.courseCount'"
              :rules=" { required: true, message: '请输入课时数量,最多保留两位小数', pattern: /^(([1-9]{1}\d*)|(0{1}))((\.\d{1,2})|((\d*)))$/, trigger: 'change' }"
              label="分配课时:"
            >
              <el-select
                v-model="item.courseName"
                placeholder="请选择课程"
                clearable
                style="width:40%"
                @change="classArrayChange(item.courseName)"
              >
                <el-option
                  v-for="item in allCourseList"
                  :key="item.id"
                  :label="item.title"
                  :value="item.title"
                />
              </el-select>
              <el-input
                v-model="item.courseCount"
                clearable
                style="width:50%"
                placeholder="正数，可精确到小数点后2位"
              />
              <span
                v-if="addSermealData.scope.length>1"
                style="cursor: pointer"
                @click="delClassRowList(index)"
              >删除</span>
            </el-form-item>
          </div>
          <el-form-item
            v-if="isClassArray"
            prop=""
          >
            <div
              style="text-align: center;cursor: pointer;"
              @click="addClassRowList"
            > + 添加</div>
          </el-form-item>
        </div>

        <div v-else>
          <el-form-item
            label="托班类型:"
            prop="nurseryType"
          >
            <el-select
              v-model="addSermealData.nurseryType"
              placeholder="请选择托班类型"
              clearable
              style="width:100%"
            >
              <el-option
                v-for="item in allUnitTypeList"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="托班周期:"
            prop="unitType"
          >
            <el-select
              v-model="addSermealData.unitType"
              placeholder="请选择托班周期"
              clearable
              style="width:100%"
            >
              <el-option
                v-for="item in allUnitListData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="产品名称:"
            prop="name"
          >
            <el-input
              v-model="addSermealData.name"
              clearable
              placeholder="请输入产品名称"
            />
          </el-form-item>
        </div>
        <el-form-item
          label="产品描述:"
          prop="intro"
        >
          <el-input
            v-model="addSermealData.intro"
            clearable
            type="textarea"
            placeholder="请输入产品描述"
          />
        </el-form-item>
        <el-form-item
          label="原价:"
          prop="price"
        >
          <el-input
            v-model="addSermealData.price"
            clearable
            placeholder="正数，可精确到小数点后2位"
          />
          <!-- <span>正数，可精确到小数点后2位</span> -->
        </el-form-item>
        <el-form-item
          label="售卖价:"
          prop="realPrice"
        >
          <el-input
            v-model="addSermealData.realPrice"
            clearable
            placeholder="正数，可精确到小数点后2位"
          />
          <!-- <span>正数，可精确到小数点后2位</span> -->
        </el-form-item>
        <el-form-item
          label="状态:"
          prop="status"
        >
          <el-select
            v-model="addSermealData.status"
            placeholder="请选择状态"
            clearable
            style="width:100%"
          >
            <el-option
              v-for="item in allStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog('aaddSetmealForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('aaddSetmealForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  summaryQuery,
  addContractProduct,
  dictGetByKey,
  getContractProduct, // 合同套餐详情
  updateContractProduct // 确定编辑套餐
} from '@/api/crm/contract/contract.js'
export default {
  components: {

  },
  data() {
    return {
      aaddSetmealDialogShow: false,
      radioTypeDis: false, // 套餐类型是否禁用
      isClassArray: false, // 分配课时数组显隐
      isChangeRadio: true, // 单选框组件值改变控制显隐
      isDeleteBtnShow: false, // 删除
      addSermealData: {
        id: '',
        type: '1', // 类型
        name: '', // 名称
        amount: '', // 数量
        cType: '1', // 课时类型
        scope: [
          {
            courseId: '',
            courseName: '',
            courseCount: ''
          }
        ], // 课时范围
        intro: '', // 描述
        price: '', // 原价
        realPrice: '', // 售卖价格
        present: '', // 赠送金额
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        status: '', // 上下架状态
        nurseryType: '', // 托班类型
        unitType: '' // 托班周期
      },
      allStatusList: [ // 上下架状态
        {
          value: '1',
          label: '上架'
        },
        {
          value: '2',
          label: '下架'
        }
      ],
      allUnitListData: [ // 托班周期下拉列表数据
        {
          value: '1',
          label: '按天'
        },
        {
          value: '2',
          label: '按月'
        },
        {
          value: '3',
          label: '按季度'
        },
        {
          value: '4',
          label: '按半年'
        },
        {
          value: '5',
          label: '按年'
        }
      ],
      rules: {
        type: [
          { required: true, message: '请选择套餐类型', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入产品名称', trigger: 'change' }
        ],
        price: [
          { required: true, message: '正数，可精确到小数点后2位', trigger: 'change' }
        ],
        realPrice: [
          { required: true, message: '正数，可精确到小数点后2位', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        amount: [
          { required: true, message: '请输入课时数量', trigger: 'change' }
        ],
        cType: [
          { required: true, message: '请输入课时类型', trigger: 'change' }
        ]
      },
      rowIsEdit: '',
      allCourseList: [], // 所有课时下拉数据
      allUnitTypeList: [] // 所有托班类型下拉数据
    }
  },
  methods: {
    /* 显示弹框 */
    showDialog(row) {
      this.rowIsEdit = row
      if (row == '1') { //eslint-disable-line
        this.summaryQueryFun()
        this.dictGetByKeyFun()
        this.addSermealData.type = '1'
        this.addSermealData.cType = '1'
        this.isChangeRadio = true
        this.isClassArray = false
        this.radioTypeDis = false
      } else {
        this.getContractProductFun(row)
        this.summaryQueryFun()
        this.dictGetByKeyFun()
        this.radioTypeDis = true
      }
      this.aaddSetmealDialogShow = !this.aaddSetmealDialogShow
    },
    /* 关闭弹框 */
    cancelDialog(formName) {
      this.aaddSetmealDialogShow = false
      this.$refs[formName].resetFields()
      this.addSermealData.name = ''
      this.$emit('toClose')
    },
    /* 获取合同套餐详情 */
    getContractProductFun(row) {
      const params = {
        id: row.id
      }
      getContractProduct(params).then(res => {
        if (res.data.errorCode === 0) {
          this.addSermealData = {
            id: res.data.id,
            type: res.data.type == '课时包' ? '1' : '3', //eslint-disable-line
            name: res.data.name, // 名称
            amount: res.data.amount, // 数量
            cType: res.data.ctype == '通用课时' ? '1' : '2', //eslint-disable-line
            scope: [
              {
                courseId: '',
                courseName: '',
                courseCount: ''
              }
            ], // 课时范围
            intro: res.data.intro, // 描述
            price: res.data.price, // 原价
            realPrice: res.data.realPrice, // 售卖价格
            present: res.data.present, // 赠送金额
            startTime: res.data.startTime, // 开始时间
            endTime: res.data.endTime, // 结束时间
            status: res.data.status == '上架' ? '1' : '2', //eslint-disable-line
            nurseryType: res.data.nurseryType, // 托班类型
            unitType: res.data.unitType // 托班周期
          }
          if(this.addSermealData.type == '1') { //eslint-disable-line
            this.isChangeRadio = true
            if(this.addSermealData.cType == '1') { //eslint-disable-line
              this.isClassArray = false
            } else {
              this.isClassArray = true
              this.addSermealData.scope = JSON.parse(res.data.scope)
            }
          } else {
            this.isChangeRadio = false
            this.rules.nurseryType = [
              { required: true, message: '请选择托班类型', trigger: 'change' }
            ]
            this.rules.unitType = [
              { required: true, message: '请选择托班周期', trigger: 'change' }
            ]
          }
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 单选框改变 */
    changeRadio(value) {
      if (value == '1') { //eslint-disable-line
        this.isChangeRadio = true
        this.rules.amount = [
          { required: true, message: '请输入课时数量', trigger: 'change' }
        ]
        this.rules.cType = [
          { required: true, message: '请输入课时类型', trigger: 'change' }
        ]
        this.rules.scope = [
          { required: true, message: '请选择分配课时', trigger: 'change' }
        ]
      }
      if (value == '3') { //eslint-disable-line
        this.isChangeRadio = false
        this.rules.nurseryType = [
          { required: true, message: '请选择托班类型', trigger: 'change' }
        ]
        this.rules.unitType = [
          { required: true, message: '请选择托班周期', trigger: 'change' }
        ]
      }
    },
    /* 获取课程下拉查询 */
    summaryQueryFun() {
      const params = {
        pageSize: 99999
      }
      summaryQuery(params).then(res => {
        if (res.data.errorCode === 0) {
          this.allCourseList = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 课时类型值改变 */
    cTypeChange(value) {
      if(value == '1') { //eslint-disable-line
        this.isClassArray = false
      } else {
        this.isClassArray = true
      }
    },
    /* 添加分配课时 */
    addClassRowList() {
      const tempArr = {
        courseId: '',
        courseName: '',
        courseCount: ''
      }
      this.addSermealData.scope.push(tempArr)
    },
    /* 删除分配课时 */
    delClassRowList(index) {
      this.addSermealData.scope.splice(index, 1)
    },
    /* 课时下拉值改变 */
    classArrayChange(value) {
      this.addSermealData.scope.map(itemScope => {
        this.allCourseList.map(item => {
          if(itemScope.courseName == item.title) { //eslint-disable-line
            itemScope.courseId = item.id
          }
        })
      })
    },
    /* 托班类型下拉列表数据 */
    dictGetByKeyFun() {
      const params = {
        dictkey: 'nurseryType'
      }
      dictGetByKey(params).then(res => {
        if (res.data.errorCode === 0) {
          this.allUnitTypeList = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 确定编辑套餐 */
    updateContractProductFun(params) {
      updateContractProduct(params).then(res => {
        if (res.data.errorCode === 0) {
          this.$emit('toSetmealPage')
          this.cancelDialog('aaddSetmealForm')
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 确定提交弹框表单内容 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {}
          if(this.addSermealData.type == '1') { //eslint-disable-line
            params = {
              id: this.addSermealData.id,
              type: this.addSermealData.type, // 类型
              name: this.addSermealData.name, // 名称
              amount: this.addSermealData.amount, // 数量
              ctype: this.addSermealData.cType, // 课时类型
              scope: JSON.stringify(this.addSermealData.scope), // 课时范围
              intro: this.addSermealData.intro, // 描述
              price: this.addSermealData.price, // 原价
              realPrice: this.addSermealData.realPrice, // 售卖价格
              status: this.addSermealData.status // 上下架状态
            }
          }
          if(this.addSermealData.type == '3') { //eslint-disable-line
            params = {
              id: this.addSermealData.id,
              type: this.addSermealData.type, // 类型
              name: this.addSermealData.name, // 名称
              nurseryType: this.addSermealData.nurseryType, // 托班类型
              unitType: this.addSermealData.unitType, // 托班周期
              intro: this.addSermealData.intro, // 描述
              price: this.addSermealData.price, // 原价
              realPrice: this.addSermealData.realPrice, // 售卖价格
              status: this.addSermealData.status // 上下架状态
            }
          }
          if(this.rowIsEdit == '1'){ //eslint-disable-line
            addContractProduct(params).then(res => {
              if (res.data.errorCode === 0) {
                this.$emit('toSetmealPage')
                this.cancelDialog('aaddSetmealForm')
                this.$emit('toClose')
              } else {
                this.$message.error(res.data.errorMessage)
              }
            })
          } else {
            this.updateContractProductFun(params)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.aaddSetmealDialog_container /deep/ {
  .el-dialog {
    width: 550px;
  }
  .classType {
    .el-radio-group {
      padding-top: 8px;
    }
    .el-radio + .el-radio {
      margin-left: 0;
      margin-top: 10px;
    }
    .el-radio__label {
      font-size: 13px;
    }
  }
}
</style>

