<template>
  <div class="drap-list-box">
    <div class="drap-table">
      <div class="table-head">
        <span />
        <span>数据</span>
        <span>描述</span>
        <span>操作</span>
      </div>
      <draggable
        v-if="dataSource.length > 0"
        v-model="list"
        v-bind="dragOptions"
        class="list-group"
        tag="ul"
        @start="drag = true"
        @end="endMove"
      >
        <transition-group
          :name="!drag ? 'flip-list' : null"
          type="transition"
        >
          <li
            v-for="(element, index) in list"
            :key="'drap' + index"
            class="list-group-item"
          >
            <i
              :class="
                element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'
              "
              aria-hidden="true"
              @click="element.fixed = !element.fixed"
            />
            <span class="item-common"><img :src="element.icon"></span>
            <span class="item-common">{{ element.name }}</span>
            <span class="item-common">{{ element.desc }}</span>
            <el-button
              type="text"
              class="item-common"
              @click="() => {otherAction(index)}"
            >{{ action }}</el-button>
          </li>
        </transition-group>
      </draggable>
      <NullData
        v-else
        :text="type === 'selected' ? '暂无已添加机构概况' : '暂无可添加机构概况'"
        style="height:300px"
      />
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import NullData from '@/components/MiniCommon/NullData'

export default {
  components: {
    draggable,
    NullData
  },

  props: {
    dataSource: {
      type: Array,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    select: {
      type: Array,
      default: () => ([])
    }
  },

  data() {
    return {
      list: this.dataSource,
      drag: false
    }
  },

  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: this.type,
        disabled: false,
        ghostClass: 'ghost'
      }
    },

    action() {
      if (this.type === 'selected') {
        return '移除'
      } else {
        return '添加'
      }
    }
  },

  watch: {
    dataSource(val) {
      this.list = val
    }
  },

  methods: {
    /** 重置 */
    sort() {
      this.list = this.list.sort((a, b) => a.sort - b.sort)
    },

    /** 移动结束 */
    endMove(e) {
      this.drag = false
      this.$emit('changeSort', this.list)
    },

    otherAction(index) {
      if (this.type === 'unselected' && this.select.length >= 8) {
        return this.$message.error('最多可添加8项')
      }
      const newArr = [...this.list]
      newArr.splice(index, 1)
      this.list = newArr
      if (this.type === 'selected') {
        this.$emit('remove', newArr, index)
      } else {
        this.$emit('add', newArr, index)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";

.drap-table {
  margin-top: 10px;
  border: 1px solid rgba(221, 221, 221, 0.6);
}
.table-head {
  background: rgba(240, 242, 245, 0.6);
  @include flex;

  span {
    display: block;
    padding: 15px 0 15px 20px;
    color: #333;
    font-size: 14px;

    &:first-child {
      width: 10%;
      height: 48px;
      vertical-align: top;
    }
    &:nth-child(2) {
      width: 22%;
    }
    &:nth-child(3) {
      width: 50%;
    }
    &:last-child {
      width: 18%;
    }
  }
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
  list-style-type: none;
  height: 44px;
  @include flex;
  @include itemCenter(center);

  &:nth-child(2n) {
    background: rgba(240, 242, 245, 0.2);
  }

  .item-common {
    padding-left: 20px;
    display: inline-block;

    &:nth-child(2) {
      width: 10%;
      text-align: center;
      img {
        width: 24px;
        height: 24px;
      }
    }
    &:nth-child(3) {
      width: 22%;
    }
    &:nth-child(4) {
      width: 50%;
    }
    &:last-child {
      border: none;
    }
  }
}
.list-group-item i {
  cursor: pointer;
}
</style>

<style lang="scss">
.drap-list-box {
  .flip-list-move {
    transition: transform 0.5s;
  }
  .no-move {
    transition: transform 0s;
  }
}
</style>
