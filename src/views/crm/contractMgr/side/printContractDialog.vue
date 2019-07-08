<template>
  <div>
    <el-dialog
      :visible.sync="importDialogShow"
      class="printContractDialog_cotainer"
      title="缴费信息"
      width="800px"
    >
      <div
        id="print_content"
        class="print_dialog_wrap"
      >
        <div
          class="print_school"
          style="text-align: center;font-size: 18px;"
        >{{ printData.organName }}</div>
        <div
          class="print_title"
          style="text-align: center;font-size: 15px; margin-top: 5px;"
        >缴费单</div>
        <div class="containt1">
          <div class="left">
            <span>学员姓名:</span>
            <span>{{ printData.stuName }}</span>
          </div>
          <div class="right">
            <span>收款单号:</span>
            <span>{{ printData.orderId }}</span>
          </div>
        </div>
        <div style="margin: 16px 0;">
          <table
            border="1"
            style="border-collapse: collapse;width:100%"
          >
            <tr style="background: #f5f6f8;">
              <th style="height:32px;border: 1px solid #ddd;">交易内容</th>
              <th style="height:32px;border: 1px solid #ddd;">数量</th>
              <th style="height:32px;border: 1px solid #ddd;">优惠</th>
              <th style="height:32px;border: 1px solid #ddd;">应收</th>
              <!-- <th style="height:32px;border: 1px solid #ddd;">实收</th> -->
            </tr>
            <tr
              v-for="(item,index) of printData.content"
              :key="index"
            >
              <td style="height: 32px;text-align: center;border: 1px solid #ddd;">{{ item.content }}</td>
              <td style="height: 32px;text-align: center;border: 1px solid #ddd;">{{ item.amount }}</td>
              <td style="height: 32px;text-align: center;border: 1px solid #ddd;">{{ item.discount }}</td>
              <td style="height: 32px;text-align: center;border: 1px solid #ddd;">￥{{ item.money }}</td>
              <!-- <td style="height: 32px;text-align: center;border: 1px solid #ddd;">￥{{ item.money }}</td> -->
            </tr>
            <tr>
              <td
                colspan="3"
                style="height: 32px;text-align: center;border: 1px solid #ddd;"
              >总计</td>
              <td style="height: 32px;text-align: center;border: 1px solid #ddd;">￥{{ printData.totalMoney }}</td>
              <!-- <td style="height: 32px;text-align: center;border: 1px solid #ddd;">￥{{ printData.totalMoney }}</td> -->
            </tr>
          </table>
        </div>
        <!-- <div
          class="print_info"
          style="display: flex;"
        >
          <p style="width: 260px;">
            <span>账户变动:</span>
            <span>{{ printData.money || 0 }}.00 元</span>
          </p>
          <p>
            <span>课时变动:</span>
            <span>{{ printData.classChange }}</span>
          </p>
        </div>
        <div
          class="print_info"
          style="display: flex;"
        >
          <p style="width: 260px;">
            <span>当前余额:</span>
            <span>{{ printData.balance || 0 }}.00 元</span>
          </p>
          <p>
            <span>当前课时:</span>
            <span>{{ printData.nowClass }}</span>
          </p>
        </div>
        <div
          class="print_info"
          style="display: flex;"
        >
          <p style="width: 260px;">
            <span>经办人:</span>
            <span>{{ printData.operator }}</span>
          </p>
          <p>
            <span>经办日期:</span>
            <span>{{ printData.createTime }}</span>
          </p>
        </div>
        <div
          class="print_info"
          style="display: flex;"
        >
          <p style="width: 260px;">
            <span>电话:</span>
            <span>{{ printData.tel }}</span>
          </p>
          <p>
            <span>地址:</span>
            <span>{{ printData.address }}</span>
          </p>
        </div> -->
        <div class="print_info">
          <p>
            <span>经办日期:</span>
            <span>{{ printData.createTime }}</span>
          </p>
          <p style="width: 260px;">
            <span>经办人:</span>
            <span>{{ printData.operator }}</span>
          </p>
          <p style="width: 260px;">
            <span>电话:</span>
            <span>{{ printData.tel }}</span>
          </p>
          <p>
            <span>地址:</span>
            <span>{{ printData.address }}</span>
          </p>
          <div
            class="print_info print_last"
            style="display: flex; margin: 20px 0;justify-content: space-between;"
          >
            <p style="width: 260px;">
              <span>经办人签字:</span>
            </p>
            <p style="margin-right: 400px;">
              <span>客户签字:</span>
            </p>
          </div>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="print"
        >打 印</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { do_print } from '@/utils/printUtils'
import { getOrderPrint } from '@/api/crm/contract/contract.js'
export default {
  components: {
  },
  data() {
    return {
      importDialogShow: false,
      printData: {}
    }
  },
  computed: {
  },

  mounted() {
  },

  methods: {
    showDialog(row) {
      const params = {
        orderId: row.orderNumber
      }
      getOrderPrint(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.printData = data
          this.importDialogShow = true
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 打印 */
    print() {
      do_print('print_content')
    }
  }
}
</script>

<style lang="scss" scoped>
// .printContractDialog_cotainer /deep/ {
//   .print_dialog_wrap {
//     .print_school {
//       text-align: center;
//       font-size: 18px;
//     }
//     .print_title {
//       text-align: center;
//       font-size: 15px;
//       margin-top: 5px;
//     }
//     .print_info {
//       display: flex;
//       p:nth-child(1) {
//         width: 260px;
//       }
//     }
//     .print_last {
//       margin-top: 20px;
//       justify-content: space-between;
//       p:nth-child(2) {
//         margin-right: 150px;
//       }
//     }
//     table {
//       border-collapse: collapse;
//     }
//     table,
//     td,
//     th {
//       border: 1px solid #ddd;
//     }
//     table {
//       width: 100%;
//     }
//     th {
//       height: 32px;
//     }
//     td {
//       height: 32px;
//       text-align: center;
//     }
//   }
// }
 .containt1{
    display: flex;
    justify-content: space-between;
 }
 .print_info{
    padding: 6px 0;
    p{
       padding: 6px 0;
    }
 }
</style>

