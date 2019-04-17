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
        <span>购买类型:</span>
        <span>{{ contractDetail.signType == '0' ? '新签约' : contractDetail.signType == '1' ? '续约' : '' }}</span>
      </p>
      <p>
        <span>合同来源:</span>
        <span>{{ contractDetail.source == '1' ? '校区新增' : contractDetail.source == '2' ? '转校转入' : '' }}</span>
      </p>
      <div class="item_lable">
        <span style="vertical-align: top;">商品:</span>
        <ul>
          <li>
            <p style="width: 140px;">{{ contractDetail.type === '3' ? '托班套餐' : '课时套餐' }}</p>
            <p style="width: 100px;">标准价格</p>
            <p style="width: 70px;">数量</p>
            <p style="width: 100px;">合计价格</p>
            <p style="width: 120px;">优惠</p>
            <p style="width: 120px;">实收价格</p>
          </li>
          <li
            v-for="(item, index) of contractDetail.classpkg"
            :key="index + '_classpkg'"
          >
            <p style="width: 140px;">{{ item.name || '' }}</p>
            <p style="width: 100px;">{{ item.price || '' }}</p>
            <p style="width: 70px;">{{ item.amount || '' }}</p>
            <p style="width: 100px;">{{ item.totalPrice || '' }}</p>
            <p style="width: 120px;">{{ item.preferentialPrice || '' }}</p>
            <p style="width: 120px;">{{ item.money || '' }}</p>
          </li>
        </ul>
      </div>
      <div class="item_lable">
        <span style="vertical-align: top;" />
        <ul>
          <li>
            <p style="width: 140px;">物资</p>
            <p style="width: 100px;">标准价格</p>
            <p style="width: 70px;">数量</p>
            <p style="width: 100px;">合计价格</p>
            <p style="width: 120px;">优惠</p>
            <p style="width: 120px;">实收价格</p>
          </li>
          <li
            v-for="(item, index) of contractDetail.teachTools"
            :key="index + '_teachTools'"
          >
            <p style="width: 140px;">{{ item.name || '' }}</p>
            <p style="width: 100px;">{{ item.price || '' }}</p>
            <p style="width: 70px;">{{ item.amount || '' }}</p>
            <p style="width: 100px;">{{ item.totalPrice || '' }}</p>
            <p style="width: 120px;">{{ item.preferentialPrice || '' }}</p>
            <p style="width: 120px;">{{ item.money || '' }}</p>
          </li>
        </ul>
      </div>
      <div class="item_lable">
        <span style="vertical-align: top;">汇总:</span>
        <ul>
          <li>
            <p style="width: 310px;">总合计</p>
            <p style="width: 100px;">{{ parseFloat(contractDetail.totalOriMoney).toFixed(2) }}</p>
            <p style="width: 120px;">总实收</p>
            <p style="width: 120px;">{{ parseFloat(contractDetail.totalMoney).toFixed(2) }}</p>
          </li>
        </ul>
      </div>
      <div class="item_lable">
        <span style="vertical-align: top;">关联销售:</span>
        <ul style="width: 430px;">
          <li>
            <p style="width: 310px;">销售</p>
            <p style="width: 120px;">占比</p>
          </li>
          <li
            v-for="(item, index) of contractDetail.saleUser"
            :key="index + '_saleUser'"
          >
            <p style="width: 310px;">{{ item.userName || '' }}</p>
            <p style="width: 120px;">{{ item.rate ? item.rate + '%' : '' }}</p>
          </li>
        </ul>
      </div>
      <div v-if="contractDetail.type === '2'">
        <p>
          <span>赠课类型:</span>
          <span>{{ contractDetail.extType == '1' ? '通用课时' : contractDetail.extType == '2' ? '专用课时' : '' }}</span>
        </p>
        <p>
          <span>课程名称:</span>
          <span>{{ contractDetail.courseName || '--' }}</span>
        </p>
        <p>
          <span>赠课课时:</span>
          <span>{{ contractDetail.extPeriod || '0' }}</span>
        </p>
        <p>
          <span>赠课成本:</span>
          <span>{{ contractDetail.extPeriodMoney || '0' }}</span>
        </p>
        <p>
          <span>赠课原因:</span>
          <span>{{ contractDetail.extPeriodReason || '--' }}</span>
        </p>
      </div>
      <div v-if="contractDetail.type === '3'">
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
        >
      </p>
      <p>
        <span>备注:</span>
        <span>{{ contractDetail.remark || '--' }}</span>
      </p>
    </div>
  </div>
</template>

<script>
import { getOrderDetailById } from '@/api/crm/contract/contract.js'
export default {
  data() {
    return {
      loading: false,
      contractDetail: {},
      contractImgs: '',
      imgArrayList: [] // 附件图片
    }
  },
  methods: {
    getDetailList(orderId) {
      this.loading = true
      const params = {
        id: orderId
      }
      getOrderDetailById(params).then(res => {
        if (res.data.errorCode === 0) {
          this.contractDetail = res.data.data
          console.info('this.contractDetail', this.contractDetail, this.contractDetail.extNursery)
          this.contractImgs = this.contractDetail.imgUrl
          this.imgArrayList = this.contractImgs.split(',')
        } else {
          this.$message.error(res.data.errorMessage)
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
    .item_lable {
      font-size: 14px;
      line-height: 30px;
      span:nth-child(1) {
        display: inline-block;
        text-align: right;
        width: 90px;
        margin-right: 10px;
        color: #999;
      }
      span:nth-child(2) {
        font-size: 14px;
        color: #666;
        line-height: 30px;
      }
    }
    .item_lable {
      margin-bottom: 10px;
      ul {
        display: inline-block;
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
        li:nth-child(1) {
          background: #f1f1f1;
          border: 1px solid #ddd;
        }
      }
    }
  }
}
</style>

