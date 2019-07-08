<template>
  <div v-if="isDraggable" class="drap-list-box">
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
          <div class="list-pic">
            <img :src="element.icon">
            <i
              :class="action"
              @click="() => {otherAction(index)}"
            />
          </div>
          <p :style="{marginTop: '6px'}">{{ element.name }}</p>
        </li>
      </transition-group>
    </draggable>
    <NullData
      v-else
      :text="type === 'selected' ? '请在下方添加快捷入口' : '暂无可添加快捷入口'"
      style="height:300px"
    />
  </div>
  <div v-else class="drap-list-box">
    <ul class="list-group" style="display: flex; flex-wrap: wrap;">
      <li
        v-for="(element, index) in list"
        :key="'drap' + index"
        class="list-group-item"
        style="cursor: default"
      >
        <div class="list-pic">
          <img :src="element.icon">
          <i
            :class="action"
            @click="() => {otherAction(index)}"
          />
        </div>
        <p :style="{marginTop: '6px'}">{{ element.name }}</p>
      </li>
    </ul>
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
    },
    isDraggable: {
      type: Boolean,
      default: true
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
        return 'el-icon-remove entry-action-remove'
      } else {
        return 'el-icon-circle-plus entry-action-add'
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

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
  & > span {
    @include flex;
    @include flexWrap;
  }
}
.list-group-item {
  cursor: move;
  list-style-type: none;
  width: 25%;
  text-align: center;
  margin-top: 20px;
}
.list-pic {
  position: relative;
  width: 50px;
  height: 50px;
  margin: 0 auto;
  img {
    width: 100%;
    height: 100%;
  }
  .entry-action-remove {
    color: #fa4816;
    position: absolute;
    top: -3px;
    right: -3px;
    background: #fff;
    border-radius: 50%;
  }

  .entry-action-add {
    color: #46b6ee;
    position: absolute;
    top: -3px;
    right: -3px;
    background: #fff;
    border-radius: 50%;
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
