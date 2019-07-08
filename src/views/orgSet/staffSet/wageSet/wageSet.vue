<template>
  <div class="wageSet">

    <CommonSearch
      :is-inline="true"
      :params="formInline"
      :forms="formInline"
      @toParent="resetFieldHanle"
    />

    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="optionsTab"
      :operation="operates"
      :table-key="'orgSet_wageSet'"
    />

    <el-dialog
      :visible.sync="switchDialog"
      :title="dialogTitle"
      @close="cancelForm('wageData')"
    >

      <div
        style="margin-bottom:20px"
        class="title"
      >
        <span class="form_txt" />
        <span>固定工资</span>
      </div>
      <el-form
        ref="wageData"
        :model="wageData"
        :rules="rules"
        label-width="100px"
      >

        <el-form-item
          label="基本工资:"
          prop="baseSalary"
        >
          <el-input
            v-model="wageData.baseSalary"
            clearable
            placeholder="请输入基本工资"
          />

        </el-form-item>

        <el-form-item
          label="补贴:"
          prop="subsidy"
        >
          <el-input
            v-model="wageData.subsidy"
            placeholder="请输入补贴"
            clearable
          />

        </el-form-item>
        <div
          style=" margin-bottom:20px"
          class="title"
        >
          <span class="form_txt" />
          <span>课时提成</span>
          <el-popover
            v-model="isPopHover"
            placement="right"
            width="100%"
            trigger="hover"
          >
            <div>1.该提成为老师上课的提成，可为每一个老师设置不同课程的提成方式
            </div>
            <div>
              2.若上课老师既有主教和助教，则会给主教和助教分别计算提成
            </div>
            <i
              slot="reference"
              class="iconfont icon_ym_ts"
              style="cursor:pointer;color:#666;font-size:16px;"
            />
          </el-popover>
        </div>
        <div
          v-for="(items,index) in wageData.commission"
          :key="'commission' + index"
          class="class_time_block"
        >
          <div style="text-align: end;">
            <el-popover
              v-model="isPopOpen[index]"
              placement="top"
              width="160"
              trigger="click"
            >
              <p class="pop_content"><i
                style="color:#FE9E0F"
                class="el-icon-warning"
              />确定要删除此项么？</p>
              <div class="bc">
                <el-button
                  size="mini"
                  class="delete_btn"
                  @click="cancelLessonItem(index)"
                >取消</el-button>
                <el-button
                  type="primary"
                  size="mini"
                  class="edit_btn"
                  @click="deleteLessonItem(index)"
                >确定</el-button>
              </div>

              <i
                slot="reference"
                class="el-icon-close"
                style="cursor:pointer"
              />
            </el-popover>
          </div>
          <el-form-item
            :prop="'commission.' + index + '.courseId'"
            :rules="[{ required: true, message: '请选择授课课程', trigger: 'change' }]"
            label="授课课程:"
          >
            <el-select
              v-model="items.courseId"
              placeholder="请选择"
              filterable
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              />
            </el-select>

          </el-form-item>

          <el-form-item
            :prop="'commission.' + index + '.royaltyMethod'"
            :rules="[{ required: true, message: '请选择提成方式', trigger: 'change' },]"
            label="提成方式:"
          >
            <el-radio-group
              v-model="items.royaltyMethod"
              @change="getRadio(index,items.royaltyMethod)"
            >
              <el-radio :label="1">按到课人次</el-radio>
              <el-radio :label="2">按授课次数</el-radio>
              <el-radio :label="3">按销课金额</el-radio>

            </el-radio-group>
          </el-form-item>

          <el-form-item
            :prop="'commission.' + index + '.payMethod'"
            :rules="[{ required: true, message: '请选择计算方式', trigger: 'change' },]"
            label="计算方式:"
          >
            <el-radio-group
              v-model="items.payMethod"
              @change="(value) => {changePayMethod(index, value)}"
            >
              <el-radio :label="1">固定金额</el-radio>
              <el-radio :label="2">梯度金额 </el-radio>

            </el-radio-group>
          </el-form-item>

          <el-form-item
            :prop="'commission.' + index + '.pushMoneyWay'"
            :rules="[{ required: true, message: '请选择提成金额', trigger: 'blur' },]"
            label="提成金额:"
          >
            <div
              v-for="(i,k) in items.pushMoneyWay"
              :key="'pushWay'+k"
            >
              <el-input
                v-if="items.payMethod === 2"
                v-model="i.time"
              >
                <template slot="prepend">满</template>

                <template
                  v-if="items.royaltyMethod === 1 && items.payMethod === 2"
                  slot="append"
                >人次</template>

                <template
                  v-if="items.royaltyMethod === 2 && items.payMethod === 2"
                  slot="append"
                >次课</template>
                <template
                  v-if="items.royaltyMethod === 3 && items.payMethod === 2"
                  slot="append"
                >元</template>

              </el-input>
              <el-input
                v-model="i.money"
                size="mini"
              >
                <template
                  v-if="items.royaltyMethod === 1"
                  slot="prepend"
                >每人次</template>
                <template
                  v-if="items.royaltyMethod === 2"
                  slot="prepend"
                >每次课</template>

                <template
                  v-if="items.royaltyMethod === 3"
                  slot="append"
                >%</template>
                <template
                  v-else
                  slot="append"
                >元</template>
              </el-input>

              <el-button
                v-if="k+1==items.pushMoneyWay.length"
                type="text"
                @click="removeGrad(k,index)"
              >
                移除
              </el-button>
              <div>

                <el-button
                  v-if="items.payMethod=='2'&& k+1==items.pushMoneyWay.length"
                  type="text"
                  @click="addNewGrads(k,index)"
                >新增梯度</el-button>

              </div>

            </div>

          </el-form-item>

        </div>
      </el-form>

      <div style="padding-left: 18px; margin-bottom: 20px;">

        <el-button
          type="text"
          @click="newAddLesson"
        ><span style="display: flex; align-items: center;">

          <i
            class="el-icon-circle-plus-outline"
            style="color:#46B6EE;font-size:20px"
          />
          <span>
            新增授课
        </span> </span>
        </el-button>

      </div>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelForm('wageData')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('wageData')"
        >确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

// eslint-disable-next-line
import { summaryCourseQuery, tenantRoleQuery, getUserWageSetting, queryUserWageSettingList, saveUserWageSetting, updateUserWageSetting } from '@/api/orgSet/staffSet'

import CommonTable from '@/components/CommonTable/CommonTable'
import CommonSearch from '@/components/CommonSearch/CommonSearch'

export default {
  components: {
    CommonSearch,
    CommonTable

  },
  data() {
    return {
      selectData: [],

      saveOldCommission: '',
      flag: '',
      wageData: {
        baseSalary: '', // 基础薪水
        subsidy: '', // 额外收入
        commission: [{
          royaltyMethod: '1', // 提成方式
          payMethod: '1', // 计算方式
          courseId: '', // 授课课程
          pushMoneyWay: [{ money: '', time: '' }]

        }]
        // personMoney: [{ money: '' }], // 每人次元
        // rate: [{ money: '' }], // %
        // courseMoney: [{ money: '' }]// 每次课元
        // gradientThree: [{ money: '', time: '' }], // 满0元。%
        // gradientTwo: [{ money: '', time: '' }], // 满0次课，每次课元
        // gradientOne: [{ money: '', time: '' }], // 满0人次，每人次元
      }, rules: {
        baseSalary: [
          { required: true, message: '请输入工资', trigger: 'blur' },

          { pattern: /^(?!(0[0-9]{1,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/, message: '工资不允许小于零' }
        ],
        royaltyMethod: { required: true, message: '请输入工资', trigger: 'change' },
        payMethod: { required: true, message: '请输入工资', trigger: 'change' }
      },
      isPopOpen: [],
      isPopHover: false,
      options: [],
      switchDialog: false,
      dialogTitle: '工资设置',
      listQuery: {
        show: true // 是否显示
      },
      columns: [

        {
          label: '姓名',
          prop: 'userName',

          formatter: (row, column, cellValue) => {
            return `<div style="text-overflow:ellipsis;overflow:hidden">${row.userName}</div>`
          }
        },
        {
          label: '角色',
          prop: 'roleNames'

          // formatter: (row, column, cellValue) => {
          //   return `<div style="color:#1D9DF2;text-overflow:ellipsis;overflow:hidden">${row.roleNames.name}</div>`
          // }
        },
        {
          label: '所属机构',
          prop: 'orgName'
        },
        {
          label: '基本工资',
          prop: 'baseSalary',
          render: (h, params) => {
            return h('span', {}, [
              h('el-popover', {
                props: { placement: 'top', trigger: 'hover', content: `${params.row.baseSalary}` }
              }, [
                h('a', { slot: 'reference' }, params.row.baseSalary)
              ])
            ])
          }
        },
        {
          label: '补贴',
          prop: 'subsidy'
        }
      ],
      optionsTab: {
        apiService: queryUserWageSettingList, // 表格的数据请求接口
        isSettingShow: true // 是否出现设置
      },

      operates: {
        width: '150',
        fixed: 'right',
        list: [
          {
            label: '设置工资',
            type: 'normal',
            method: (row) => {
              this.openWageSetDialog(row)
            }

          }

        ]
      },

      tableHeight: 'calc(100vh - 234px)',
      formInline: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'select',
            placeholder: '请选择角色',
            modelValue: 'id',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            labelKey: 'name',
            valueKey: 'id',
            apiService: tenantRoleQuery
          }, {
            itemType: 'input',
            placeholder: '请输入姓名',
            modelValue: 'name',
            isClearable: true
          }
        ]
      }

    }
  },

  computed: {

    // isOldData: function() {
    //   return
    // }

  },

  mounted() {
    tenantRoleQuery().then(res => {
      if (res.data.errorCode === 0) {
        this.selectData = res.data.results
      } else {
        this.$message.error(res.data.errorMessage)
      }
    })
    this.getCourse()
  },
  methods: {

    searchHandle(formValue) {
      // 搜索的入参
      const params = {
        roleIds: formValue.id,
        userName: formValue.name
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      const params = {
        pageIndex: 0
      }
      this.$refs.tableCommon.getList(params)
    },

    openWageSetDialog(val) {
      this.getCourse()
      this.switchDialog = true
      const data = {
        userId: val.userId
      }

      getUserWageSetting(data).then(res => {
        if (res.data.errorCode === 0) {
          this.wageData = res.data.dataInfo
          if (res.data.dataInfo.commission.length > 0) {
            res.data.dataInfo.commission.forEach((v, index) => {
              if (v.gradientOne || v.personMoney || v.gradientTwo || v.gradientThree || v.courseMoney || v.rate) {
                this.wageData.commission[index].pushMoneyWay = JSON.parse(v.gradientOne || v.personMoney || v.gradientTwo || v.gradientThree || v.courseMoney || v.rate)
              } else {
                this.wageData.commission[index].pushMoneyWay = [{ money: '', time: '' }]
              }
            })
          } else {
            this.wageData.commission = [{
              royaltyMethod: '1', // 提成方式
              payMethod: '1', // 计算方式
              courseId: '', // 授课课程
              pushMoneyWay: [{ money: '', time: '' }]

            }]
          }

          this.wageData.commission.map(v => {
            v.royaltyMethod = parseInt(v.royaltyMethod)
            v.payMethod = parseInt(v.payMethod)
            return delete v.gradientOne || v.personMoney || v.gradientTwo || v.gradientThree || v.courseMoney || v.rate
          })

          this.saveOldCommission = Object.assign([], this.deepCopy(this.wageData.commission))
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    filterData(index, val) {
      if (this.saveOldCommission[index] && this.wageData.commission[index].royaltyMethod === this.saveOldCommission[index].royaltyMethod) {
        this.wageData.commission[index].pushMoneyWay = this.saveOldCommission[index].pushMoneyWay
      } else {
        this.wageData.commission[index].pushMoneyWay = [{ money: '', time: '' }]
      }
      this.$forceUpdate()
    },

    deepCopy(obj) {
      let newObj
      if (typeof obj === 'object') {
        // 判断对象或数组
        newObj = obj.constructor === Array ? [] : {}
        for (const key in obj) {
          if (typeof obj[key] === 'object') {
            newObj[key] = this.deepCopy(obj[key])
          } else {
            newObj[key] = obj[key]
          }
        }
      } else {
        newObj = obj
      }
      return newObj
    },

    getCourse() {
      summaryCourseQuery().then(res => {
        if (res.data.errorCode === 0) {
          this.options = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    newAddLesson() {
      const data = {
        royaltyMethod: 1,
        payMethod: 1,

        courseId: '',

        pushMoneyWay: [{ money: '', time: '' }]
      }
      this.wageData.commission.push(data)
    },

    addNewGrads(k, index) {
      const datas = { money: '', time: '' }
      const temp = Object.assign([], this.wageData.commission)
      temp[index].pushMoneyWay.push(datas)

      this.$set(this.wageData.commission, index, temp[index])
    },

    removeGrad(k, index) {
      if (k === 0) {
        this.$message.warning('提成不能全删')
      } else {
        const temp = Object.assign([], this.wageData.commission[index].pushMoneyWay)
        temp.splice(k, 1)

        this.$set(this.wageData.commission[index], 'pushMoneyWay', temp)

        this.$forceUpdate()
      }
    },

    getRadio(index, val) {
      this.filterData(index, val)
    },

    /** 计算方式change */
    changePayMethod(index, value) {
      if (this.saveOldCommission[index] &&
      this.wageData.commission[index].royaltyMethod === this.saveOldCommission[index].royaltyMethod &&
      value === this.saveOldCommission[index].payMethod) {
        this.wageData.commission[index].pushMoneyWay = this.saveOldCommission[index].pushMoneyWay
      } else {
        this.wageData.commission[index].pushMoneyWay = [{ money: '', time: '' }]
      }
      this.$forceUpdate()
    },

    cancelLessonItem(val) {
      this.isPopOpen.splice(val, 1, false)
    },
    deleteLessonItem(val) {
      if (this.wageData.commission.length === 1) {
        this.$message.warning('至少保留一项课时提成')
      } else {
        this.wageData.commission.splice(val, 1)
        this.isPopOpen.splice(val, 1, false)
      }
    },
    // 取消提交
    cancelForm(formName) {
      this.switchDialog = false

      this.$refs[formName].resetFields()
    },
    // 确认提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const temp = Object.assign([], this.wageData.commission)
          const gradientOne = []
          // const personMoney = []

          const gradientTwo = []
          const courseMoney = []

          const gradientThree = []
          const rate = []

          temp.forEach((ele, index) => {
            // 按到课人次
            // eslint-disable-next-line
            if (ele.royaltyMethod == '1' && ele.payMethod == '1') {

              ele.personMoney = ele.pushMoneyWay
              delete ele.pushMoneyWay
            }
            // eslint-disable-next-line
            if (ele.royaltyMethod == '1' && ele.payMethod == '2') {
              gradientOne.push(ele.pushMoneyWay)
              ele.gradientOne = ele.pushMoneyWay
              delete ele.pushMoneyWay
            }

            // 按授课次数
            // eslint-disable-next-line
            if (ele.royaltyMethod == '2' && ele.payMethod == '1') {
              courseMoney.push(ele.pushMoneyWay)
              ele.courseMoney = ele.pushMoneyWay
              delete ele.pushMoneyWay
            }
            // eslint-disable-next-line
            if (ele.royaltyMethod == '2' && ele.payMethod == '2') {
              gradientTwo.push(ele.pushMoneyWay)
              ele.gradientTwo = ele.pushMoneyWay
              delete ele.pushMoneyWay
            }
            // 按销课金额
            // eslint-disable-next-line
            if (ele.royaltyMethod == '3' && ele.payMethod == '1') {
              rate.push(ele.pushMoneyWay)
              ele.rate = ele.pushMoneyWay
              delete ele.pushMoneyWay
            }
            // eslint-disable-next-line
            if (ele.royaltyMethod == '3' && ele.payMethod == '2') {
              gradientThree.push(ele.pushMoneyWay)
              ele.gradientThree = ele.pushMoneyWay
              delete ele.pushMoneyWay
            }
          })
          const data = {
            userId: this.wageData.userId,
            baseSalary: this.wageData.baseSalary,
            subsidy: this.wageData.subsidy,
            commission: JSON.stringify(temp)
          }

          saveUserWageSetting(data).then(res => {
            if (res.data.errorCode === 0) {
              this.cancelForm('wageData')
              this.$refs.tableCommon.getList()
            } else {
              this.$message.error(res.data.errorMessage)
            }
          })
        } else {
          return false
        }
      })
    }

  }
}
</script>
<style lang="scss" scoped>
.title {
  display: flex;
  align-items: center;
  span {
    margin-right: 5px;
  }
}
.el-input-group {
  width: 200px;
}

.class_time_block {
  border-bottom: 1px solid #eeeeee;
  margin-bottom: 5px;
}
</style>
