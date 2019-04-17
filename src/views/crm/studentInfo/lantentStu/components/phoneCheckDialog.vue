<template>
  <div>
    <el-dialog
      :visible.sync="nameCheckDialogShow"
      :append-to-body="true"
      title="手机号查重"
      width="700px"
      class="nameCheckDialog_container"
      @close="cancelDialog()"
    >
      <div class="table">
        <!-- 表格 -->
        <CommonTable
          ref="tableCommon"
          :columns="columns"
          :table-height="tableHeight"
          :pagination="listQuery"
          :options="options"
          :data-source="dataSource"
          :is-high-light="true"
          @handleRowSelect="handleRowSelect"
        />
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="submit()"
        >是同一家长</el-button>
        <el-button
          class="cancel_btn"
          @click="cancelDialog()"
        >不是同一家长</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CommonTable from './../../../../../components/CommonTable/CommonTable'
export default {
  components: {
    CommonTable
  },

  props: {
    isDetail: {
      type: Boolean,
      default: false
    },
    dataSource: {
      type: Array,
      default: () => {
        return []
      }
    }
  },

  data() {
    // const operates = this.isDetail ? undefined : {
    //   width: '110',
    //   fixed: 'right',
    //   list: [
    //     {
    //       label: '新增跟进',
    //       type: 'normal',
    //       method: (row, type) => {
    //         this.openAddFollowDialog(row, '1')
    //       }
    //     }
    //   ]
    // }

    return {
      nameCheckDialogShow: false,
      isNoNameFind: false,
      listQuery: {
        show: false // 是否显示
      },
      columns: [
        {
          label: '家长姓名',
          prop: 'parentName',
          width: 100
        },
        {
          label: '学员姓名',
          prop: 'stuName',
          isShowTooltip: true,
          width: 100
        },
        {
          label: '性别',
          prop: 'sex',
          isShowTooltip: true,
          width: 70,
          formatter: (row) => {
            if (row.sex == '1') { //eslint-disable-line
              return `男`
            } else if (row.sex == '2') { //eslint-disable-line
              return `女`
            }
          }
        },
        {
          label: '生日',
          prop: 'birthday',
          isShowTooltip: true,
          width: 120
        },
        {
          label: '昵称',
          prop: 'nickName',
          isShowTooltip: true,
          width: 100
        },
        {
          label: '学员所属',
          prop: 'belongStu',
          isShowTooltip: true
        },
        {
          label: '创建时间',
          prop: 'createTime',
          isShowTooltip: true,
          width: 120
        },
        {
          label: '负责销售',
          prop: 'seller',
          isShowTooltip: true
        }
      ],
      options: {
        isSettingShow: false // 是否出现设置
      },
      tableHeight: this.isDetail ? 'calc(100vh - 400px)' : 'calc(100vh - 595px)',
      currentRow: {}, // 当前选中的行的数据
      index: 0
    }
  },
  methods: {
    /* 显示弹框 */
    showDialog(index) {
      this.nameCheckDialogShow = !this.nameCheckDialogShow
      this.currentRow = {}
      this.index = index
    },
    /* 当前选中的行 */
    handleRowSelect(row) {
      this.currentRow = row
    },
    /* 是同一家长 */
    submit() {
      if (JSON.stringify(this.currentRow) == '{}') { //eslint-disable-line
        this.$message.warning('请选择同一家长')
      } else {
        this.nameCheckDialogShow = false
        this.$emit('toEditParent', this.currentRow, this.index)
      }
    },
    /* 关闭弹框 */
    cancelDialog() {
      this.nameCheckDialogShow = false
      this.$emit('toClose')
    }
  }
}
</script>

<style lang="scss" scoped>
.nameCheckDialog_container /deep/ {
  .el-dialog__body {
    margin-bottom: 14px;
  }
  .nothing_name_find {
    height: 438px;
    vertical-align: middle;
    display: table-cell;
    text-align: center;
    width: 700px;
    color: #999;
  }
}
</style>

