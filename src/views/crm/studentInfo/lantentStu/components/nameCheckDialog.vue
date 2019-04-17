<template>
  <div>
    <el-dialog
      :visible.sync="nameCheckDialogShow"
      :close-on-click-modal="false"
      title="名单查重"
      class="nameCheckDialog_container"
      width="700px"
      @close="cancelDialog()"
    >
      <div>
        <!-- 表格 -->
        <CommonTable
          ref="tableCommon"
          :columns="columns"
          :table-height="tableHeight"
          :pagination="listQuery"
          :options="options"
          :data-source="dataSource"
          :is-high-light="true"
        />
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <Confirm
          :text="'是同一学员'"
          :placement="'top'"
          :content="'将清除已填信息，是否继续添加新学员'"
          :confirm="()=>{sure()}"
          :is-visible-fun="false"
          :is-button="true"
          :btn-type="'primary'"
          @toCancel="()=>{closeAllDialog()}"
        />
        <el-button
          class="cancel_btn"
          @click="cancelDialog()"
        >不是同一学员</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CommonTable from './../../../../../components/CommonTable/CommonTable'
import Confirm from '@/components/MiniCommon/Confirm'
export default {
  components: {
    CommonTable,
    Confirm
  },
  props: {
    dataSource: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      nameCheckDialogShow: false,
      listQuery: {
        show: false // 是否显示
      },
      columns: [
        {
          label: '学员姓名',
          prop: 'name',
          isShowTooltip: true,
          width: 100
        },
        {
          label: '性别',
          prop: 'gender',
          isShowTooltip: true,
          width: 70
        },
        {
          label: '生日',
          prop: 'birthday',
          isShowTooltip: true,
          width: 100
        },
        {
          label: '昵称',
          prop: 'nickName',
          isShowTooltip: true,
          width: 100
        },
        {
          label: '家长姓名',
          prop: 'parent',
          width: 100,
          render: (h, params) => {
            return h('span', {}, [
              h(
                'span',
                params.row.parent && params.row.parent.length > 1
                  ? [
                    h(
                      'el-popover',
                      {
                        props: { placement: 'top', trigger: 'hover' }
                      },
                      [
                        h(
                          'div',
                          params.row.parent &&
                            params.row.parent.map(item => {
                              return h('div', { style: 'margin-right:10px' }, item)
                            })
                        ),
                        h(
                          'span', { slot: 'reference' }, [
                            h(
                              'div',
                              params.row.parent[0].split(':')[0] + ' '
                            ),
                            h(
                              'a',
                              { style: 'margin: 0 0 0 5px' },
                              '共' + params.row.parent.length + '人'
                            )
                          ]
                        )
                      ]
                    )
                  ]
                  : params.row.parent && params.row.parent.length === 1
                    ? [
                      h(
                        'el-popover',
                        {
                          props: { placement: 'top', trigger: 'hover' }
                        },
                        [
                          h(
                            'div',
                            params.row.parent &&
                            params.row.parent.map(item => {
                              return h('div', { style: 'margin-right:10px' }, item)
                            })
                          ),
                          h(
                            'span', { slot: 'reference' }, [
                              h(
                                'span', { style: 'margin-right:5px' },
                                params.row.parent[0].split(':')[0]
                              )
                            ]
                          )
                        ]
                      )
                    ]
                    : null
              )
            ])
          }
        },
        {
          label: '学员所属',
          prop: 'stuType',
          isShowTooltip: true
        },
        {
          label: '创建时间',
          prop: 'createTime',
          isShowTooltip: true,
          width: 100
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
      tableHeight: 'calc(100vh - 595px)'
    }
  },
  methods: {
    /* 打开新增跟进弹框 */
    openAddFollowDialog(row, type) {
      this.$refs.addFollowDialog.showDialog(row, type)
    },
    /* 显示弹框 */
    showDialog(name) {
      this.nameCheckDialogShow = !this.nameCheckDialogShow
    },
    /* 关闭弹框 */
    cancelDialog() {
      this.nameCheckDialogShow = false
    },
    /* 关闭所有弹窗 */
    closeAllDialog() {
      this.nameCheckDialogShow = false
      this.$emit('toCloseDialog')
    },
    /* 确定 */
    sure() {
      this.nameCheckDialogShow = false
      this.$emit('toClearDialog')
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

