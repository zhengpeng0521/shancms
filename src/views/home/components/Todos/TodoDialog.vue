<template>
  <el-dialog
    :visible.sync="visible"
    title="待办事项设置"
    width="700px"
    custom-class="home-todo-dialog"
    @close="close"
  >
    <el-table
      v-loading="loading"
      :data="todoSetList"
      element-loading-text="拼命加载中"
      header-cell-class-name="home-todo-header"
      stripe
      style="width: 100%;border:1px solid rgba(221,221,221,.6)"
    >
      <el-table-column
        prop="name"
        label="待办事项"
        min-width="140"
      />
      <el-table-column
        prop="desc"
        label="示例"
        min-width="220"
      />
      <el-table-column
        prop="isTip"
        label="是否提示"
        min-width="100"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="isTips[scope.$index]"
            active-value="1"
            inactive-value="0"
            @change="(value) => {switchChange(value, scope.$index)}"
          />
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer">
      <el-button @click="close">取 消</el-button>
      <el-button
        type="primary"
        @click="saveSet"
      >保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    todoSetList: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    }
  },

  data() {
    const isTips = []
    this.todoSetList.forEach(item => {
      isTips.push(item.isTip)
    })

    return {
      isTips,
      visible: false,
      tempList: this.todoSetList
    }
  },

  watch: {
    todoSetList(val) {
      const isTips = []
      val.forEach(item => {
        isTips.push(item.isTip)
      })
      this.tempList = val
      this.isTips = isTips
    }
  },

  methods: {
    /** 开关 */
    switchChange(value, index) {
      this.tempList[index].isTip = value
    },

    /** 保存 */
    saveSet() {
      const saveList = []
      this.tempList.forEach((item, index) => {
        if (item.isTip === '1') {
          saveList.push({
            ...item
          })
        }
      })
      saveList.forEach(item => {
        delete item.isTip
      })

      this.$emit('saveSet', saveList, 'todoList', this.close)
    },

    /** 关闭 */
    close() {
      this.visible = false
    }
  }
}
</script>

<style lang="scss">
.home-todo-header {
  height: 44px;
  background-color: rgba(240, 242, 245, 0.6) !important;
  font-size: 14px;
  color: #666;
  font-weight: normal;
}

.home-todo-dialog {
  .el-table {
    border-radius: 4px;
  }

  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background: rgba(240, 242, 245, 0.2);
  }
  .el-table td,
  .el-table th.is-leaf {
    border: none;
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background: rgba(70, 182, 238, 0.1);
  }

  .el-table--mini td,
  .el-table--mini th {
    padding: 12px 0;
  }
  .el-table .cell {
    font-size: 14px;
    color: #666;
    line-height: 14px;
  }
}
</style>
