<template>
  <div
    v-loading="loading"
    element-loading-text="拼命加载中"
  >
    <p class="top-text">请将您上传的文件信息与闪闪系统的信息进行</p>
    <p class="top-text-orange">无配对的文件信息将不会导入系统</p>
    <BlockTitle>商品</BlockTitle>
    <div class="form-content">
      <div class="form-left">
        <div class="form-left-title">
          <div>闪闪表单</div>
          <div>配对数据</div>
        </div>
        <ul class="form-left-list">
          <li
            v-for="(field, index) in fieldList"
            :key="'field'+index"
          >
            <div>{{ field.key === 'name' || field.key === 'firstParentName' || field.key === 'firstParentMobile' ? field.value+' (必填)' : field.value }}</div>
            <div>
              <el-select
                v-model="regex[field.key]"
                placeholder="请选择要映射的选项"
                clearable
                @change="$emit('changeMatch', regex)"
              >
                <el-option
                  v-for="(item, key) in dataSource"
                  :key="'map'+key"
                  :label="item[key]"
                  :value="key"
                  :disabled="selected.indexOf(key) > -1"
                />
              </el-select>
            </div>
          </li>
        </ul>
      </div>

      <div class="form-right">
        <div class="form-right-title">
          未配对文件数据
        </div>
        <ul class="form-right-list">
          <li
            v-for="(item, index) in newSource"
            :key="'source'+index"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import BlockTitle from '@/components/MiniCommon/BlockTitle'

export default {
  components: {
    BlockTitle
  },

  props: {
    loading: {
      type: Boolean,
      required: true
    },
    fieldList: {
      type: Array,
      required: true
    },
    dataSource: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      regex: {}
    }
  },

  computed: {
    tempSource() {
      const arr = []
      this.dataSource.forEach((item, index) => {
        arr.push(item[index])
      })
      return arr
    },

    /** 选择列表 */
    selected() {
      const selected = []
      for (const i in this.regex) {
        selected.push(this.regex[i])
      }
      return selected
    },

    /** 供选择数据源 */
    newSource() {
      const newList = []
      const removeList = []
      for (const i in this.regex) {
        removeList.push(this.regex[i])
      }
      this.tempSource.forEach((item, index) => {
        if (removeList.indexOf(index) === -1) {
          newList.push(item)
        }
      })

      return newList
    }
  },

  mounted() {
    this.$emit('didMount')
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";

.top-text {
  color: #999;
  font-size: 12px;
  margin-top: 20px;
}
.top-text-orange {
  color: #fa4816;
  font-size: 12px;
  margin-bottom: 20px;
}

.form-content {
  @include flex;
}
.form-left {
  width: 392px;
  border: 1px solid #ddd;
  border-radius: 2px;
  .form-left-title {
    line-height: 44px;
    @include flex;
    background: rgba(240, 242, 245, 0.6);
    div {
      padding: 0 20px;
    }
    div:first-child {
      width: 45%;
    }
    div:last-child {
      width: 55%;
    }
  }

  .form-left-list {
    max-height: 400px;
    overflow: auto;
  }
  li {
    line-height: 44px;
    @include flex;
    &:nth-child(2n) {
      background: rgba(240, 242, 245, 0.2);
    }

    &>div {
      padding: 0 20px;
    }
    &>div:first-child {
      width: 45%;
    }
    &>div:last-child {
      width: 55%;
    }
  }
}

.form-right {
  width: 242px;
  border: 1px solid #ddd;
  border-radius: 2px;
  margin-left: 20px;
  .form-right-title {
    line-height: 44px;
    background: rgba(240, 242, 245, 0.6);
    padding: 0 20px;
  }

  .form-right-list {
    max-height: 400px;
    overflow: auto;

    li {
      line-height: 44px;
      padding: 0 20px;
      &:nth-child(2n) {
        background: rgba(240, 242, 245, 0.2);
      }
    }
  }
}
</style>
