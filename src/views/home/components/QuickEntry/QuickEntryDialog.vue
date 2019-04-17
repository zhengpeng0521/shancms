<template>
  <el-dialog
    :visible.sync="visible"
    element-loading-text="拼命加载中"
    title="快捷入口设置"
    width="600px"
    custom-class="quick-entry-dialog"
  >
    <BlockTitle>
      <p class="entry-title">已选<span>*拖动可调整排序</span></p>
    </BlockTitle>
    <QuickEntryList
      v-loading="dialogLoading"
      ref="selected"
      :data-source="newSelected"
      element-loading-text="拼命加载中"
      type="selected"
      @changeSort="changeSort"
      @remove="remove"
    />
    <div class="entry-line" />
    <BlockTitle>
      <p class="entry-title">未选</p>
    </BlockTitle>
    <QuickEntryList
      v-loading="dialogLoading"
      ref="unselected"
      :data-source="newUnselected"
      :select="newSelected"
      element-loading-text="拼命加载中"
      type="unselected"
      @changeSort="changeUnselect"
      @add="add"
    />
    <span slot="footer">
      <el-button
        :loading="dialogLoading"
        @click="close"
      >取 消</el-button>
      <el-button
        :loading="dialogLoading"
        type="primary"
        @click="saveSet"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import BlockTitle from '@/components/MiniCommon/BlockTitle'
import QuickEntryList from './QuickEntryList'
import { sortByObj } from '@/utils/arrayUtils'

export default {
  components: {
    BlockTitle,
    QuickEntryList
  },

  props: {
    dialogLoading: {
      type: Boolean,
      required: true
    },
    selectList: {
      type: Array,
      required: true
    },
    unselectedList: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      visible: false,
      newSelected: this.selectList,
      newUnselected: this.unselectedList
    }
  },

  watch: {
    selectList(val) {
      this.newSelected = [...val]
    },
    unselectedList(val) {
      this.newUnselected = [...val]
    }
  },

  methods: {
    /** 已选拖动 */
    changeSort(newList) {
      this.newSelected = newList
    },

    /** 未选拖动 */
    changeUnselect(newList) {
      this.newUnselected = newList
    },

    /** 移除 */
    remove(list, index) {
      const newArr = [...this.newUnselected]
      newArr.push(this.newSelected[index])
      this.newUnselected = sortByObj(newArr, 'sort')
      this.newSelected = list
    },

    /** 添加 */
    add(list, index) {
      const newArr = [...this.newSelected]
      newArr.push(this.newUnselected[index])
      this.newSelected = sortByObj(newArr, 'sort')
      this.newUnselected = list
    },

    /** 保存 */
    saveSet() {
      const tempList = []
      for (let i = 0; i < this.newSelected.length; i++) {
        tempList.push({
          ...this.newSelected[i]
        })
      }
      for (let i = 0; i < tempList.length; i++) {
        for (let j = 0; j < tempList.length - 1 - i; j++) {
          if (tempList[j].sort > tempList[j + 1].sort) { // 相邻元素两两对比
            const temp = tempList[j + 1].sort // 元素交换
            tempList[j + 1].sort = tempList[j].sort
            tempList[j].sort = temp
          }
        }
      }

      this.$emit('saveSet', tempList, 'shortCut', this.close)
    },

    /** 关闭 */
    close() {
      this.$refs.selected.sort()
      this.$refs.unselected.sort()
      this.visible = false
      this.$parent.orgVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.entry-title {
  position: relative;
  font-size: 16px;
  color: #333;
  span {
    font-size: 14px;
    line-height: 18px;
    color: #999;
    position: absolute;
    top: 0;
    right: 0;
  }
}

.entry-line {
  height: 1px;
  background: #ddd;
  margin: 20px 0 15px;
}
</style>

<style lang="scss">
.quick-entry-dialog .el-dialog__body {
  padding-bottom: 20px !important;
}
</style>
