<template>
  <div class="detailTabCom_container">
    <div
      :loading="loading"
      class="detailTabCom_wrap"
    >
      <p>
        <span>所属校区:</span>
        <span>{{ contractDetail.orgName || '--' }}</span>
      </p>
      <p>
        <span>合同编号:</span>
        <span>{{ contractDetail.orderNum || '--' }}</span>
      </p>
      <p>
        <span>学员姓名:</span>
        <span
          v-for="(item,index) of contractDetail.stuInfo"
          :key="index + '_stuId'"
        >
          {{ item.stuName || '' }}
        </span>
      </p>
      <p>
        <span>会员卡号:</span>
        <span>{{ contractDetail.stuCardId || '--' }}</span>
      </p>
      <p>
        <span>签约家长:</span>
        <span>{{ contractDetail.parentName || '--' }}</span>
      </p>
      <p>
        <span>合同期限:</span>
        <span v-if="contractDetail.startTime!=null || contractDetail.endTime!=null">{{ contractDetail.startTime + '~' + contractDetail.endTime }}</span>
        <span v-else>--</span>
      </p>
      <p>
        <span>是否过期:</span>
        <span>{{ contractDetail.expireInvalid == '0' ? '否' : contractDetail.expireInvalid == '1' ? '是' : '' }}</span>
      </p>
      <p>
        <span>签订日期:</span>
        <span>{{ contractDetail.signTime || '--' }}</span>
      </p>
      <p>
        <span>合同类型:</span>
        <span>{{ contractDetail.type == '2' ? '课时套餐' : contractDetail.type == '3' ? '托班套餐' : '' }}</span>
      </p>
      <p>
        <span>签约类型:</span>
        <span>{{ contractDetail.signType == '0' ? '新签约' : contractDetail.signType == '1' ? '续约' : contractDetail.signType == '2' ? '新签-转介绍' :'' }}</span>
      </p>

      <p>
        <span>转介绍人:</span>
        <span>{{ contractDetail.introduceName || '--' }}</span>
      </p>

      <p>
        <span>合同来源:</span>
        <span>{{ contractDetail.source == '1' ? '校区新增' : contractDetail.source == '2' ? '转校转入' : '' }}</span>
      </p>

      <!-- 商品 -->
      <div
        v-if="detailsTabComHidden"
        class="item_lable_shop"
      >
        <span style="vertical-align: top;">商品:</span>
        <ul>
          <li>
            <p style="width: 100px;">{{ contractDetail.type === '3' ? '托班套餐' : '课时套餐' }}</p>
            <p style="width: 100px;">标准价格</p>

            <p v-if="shopClassMountHidde" style="width: 100px;">课时数量</p>

            <p style="width: 100px;">套餐数量</p>
            <p style="width: 100px;">合计价格</p>
            <p style="width: 100px;">优惠金额</p>
            <p style="width: 100px;">实收价格</p>
          </li>
          <li
            v-for="(item, index) of contractDetail.classpkg"
            :key="index + '_classpkg'"
          >
            <p style="width: 100px;">{{ item.name || '' }}</p>
            <p style="width: 100px;">{{ item.price || '' }}</p>

            <p v-if="shopClassMountHidde" style="width: 100px;">{{ item.period || '' }}</p>

            <p style="width: 100px;">{{ item.amount || '' }}</p>
            <p style="width: 100px;">{{ item.totalPrice || '' }}</p>

            <el-popover
              :content="item.preferentialPrice || ''"
              placement="top-start"
              width="150"
              trigger="hover"
            >
              <p slot="reference" style="width: 100px;">{{ item.preferentialPrice || '' }}</p>
            </el-popover>

            <p style="width: 100px;">{{ item.money || '' }}</p>
          </li>
        </ul>
      </div>

      <!-- 物资 -->
      <div
        v-if="detailsTabComHidden"
        class="item_lable_goods"
      >
        <span style="vertical-align: top;" />
        <ul>
          <li>
            <p style="width: 100px;">物资物品</p>
            <p style="width: 100px;">标准价格</p>
            <p style="width: 100px;">套餐数量</p>
            <p style="width: 100px;">合计价格</p>
            <p style="width: 100px;">优惠金额</p>
            <p style="width: 100px;">实收价格</p>
          </li>
          <li
            v-for="(item, index) of contractDetail.teachTools"
            :key="index + '_teachTools'"
          >
            <p style="width: 100px;">{{ item.name || '' }}</p>
            <p style="width: 100px;">{{ item.price || '' }}</p>
            <p style="width: 100px;">{{ item.amount || '' }}</p>
            <p style="width: 100px;">{{ item.totalPrice || '' }}</p>

            <el-popover
              :content="item.preferentialPrice || ''"
              placement="top-start"
              width="150"
              trigger="hover"
            >
              <p slot="reference" style="width: 100px;">{{ item.preferentialPrice || '' }}</p>
            </el-popover>

            <p style="width: 100px;">{{ item.money || '' }}</p>
          </li>
        </ul>
      </div>

      <!-- 汇总 -->
      <div
        v-if="detailsTabComHidden"
        class="item_lable_total"
      >
        <span style="vertical-align: top;">汇总:</span>
        <ul>
          <li>
            <p style="width: 180px;">总合计</p>
            <p style="width: 120px;">总实收</p>
          </li>
          <li>
            <p style="width: 180px;">{{ parseFloat(contractDetail.totalOriMoney).toFixed(2) }}</p>
            <p style="width: 120px;">{{ parseFloat(contractDetail.totalMoney).toFixed(2) }}</p>
          </li>
        </ul>
      </div>

      <!-- 关联销售 -->
      <div
        v-if="detailsTabComHidden"
        class="item_lable_sale"
      >
        <span style="vertical-align: top;">关联销售:</span>
        <ul>
          <li>
            <p style="width: 180px;">销售</p>
            <p style="width: 120px;">占比</p>
          </li>
          <li
            v-for="(item, index) of contractDetail.saleUser"
            :key="index + '_saleUser'"
          >
            <p style="width: 180px;">{{ item.userName || '' }}</p>
            <p style="width: 120px;">{{ item.rate ? item.rate + '%' : '' }}</p>
          </li>
        </ul>
      </div>

      <!-- 消耗情况 -->
      <div
        v-if="detailsTabComHidden"
        class="item_lable_expend"
      >
        <span style="vertical-align: top;">消耗情况:</span>
        <ul>
          <li>
            <p style="width: 180px;">已消金额</p>
            <p style="width: 120px;">未消金额</p>
          </li>
          <li>
            <p style="width: 180px;">{{ parseFloat(contractDetail.balanceConsume).toFixed(2) }}</p>
            <p style="width: 120px;">{{ parseFloat(contractDetail.balanceLeft).toFixed(2) }}</p>
          </li>
        </ul>
      </div>

      <div
        v-if="contractDetail.type === '2'"
        style="overflow: hidden;width: 700px;height: 162px;"
      >
        <p v-if="detailsTabComShow">
          <span>赠课类型:</span>
          <span>{{ contractDetail.extType == '1' ? '通用课时' : contractDetail.extType == '2' ? '专用课时' : '' }}</span>
        </p>
        <p v-if="detailsTabComShow">
          <span>课程名称:</span>
          <span>{{ contractDetail.courseName || '--' }}</span>
        </p>
        <p v-if="detailsTabComShow">
          <span>赠课课时:</span>
          <span>{{ contractDetail.extPeriod || '0' }}</span>
        </p>
        <p v-if="detailsTabComShow">
          <span>赠课成本:</span>
          <span>{{ contractDetail.extPeriodMoney || '0' }}</span>
        </p>
        <p v-if="detailsTabComShow">
          <span>赠课原因:</span>
          <span>{{ contractDetail.extPeriodReason || '--' }}</span>
        </p>
      </div>
      <div
        v-if="contractDetail.type === '3' && detailsTabComShow"
        style="overflow: hidden;width: 700px;height: 65px;"
      >
        <p>
          <span>赠课天数:</span>
          <span>{{ contractDetail.extNursery || '0' }}</span>
        </p>
        <p>
          <span>赠课原因:</span>
          <span>{{ contractDetail.extNurseryReason || '--' }}</span>
        </p>
      </div>
      <p>
        <span style="vertical-align: top;">合同附件:</span>
        <img
          v-for="(item, index) of imgArrayList"
          :key="index + 'imgArray'"
          :src="item || '--'"
          width="90px"
          height="90px"
          style="margin-right: 10px;"
          alt=""
          @click="preView(item, index)"
        >
      </p>
      <p>
        <span>备注:</span>
        <span>{{ contractDetail.remark || '--' }}</span>
      </p>
      <el-dialog
        :visible.sync="dialogVisible"
        append-to-body
      >
        <img
          :src="dialogImageUrl"
          width="100%"
          alt=""
        >
      </el-dialog>
    </div>
    <PicturePreview ref="picturePreview" />
  </div>
</template>

<script>
import { getOrderDetailById } from '@/api/crm/contract/contract.js'
import PicturePreview from '@/components/PicturePreview/PicturePreview'
export default {
  components: {
    PicturePreview
  },
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: '',
      loading: false,
      contractDetail: {},
      contractImgs: '',
      imgArrayList: [], // 附件图片
      detailsTabComHidden: true, // 如果是赠送合同就不显示，不显示是false
      detailsTabComShow: true, // 如果是赠送合同就显示，显示是true
      shopClassMountHidde: true // 托班时商品课时数量不显示，显示是true
    }
  },
  methods: {
    preView(item, index) {
      // this.dialogVisible = true
      // this.dialogImageUrl = item
      this.$refs.picturePreview.show(this.imgArrayList, index + 1)
    },
    getDetailList(orderId) {
      this.loading = true
      const params = {
        id: orderId
      }
      getOrderDetailById(params).then(res => {
        if (res.data.errorCode === 0) {
          this.contractDetail = res.data.data
          this.contractImgs = this.contractDetail.imgUrl
          this.imgArrayList = this.contractImgs.split(',')
        } else {
          this.$message.error(res.data.errorMessage)
        }
        // 控制赠送合同内容的显隐
        if (res.data.data.purchaseType === '2') { // 判断是否赠送合同，控制显隐
          this.detailsTabComHidden = false // 赠送合同不显示的内容
          this.detailsTabComShow = true // 赠送合同显示的内容
        } else if (res.data.data.purchaseType === '3') {
          this.detailsTabComHidden = true
          this.detailsTabComShow = true
        } if (res.data.data.purchaseType === '1') {
          this.detailsTabComHidden = true
          this.detailsTabComShow = true
        }

        // 控制如果是托班套餐-商品-课时数量不显示
        if (res.data.data.type === '3') {
          this.shopClassMountHidde = false
        } else {
          this.shopClassMountHidde = true
        }
      })
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.detailTabCom_container {
  height: calc(100vh - 267px);
  overflow: auto;
  .detailTabCom_wrap {
    padding: 0 30px;
    p,
    .item_lable_shop {
      font-size: 14px;
      line-height: 30px;
      margin-bottom: 2px;
      overflow: hidden;
      span:nth-of-type(1) {
        display: inline-block;
        float: left;
        text-align: right;
        width: 90px;
        margin-right: 10px;
        color: #999;
      }
      ul {
        display: inline-block;
        float: left;
        width: 700px;
        li {
          // display: inline-block;
          display: flex;
          height: 40px;
          line-height: 40px;
          border: 1px solid #ddd;
          border-top-width: 0;
          p {
            display: inline-block;
            text-align: center;
            vertical-align: top;
            height: 40px;
            line-height: 40px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #666;
          }
        }
        li:nth-of-type(1) {
          background: #f1f1f1;
          border: 1px solid #ddd;
        }
      }
    }
    .item_lable_goods {
      font-size: 14px;
      line-height: 30px;
      margin-left: -0.5%;
      margin-top: 30px;
      span:nth-of-type(1) {
        display: inline-block;
        text-align: right;
        width: 90px;
        margin-right: 10px;
        color: #999;
      }
      ul {
        display: inline-block;
        width: 600px;
        li {
          // display: inline-block;
          display: flex;
          height: 40px;
          line-height: 40px;
          border: 1px solid #ddd;
          border-top-width: 0;
          p {
            display: inline-block;
            text-align: center;
            vertical-align: top;
            height: 40px;
            line-height: 40px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #666;
          }
        }
        li:nth-of-type(1) {
          background: #f1f1f1;
          border: 1px solid #ddd;
        }
      }
    }
    .item_lable_total {
      font-size: 14px;
      line-height: 30px;
      width: 800px;
      float: left;
      margin-top: 30px;
      margin-bottom: 30px;
      span:nth-of-type(1) {
        display: inline-block;
        float: left;
        text-align: right;
        width: 90px;
        margin-right: 10px;
        color: #999;
      }
      ul {
        display: inline-block;
        float: left;
        width: 350px;
        li {
          // display: inline-block;
          display: flex;
          height: 40px;
          line-height: 40px;
          border: 1px solid #ddd;
          border-top-width: 0;
          p {
            display: inline-block;
            text-align: center;
            vertical-align: top;
            height: 40px;
            line-height: 40px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #666;
          }
        }
        li:nth-child(1) {
          background: #f1f1f1;
          border: 1px solid #ddd;
        }
      }
    }
    .item_lable_sale {
      font-size: 14px;
      line-height: 30px;
      margin-left: -3px;
      margin-bottom: 30px;
      width: 800px;
      float: left;
      overflow: hidden;
      span:nth-of-type(1) {
        display: inline-block;
        text-align: right;
        width: 90px;
        margin-right: 10px;
        color: #999;
      }
      span:nth-of-type(2) {
        font-size: 14px;
        color: #666;
        line-height: 30px;
      }
      ul {
        display: inline-block;
        width: 350px;
        li {
          // display: inline-block;
          display: flex;
          height: 40px;
          line-height: 40px;
          border: 1px solid #ddd;
          border-top-width: 0;
          p {
            display: inline-block;
            text-align: center;
            vertical-align: top;
            height: 40px;
            line-height: 40px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #666;
          }
        }
        li:nth-child(1) {
          background: #f1f1f1;
          border: 1px solid #ddd;
        }
      }
    }
    .item_lable_expend {
      font-size: 14px;
      line-height: 30px;
      margin-left: -3px;
      margin-bottom: 30px;
      width: 800px;
      float: left;
      overflow: hidden;
      span:nth-of-type(1) {
        display: inline-block;
        text-align: right;
        width: 90px;
        margin-right: 10px;
        color: #999;
      }
      span:nth-of-type(2) {
        font-size: 14px;
        color: #666;
        line-height: 30px;
      }
      ul {
        display: inline-block;
        width: 350px;
        li {
          // display: inline-block;
          display: flex;
          height: 40px;
          line-height: 40px;
          border: 1px solid #ddd;
          border-top-width: 0;
          p {
            display: inline-block;
            text-align: center;
            vertical-align: top;
            height: 40px;
            line-height: 40px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #666;
          }
        }
        li:nth-child(1) {
          background: #f1f1f1;
          border: 1px solid #ddd;
        }
      }
    }
  }
}
</style>

