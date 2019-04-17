<template>
  <el-dialog
    :visible.sync="visible"
    title="机构概况设置"
    width="700px"
    custom-class="org-data-dialog"
    @closed="close"
  >
    <BlockTitle>
      <p class="org-title">已选<span>*拖动列表可调整排序</span></p>
    </BlockTitle>
    <OrgDataList
      v-loading="dialogLoading"
      ref="selected"
      :data-source="newSelected"
      element-loading-text="拼命加载中"
      type="selected"
      @changeSort="changeSort"
      @remove="remove"
    />
    <div class="org-line" />
    <BlockTitle><p class="org-title">未选</p></BlockTitle>
    <OrgDataList
      v-loading="dialogLoading"
      ref="unselected"
      :data-source="newUnselected"
      :select="newSelected"
      element-loading-text="拼命加载中"
      type="unselected"
      @changeSort="changeUnselect"
      @add="add"
    />
    <!-- <el-tabs
      v-model="activeName"
      @tab-click="tabChange"
    >
      <el-tab-pane name="selected">
        <span slot="label">已选({{ newSelected.length }})</span>
        <OrgDataList
          v-if="newSelected.length > 0"
          ref="selected"
          :data-source="newSelected"
          type="selected"
          @changeSort="changeSort"
          @remove="remove"
        />
        <NullData
          v-else
          text="请点击「未选」标签、添加机构概况"
          style="height:300px"
        />
      </el-tab-pane>
      <el-tab-pane name="unselected">
        <span slot="label">未选({{ newUnselected.length }})</span>
        <OrgDataList
          v-if="newUnselected.length > 0"
          ref="unselected"
          :data-source="newUnselected"
          :select="newSelected"
          type="unselected"
          @changeSort="changeUnselect"
          @add="add"
        />
        <NullData
          v-else
          text="暂无可添加机构概况"
          style="height:300px"
        />
      </el-tab-pane>
    </el-tabs> -->
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
import OrgDataList from './OrgDataList'
import BlockTitle from '@/components/MiniCommon/BlockTitle'
import { sortByObj } from '@/utils/arrayUtils'

export default {

  components: {
    OrgDataList,
    BlockTitle
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
      activeName: 'selected',
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
    /** tab切换 */
    tabChange(tab) {
      this.$refs[tab.name].sort()
    },

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

      this.$emit('saveSet', tempList, 'orgData', this.close)
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
.org-title {
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
.org-line {
  width: 100%;
  height: 1px;
  background: #ddd;
  margin: 20px 0 10px;
}
</style>

<style lang="scss">
.org-data-dialog .el-tabs__nav-scroll,
.org-data-dialog .el-tabs__content {
  padding: 0;
}
.org-data-dialog .el-dialog__body {
  padding-right: 20px !important;
}
</style>
