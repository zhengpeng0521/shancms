<template>
  <div>
    <el-dialog
      :visible.sync="productDialogShow"
      :title="dialogTitle"
      @close="cancelDialog('productForm')"
    >
      <el-form
        ref="productForm"
        :model="productData"
        :rules="rules"
        label-width="90px"
      >
        <el-form-item
          label="商品类型:"
          prop="sourceType"
        >
          <el-radio-group v-model="productData.sourceType">
            <el-radio label="1">物资</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="选择商品:"
          prop="sourceId"
        >
          <el-select
            v-model="productData.sourceId"
            :disabled="productDisabled"
            placeholder="请选择商品"
            clearable
            style="width:100%"
            @change="shopValueChange"
          >
            <el-option
              v-for="item in allShopList"
              :key="item.sourceId"
              :label="item.goodsName"
              :value="item.sourceId"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="商品名称:"
          prop="goodsName"
        >
          <el-input
            v-model="productData.goodsName"
            clearable
            placeholder="请输入商品名称"
          />
        </el-form-item>
        <el-form-item
          label="库存:"
          prop="stockNum"
        >
          <span>{{ productData.stockNum }}</span>
        </el-form-item>
        <el-form-item
          label="消耗积分:"
          prop="integral"
        >
          <el-input
            v-model="productData.integral"
            clearable
            placeholder="请输入消耗积分"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog('productForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('productForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { queryIntegralGoodsList, addIntegralGoods, updateIntegralGoods } from '@/api/crm/Integral/accountMgr'
export default {
  components: {

  },
  data() {
    var self = this
    // 校验
    var validateSourceId = function(rule, value, callback) {
      var valid = false
      self.allShopList.map(item => {
        if (value === item.sourceId) { //eslint -disable-line说
          if (item.type === '1' && !self.productData.id) {
            valid = true
          }
        }
      })
      if (valid) {
        callback(new Error('该商品已添加'))
        return
      }
      callback()
    }
    return {
      productDialogShow: false,
      dialogTitle: '新增商品',
      selectItemId: '', // 选中的商品编号
      productData: {
        goodsName: '', // 商品名称
        sourceType: '1', // 来源类型
        integral: '', // 消耗积分
        sourceId: '', // 来源id
        stockNum: '', // 库存
        money: '', // 消耗金额
        status: '', // 状态
        chgType: '', // 交易类型
        id: '' // 商品编号
      },
      productDisabled: false, // 商品下拉框是否可选择,编辑时不可选择
      allShopList: [], // 商品下拉列表
      rules: {
        sourceType: [{ required: true, message: '', trigger: 'change' }],
        goodsName: [
          { required: true, message: '请输入商品名称', trigger: 'change' }
        ],
        sourceId: [
          { required: true, message: '请选择商品', trigger: 'change' },
          { validator: validateSourceId, trigger: 'change' }
        ],
        stockNum: [{ required: true }],
        integral: [
          { required: true, message: '请输入消耗积分', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    /* 获取商品下拉列表 */
    queryIntegralGoodsListFun(sourceId) {
      const params = {
        pageSize: 99999,
        pageIndex: 0
      }
      queryIntegralGoodsList(params).then(res => {
        if (res.data.errorCode === 0) {
          this.allShopList = res.data.results
          if (sourceId) {
            this.shopValueChange(sourceId)
          }
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 商品值改变 */
    shopValueChange(value) {
      if (!value) {
        this.productData.goodsName = ''
        this.productData.stockNum = ''
        return
      }
      this.allShopList.map(item => {
        if(value == item.sourceId){ //eslint-disable-line
          this.productData.goodsName = item.goodsName
          this.productData.stockNum = item.stockNum
          this.productData.sourceId = item.sourceId
        }
      })
    },
    /* 显示弹框 */
    showDialog(row) {
      this.queryIntegralGoodsListFun()
      this.productDialogShow = !this.productDialogShow
      // 修改时初始化数据
      if (row && row.sourceId) {
        this.dialogTitle = '编辑商品'
        this.productDisabled = true
        this.productData = row
      } else {
        this.dialogTitle = '新增商品'
        this.productDisabled = false
        this.productData = {
          goodsName: '', // 商品名称
          sourceType: '1', // 来源类型
          integral: '', // 消耗积分
          sourceId: '', // 来源id
          stockNum: '', // 库存
          money: '', // 消耗金额
          status: '', // 状态
          chgType: '', // 交易类型
          id: '' // 商品编号
        }
      }
    },
    /* 关闭弹框 */
    /* 商品弹框关闭 */
    cancelDialog(formName) {
      this.productDialogShow = false
      this.$refs[formName].resetFields()
    },
    /* 确定提交弹框表单内容 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            goodsName: this.productData.goodsName, // 商品名称
            sourceType: this.productData.sourceType || '1', // 来源类型
            integral: this.productData.integral, // 消耗积分
            sourceId: this.productData.sourceId, // 来源id
            id: this.productData.id, // 商品编号
            money: 0, // 默认,消耗金额
            status: 'EFFECTIVE', // 默认,状态: 有效
            chgType: 1 // 默认,扣费类型: 1. 积分
          }
          if (params.id) {
            // 修改商品
            updateIntegralGoods(params).then(res => {
              if (res.data.errorCode === 0) {
                this.productDialogShow = false
                this.$message.success(res.data.errorMessage)
                this.$emit('toProductList')
              } else {
                this.$message.error(res.data.errorMessage)
              }
            })
          } else {
            // 新增商品
            addIntegralGoods(params).then(res => {
              if (res.data.errorCode === 0) {
                this.productDialogShow = false
                this.$message.success(res.data.errorMessage)
                this.$emit('toProductList')
              } else {
                this.$message.error(res.data.errorMessage)
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

