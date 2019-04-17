<template>
  <div>
    <el-dialog
      :visible.sync="changeDialogShow"
      title="兑换商品"
      @close="cancelDialog('changeForm')"
    >
      <el-form
        ref="changeForm"
        :model="accountData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item
          label="学员:"
          prop="stuId"
        >
          <el-select
            v-model="accountData.stuId"
            :filterable="true"
            clearable
            placeholder="请选择学员"
            style="width: 85%"
            @change="selectStuChange"
          >
            <el-option
              v-for="item in allStudentList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <span
            style="color: #46b6ee; cursor: pointer"
            @click="preciseFindDialog()"
          >精确查找</span>
        </el-form-item>
        <el-form-item
          label="会员卡号:"
          prop="cardId"
        >
          <span>{{ accountData.cardId || '暂无会员卡' }}</span>
        </el-form-item>
        <el-form-item
          label="可用积分:"
          prop="userInte"
        >
          <span>{{ accountData.userInte || '0' }}</span>
        </el-form-item>
        <el-form-item
          label="兑换商品:"
          prop="goodsId"
        >
          <el-select
            v-model="accountData.goodsId"
            clearable
            placeholder="请选择兑换的商品"
            style="width: 100%"
            @change="changeShopValue"
          >
            <el-option
              v-for="item in allShopList"
              :key="item.id"
              :label="item.goodsName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          ref="num"
          label="商品数量:"
          prop="num"
        >
          <el-input
            v-model="accountData.num"
            clearable
            placeholder="请输入商品数量"
            @keyup.native="shopNumChange"
          />
        </el-form-item>
        <el-form-item
          label="库存:"
          prop="last"
        >
          <span>{{ accountData.last || '0' }}</span>
        </el-form-item>
        <el-form-item
          label="兑换所需积分:"
          prop="integral"
        >
          <span>{{ accountData.integral || '0.00' }}</span>
        </el-form-item>
        <el-form-item
          label="备注:"
          prop="remark"
        >
          <el-input
            v-model="accountData.remark"
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
          @click="cancelDialog('changeForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitFrom('changeForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 精确查找弹框组件 -->
    <ExactSearchDialog
      ref="exactSearchDialog"
      @toStudentName="getStudentName"
    />
  </div>
</template>

<script>
import { queryCRMStuList, queryIntegralGoods, addIntegralExchange } from '@/api/crm/Integral/accountMgr'
import ExactSearchDialog from './exactSearchDialog.vue'
export default {
  components: {
    ExactSearchDialog
  },
  data() {
    var validateNum = (rule, value, callback) => {
      if (parseInt(value) > parseInt(this.accountData.last)) {
        callback(new Error('商品数量不能超过库存数量'))
      } else if (!(/^[1-9]\d*$/.test(value))) {
        callback(new Error('商品数量不能小于0'))
      } else {
        callback()
      }
    }
    return {
      changeDialogShow: false,
      accountData: {
        stuId: '', // 学员id
        cardId: '', // 会员卡
        userInte: '', // 可用积分
        remark: '', // 备注
        goodsId: '', // 商品id
        num: '', // 所需数量
        integral: '', // 消耗积分
        last: '' // 库存
      },
      rules: {
        stuId: [
          { required: true, message: '请选择学员', trigger: 'change' }
        ],
        goodsId: [
          { required: true, message: '请选择兑换商品', trigger: 'change' }
        ],
        num: [
          { required: true, message: '商品数量大于0', trigger: 'change' },
          { validator: validateNum }
        ]
      },
      selectStu: {}, // 被选学员数据
      selectShopRow: {}, // 被选的商品数据
      allShopList: [], // 兑换商品下拉数据
      allStudentList: [] // 学员下拉数据
    }
  },
  methods: {
    /* 获取学员下拉列表 */
    queryCRMStuListFun() {
      const params = {
        pageSize: 99999,
        pageIndex: 0
      }
      queryCRMStuList(params).then(res => {
        if (res.data.errorCode === 0) {
          this.allStudentList = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 学员值改变 */
    selectStuChange(value) {
      this.allStudentList.map(item => {
        if(value == item.id){ //eslint-disable-line
          this.accountData.cardId = item.stuCardId
          this.accountData.userInte = item.integral
          this.selectStu = item
        }
      })
    },
    /* 兑换商品下拉列表 */
    queryIntegralGoodsFun() {
      const params = {
        pageSize: 99999,
        pageIndex: 0
      }
      queryIntegralGoods(params).then(res => {
        if (res.data.errorCode === 0) {
          this.allShopList = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 兑换商品值改变 */
    changeShopValue(value) {
      this.allShopList.map(item => {
        if (value == item.id) { //eslint-disable-line
          this.selectShopRow = item
          this.accountData.last = item.stockNum
          this.accountData.integral = '0.00'
        }
      })
      this.$forceUpdate()
      this.$refs.num.clearValidate()
      this.accountData.num = ''
    },
    /* 商品数量值改变 */
    shopNumChange(value) {
      this.accountData.integral = Number(this.selectShopRow.integral) * Number(this.accountData.num)
    },
    /* 显示弹框 */
    showDialog() {
      this.queryCRMStuListFun()
      this.queryIntegralGoodsFun()
      this.changeDialogShow = !this.changeDialogShow
    },
    /* 关闭弹框 */
    cancelDialog(formName) {
      this.changeDialogShow = false
      this.$refs[formName].resetFields()
    },
    /* 提交弹框 */
    submitFrom(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            stuId: this.accountData.stuId, // 学员id
            cardId: this.accountData.cardId, // 会员卡
            remark: this.accountData.remark, // 备注
            goodsId: this.accountData.goodsId, // 商品id
            num: Number(this.accountData.num), // 所需数量
            integral: this.accountData.integral // 消耗积分
          }
          addIntegralExchange(params).then(res => {
            if (res.data.errorCode === 0) {
              this.changeDialogShow = false
              this.$message.success(res.data.errorMessage)
              this.selectStu = {}
            } else {
              this.$message.error(res.data.errorMessage)
            }
          })
        }
      })
    },
    /* 精确查找弹框显示 */
    preciseFindDialog() {
      this.$refs.exactSearchDialog.showDialog(this.selectStu)
    },
    /* 关闭精确查找弹框 */
    cancelFindDialog() {
      this.$refs.exactSearchDialog.closeDialog()
    },
    /* 确认提交精确查找 */
    submitFindForm() {
      this.$refs.exactSearchDialog.submitDialog()
    },
    /* 获取精确查找传的学员信息 */
    getStudentName(value) {
      this.allStudentList.map(item => {
        if(value == item.name) { //eslint-disable-line
          this.accountData.stuId = item.id
          this.accountData.cardId = item.stuCardId
          this.accountData.userInte = item.integral
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

