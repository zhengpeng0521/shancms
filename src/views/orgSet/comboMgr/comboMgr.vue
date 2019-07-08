<template>
  <div>
    <div class="combo_mgr">
      <div class="page_title_text">
        系统续费
      </div>

      <div style="display: flex;color: #666666;">
        <div>
          <span>
            我的套餐：
          </span>

        </div>

        <div style="margin-left:10px">
          <p>
            <span>{{ zsbTitle }}</span><span class="remain_day">（剩{{ zsb }}天）</span>
          </p>
          <p class="saas_combo">
            <span>{{ saasTitle }}</span><span class="remain_day">（剩{{ saas }}天）</span>
          </p>

          <el-popover
            placement="top-start"
            width="240"
            trigger="hover"
          >

            <img
              class="connect_popover_img"
              src="http://img.ishanshan.com/gimg/img/f696b637df0aba27f96116ca10e6756c"
            >
            <el-button
              slot="reference"
              class="combo_btn"
              type="primary"
            >续费/升级</el-button>
          </el-popover>

        </div>

      </div>
    </div>
    <div
      v-if="showChange"
      class="combo_mgr"
    >
      <div class="page_title_text">系统续费</div>
      <el-table
        :data="tableData"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column
          prop="mealTitle"
          label="套餐名称"
          width="150"
        />
        <el-table-column
          prop="startDay"
          label="开始日期"
          width="150"
        />
        <el-table-column
          prop="endDay"
          label="到期日期"
          width="150"
        />

        <el-table-column
          prop="qnao"
          label="操作"
          width="150"
        >
          <template slot-scope="scope">
            <el-popover
              trigger="hover"
              placement="top"
            >
              <span style="display:none">{{ scope.name }}</span>
              <img
                class="connect_popover_img"
                src="http://img.ishanshan.com/gimg/img/f696b637df0aba27f96116ca10e6756c"
              >
              <div
                slot="reference"
                style="color:#48B5ED"
              >续费</div>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>

      <!-- <CommonTable
      :columns="columns"
      :options="optionsTab"
      :table-key="'orgSet_payAccount_payRec'"
    />-->
    </div>
  </div>
</template>

<script>
import { queryMealOpening } from "@/api/orgSet/comboMgr"; //eslint-disable-line
import { getInfoList } from '@/api/home/home'
// import { queryPaymentAccountList } from '@/api/orgSet/payAccount';
import CommonTable from '@/components/CommonTable/CommonTable'

export default {
  components: {
    CommonTable
  },
  data() {
    return {
      showChange: false,
      data: {
        isHome: 0
      },
      zsb: '0',
      zsbTitle: '招生宝付费套餐',
      saas: '0',
      saasTitle: '云校付费套餐',
      tableData: [],
      // listQuery: {
      //   show: true // 是否显示
      // },

      columns: [
        // {
        //   label: "套餐名称",
        //   prop: "mealTitle"
        // },
        // {
        //   label: "开始日期",
        //   prop: "startDay"
        // },
        // {
        //   label: "到期日期",
        //   prop: "endDay"
        // },
      ]
      //   optionsTab: {
      //   // mutiSelect: 'selection', // 是否多选
      //   apiService: getInfoList, // 表格的数据请求接口
      //   params:{ isHome: 0}
      //   // isSettingShow: true // 是否出现设置
      // },
    }
  },
  mounted() {
    this.getDate()
  },
  methods: {
    getDate() {
      queryMealOpening().then(res => {
        if (res.data.errorCode === 0) {
          this.zsbTitle = res.data.data.zsbMealTitle
          this.zsb = res.data.data.zsbExpireDays
          this.saasTitle = res.data.data.saasMealTitle
          this.saas = res.data.data.saasExpireDays
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })

      getInfoList(this.data).then(res => {
        const data = res.data
        if (data.errorMessage === '成功') {
          this.tableData = data.mealResults
          // this.$refs.tableCommon.getList();
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.combo_mgr {
  width: 641px;
}
.combo_mgr /deep/ .el-table__row {
  height: 50px;
}
.combo_mgr /deep/ .el-table__row .cee {
  font-size: 13px;
}

.combo_mgr /deep/ .has-gutter tr {
  background: #f2f2f2;
  color: #333;
  font-size: 13px;
}
.combo_mgr /deep/ .el-table th,
.el-table tr {
  background: none;
}
.combo_mgr /deep/ .page_title_text {
  font-weight: 600;
}
.combo_mgr {
  padding: 20px;
}

.remain_day {
  color: #46b6ee;
}

.connect_popover_img {
  width: 100%;
  height: 100%;
  border-radius: 5px;
}

.saas_combo {
  margin-top: 20px;
}

.combo_btn {
  margin-top: 20px;
}
</style>
