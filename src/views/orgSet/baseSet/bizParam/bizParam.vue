<template>
  <div class="role_content">
    <div class="biz-param_left">

      <div>
        <div class="role_title">
          <span style="margin-left: 5px;">业务名称</span>
        </div>

        <ul class="biz-param_items">

          <li
            v-for="(i,index) in leftItems"
            :key="index"
          >

            <div
              v-if="!i.editLi"
              class="no_edit edit_name"
            >

              <span
                class="text_block"
                @click="getItemDetail(i,index)"
              >
                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover"
                >
                  <p> {{ i.typeName }}</p>
                  <i
                    slot="reference"
                    class="el-icon-info"
                  />
                </el-popover>
                <span :class="{active:i.isClick}">
                  {{ i.typeName }}
                </span>
              </span>

              <span
                v-if="isShowLock(i,index)"
                class="fr"
                style="font-size: 14px;"
                @click="openLock(i,index)"
              >
                <el-popover
                  placement="top"
                  width="200"
                  trigger="hover"
                >
                  <div>
                    <p>打开锁定，{{ i.typeName }} 可修改，</p>
                    <p> 关闭来源，{{ i.typeName }}无法修改</p>
                  </div>

                  <svg-icon
                    v-if="i.isLock=='2'"
                    slot="reference"
                    icon-class="icon_gb_lock"
                  />
                  <svg-icon
                    v-else
                    slot="reference"
                    icon-class="icon_gb_unlock"
                  />

                </el-popover>

              </span>
            </div>

          </li>
        </ul>
      </div>
    </div>

    <div class="biz-param_right">

      <p class="role_title">业务参数</p>
      <div class="biz-param_box">
        <ul class="biz-param_items">

          <li
            v-for="(i,index) in rightItems.items"
            :key="index"
          >

            <div
              v-if="!i.editLi"
              class="no_edit"
            >
              <span>
                {{ i.text }}
              </span>

              <span class="fr">

                <el-button
                  :disabled="i.isEdit=='2'"
                  type="text"
                  @click="editItem(i,index)"
                >编辑</el-button>
                <el-popover
                  v-model="i.pop"
                  placement="top"
                  width="160"
                >
                  <p style="margin-bottom: 10px"> <i class="el-icon-warning confirm-icon" />确定删除吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button
                      size="mini"
                      class="delete_btn"
                      @click="i.pop = false"
                    >取消</el-button>
                    <el-button
                      type="primary"
                      class="edit_btn"
                      @click="deleteItem(i,index)"
                    >确定</el-button>
                  </div>
                  <el-button
                    slot="reference"
                    :disabled="i.isEdit=='2'"
                    type="text"
                  >删除</el-button>
                </el-popover>
              </span>

            </div>
            <div
              v-if="i.editLi"
              class="no_edit edit_name"
            >

              <el-input
                v-model="i.text"
                placeholder="请输入业务参数名称"
                clearable
              />
              <span
                style="color:#46b6ee"
                class="fr"
              >
                <span @click="confirmEdit(i,index)">保存</span>
                <span @click="cancelEdit(i,index)">取消</span>
              </span>
            </div>
          </li>
        </ul>

      </div>
      <div class="right_bottom">

        <el-button
          :disabled="isAdd"
          type="primary"
          @click="addRightItem"
        >
          新增
        </el-button>
      </div>

    </div>

  </div>
</template>

<script>
// eslint-disable-next-line
import { dictList, saveChannel, confChannelEditResult, deleteDictItem, updateDictItem, addItem } from '@/api/orgSet/baseSet'

export default {
  data() {
    return {
      editLi: false,
      visible2: false,
      isAdd: false,

      leftItems: [],
      rightItems: {},
      saveChannelData: [],
      channelArr: ['FIRSTCHANNELEDIT', 'SECONDCHANNELEDIT']

    }
  },
  created() {
    this.getLockValue()
  },
  mounted() {
    this.getDictList()
  },

  methods: {
    getDictList() {
      dictList().then(res => {
        if (res.data.errorCode === 0) {
          this.leftItems = res.data.results
          this.$nextTick(() => {
            this.leftItems[0].isClick = true
            this.rightItems = Object.assign({}, res.data.results[0].dictItem)
          })
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    getLockValue() {
      this.channelArr.forEach(v => {
        this.getConfChannelEditResult(v)
      })
    },

    getConfChannelEditResult(val) {
      const data = {
        confkey: val
      }
      confChannelEditResult(data).then(res => {
        if (res.data.errorCode === 0) {
          this.saveChannelData.push(res.data.value)
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    getItemDetail(val, index) {
      this.leftItems.forEach(v => {
        if (v.isClick) {
          delete v.isClick
        }
      })

      const temp = Object.assign({}, val)
      temp.isClick = true

      this.leftItems.splice(index, 1, temp)

      if (val.typeName == '一级来源') {//eslint-disable-line

        temp.dictItem.items.forEach(v => {
          v.isEdit = this.saveChannelData[this.saveChannelData.length - 2]
        })
      }
      if (val.typeName == '二级来源') {//eslint-disable-line
        temp.dictItem.items.forEach(v => {
          v.isEdit = this.saveChannelData[this.saveChannelData.length - 1]
        })
      }
      this.$nextTick(() => {
        this.rightItems = Object.assign([], temp.dictItem)
      })
    },

    openLock(i, index) {
      this.getItemDetail(i, index)

      const data = {}
      // eslint-disable-next-line
      if (i.isLock == '2') {
        data.value = 1
      } else {
        data.value = 2
      }
      // eslint-disable-next-line
      if (i.typeName == '一级来源') {
        data.confKey = 'FIRSTCHANNELEDIT'
      } else {
        data.confKey = 'SECONDCHANNELEDIT'
      }
      saveChannel(data).then(res => {
        if (res.data.errorCode === 0) {
          this.getLockValue()
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    isShowLock(val) {
      if (val.typeName === '一级来源') {
        val.isLock = this.saveChannelData[this.saveChannelData.length - 2]
        // val.dictItem.isEdit = this.saveChannelData[this.saveChannelData.length - 2]
      }
      if (val.typeName === '二级来源') {
        val.isLock = this.saveChannelData[this.saveChannelData.length - 1]
        // val.dictItem.isEdit = this.saveChannelData[this.saveChannelData.length - 1]
      }

      // this.$forceUpdate()
      if (val.typeName === '一级来源' || val.typeName === '二级来源') {
        return true
      }
    },

    isEdit(val) {
      if (val.isEdit == '1') {//eslint-disable-line
        return true
      } else {
        return false
      }
    },
    editItem(i, index) {
      const temp = Object.assign({}, i)
      temp.editLi = true
      this.rightItems.items.splice(index, 1, temp)
      this.$forceUpdate()
    },

    confirmEdit(val, index) {
      if (val.text.length > 0) {
        this.isAdd = false
        val.editLi = false
        const data = {
          code: this.rightItems.code,
          value: val.value,
          text: val.text,
          level: 'org'
        }
        if (val.value) {
          updateDictItem(data).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success(res.data.errorMessage)
            } else {
              this.$message.error(res.data.errorMessage)
            }
          })
        } else {
          const timestamp = (new Date()).valueOf()
          const newObj = {
            code: this.rightItems.code,
            value: String(timestamp),
            text: val.text,
            level: 'org',
            key: String(timestamp)

          }
          addItem(newObj).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success(res.data.errorMessage)
              this.getDictList()
            } else {
              this.$message.error(res.data.errorMessage)
            }
          })
        }

        this.rightItems.items.splice(index, 1, val)
      } else {
        this.$message({
          message: '请输入内容',
          type: 'warning'
        })
      }
    },

    cancelEdit(i, index) {
      const temp = Object.assign({}, i)
      this.isAdd = false
      delete temp.editLi
      if (i.access_control) {
        this.rightItems.items.splice(index, 1, temp)
      } else {
        this.rightItems.items.splice(index, 1)
      }

      this.$forceUpdate()
    },

    deleteItem(val, index) {
      this.visible2 = true
      const data = {
        code: this.rightItems.code,
        value: val.value,
        status: 0,
        level: 'org'
      }

      updateDictItem(data).then(res => {
        if (res.data.errorCode === 0) {
          // this.rightItems.splice(index, 1)
          this.getDictList()
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    addRightItem() {
      const data = {
        pop: false,
        text: '',
        editLi: true
      }
      this.rightItems.items.push(data)
      this.isAdd = true
    }
  }
}
</script>
<style lang="scss" scoped>
.role_content {
  overflow: hidden;
  margin-bottom: 20px;
}
.active {
  color: #46b6ee;
}

.biz-param_left {
  border: 1px solid #f0f2f5;
  border-radius: 5px;
  overflow: auto;
  // max-height: 500px;
  float: left;
  width: 45%;
}

.biz-param_right {
  width: 50%;
  float: left;
  border: 1px solid #f0f2f5;
  border-radius: 5px;
  overflow: hidden;
  // padding-left: 92px;
  margin-left: 20px;
  .el-tree {
    margin-top: 20px;
  }
}

.role_title {
  font-size: 14px;
  line-height: 50px;
  background-color: #f0f2f5;
  color: #333333;
  padding: 0 20px;
}

.biz-param_box {
  display: flex;
  justify-content: space-around;

  // padding: 20px;
}

.biz-param_tree {
  border: 1px solid #f0f2f5;
  padding: 20px;
  width: 40%;
  margin: 10px 0;
}

.right_bottom {
  text-align: end;
  padding: 20px;
  border-top: 1px solid #f0f2f5;
}
.biz-param_items {
  width: 100%;
  li {
    height: 50px;
    line-height: 50px;

    border-bottom: 1px solid #ddd;
    // margin: 0px 5px;
    color: #666666;
    cursor: pointer;
    .fr {
      color: #ffffff;
    }
  }
}

.biz-param_items li:last-child {
  border-bottom: none;
}

.no_edit {
  margin: 0 20px;
}
.edit_name {
  .el-input {
    width: 200px;
  }
  color: #666666;
}
.text_block {
  width: 300px;
  display: inline-block;
}
</style>
