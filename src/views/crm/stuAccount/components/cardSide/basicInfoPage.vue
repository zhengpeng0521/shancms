<template>
  <div class="basicInfo_container">
    <div class="heard_top">
      <span>会员卡号: {{ cardInfoData.cardId }}</span>
      <span>创建时间: {{ cardInfoData.createTime }}</span>
    </div>
    <div class="table_con">
      <table border="1">
        <tr style="background: #f5f6f8">
          <th>课时类型</th>
          <th>剩余课时</th>
          <th>已冻结课时</th>
          <th>可用课时</th>
        </tr>
        <tr
          v-for="(item,index) of baseInfoData"
          :key="index + '_basicInfo'"
        >
          <td>{{ item.courseName }}</td>
          <td>{{ item.periodPackage+item.periodExt }}</td>
          <td>{{ item.periodFreeze }}</td>
          <td>{{ item.periodLeft }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { getBaseInfo } from '@/api/crm/stuAccount/stuAccount.js'
export default {
  data() {
    return {
      cardInfoData: {}, // 会员卡人员基本信息
      baseInfoData: []
    }
  },
  created() {
  },
  methods: {
    /* 获取基本信息数据 */
    getBaseInfoList(row) {
      const params = {
        cardId: row.id
      }
      getBaseInfo(params).then(res => {
        if (res.data && res.data.errorCode === 0) {
          this.cardInfoData = res.data.cardInfo
          this.baseInfoData = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.basicInfo_container {
  .heard_top {
    margin-bottom: 10px;
    span {
      color: rgb(153, 153, 153);
    }
    span:nth-child(2) {
      margin-left: 10px;
    }
  }
  .table_con {
    color: #666;
    table {
      border-collapse: collapse;
    }
    table,
    td,
    th {
      border: 1px solid #ddd;
    }
    table {
      width: 400px;
    }
    th {
      height: 32px;
      font-weight: 500;
    }
    td {
      height: 32px;
      text-align: center;
    }
  }
}
</style>

