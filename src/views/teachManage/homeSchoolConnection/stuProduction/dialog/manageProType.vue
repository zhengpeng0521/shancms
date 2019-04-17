<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :append-to-body="true"
    title="作品分类信息"
    width="600px"
  >
    <div class="manage_type">
      <el-row>
        <el-col
          :span="13"
          class="manage_type_head_item"
        >
          分类名称
        </el-col>
        <el-col
          :span="4"
          class="manage_type_head_item"
        >
          作品数
        </el-col>
        <el-col
          :span="7"
          class="manage_type_head_item"
        >
          操作
        </el-col>
      </el-row>
      <div>
        <el-row
          v-for="(item, index) of productionList"
          :key="index"
        >
          <el-col
            :span="13"
            class="manage_type_content_item"
          >
            <el-input
              v-if="item.editVisible"
              v-model="item.name"
            />
            <span v-if="!item.editVisible">{{ item.name }}</span>
          </el-col>
          <el-col
            :span="4"
            class="manage_type_content_item"
          >
            {{ item.works }}
          </el-col>
          <el-col
            :span="7"
            class="manage_type_content_item"
          >
            <a
              v-if="item.editVisible"
              @click="sureName(item, index)"
            >{{ '确认' }}</a>
            <a
              v-else
              @click="updateName(item, index)"
            >{{ '修改名称' }}</a>
            <a
              v-if="item.editVisible"
              style="margin-left:10px"
              @click="cancel(item, index)"
            >取消</a>
            <el-popover
              v-else
              v-model="item.delVisible"
              placement="top"
              width="160"
            >
              <p style="margin:8px 0 20px 0">确认要删除么？</p>
              <div style="text-align: right; margin: 0">
                <el-button
                  size="mini"
                  class="cancel_btn edit_btn"
                  @click="item.delVisible = false"
                >取消</el-button>
                <el-button
                  type="primary"
                  class="edit_btn"
                  @click="deleteFunc(item)"
                >确认</el-button>
              </div>
              <a
                slot="reference"
                style="margin-left:10px"
              >删除</a>
            </el-popover>

          </el-col>
        </el-row>
      </div>
    </div>
    <div
      slot="footer"
      class="addType"
    >
      <el-button
        type="primary"
        @click="addTypeFunc"
      >增加分类</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getWorkTagList, creatWorkTag, deleWorkTag } from '@/api/teachManage/homeSchoolConnect'
export default {
  data() {
    return {
      dialogVisible: false,
      delVisible: false, // 删除气泡显示
      productionList: []
    }
  },
  methods: {
    show() {
      this.getWorkTagList()
    },
    /* 作品标签列表 */
    getWorkTagList() {
      getWorkTagList().then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.productionList = data.results
          this.productionList && this.productionList.map(item => {
            item.editVisible = false
          })
          this.dialogVisible = true
        } else {
          this.$message.error(data.errorMessage || '获取作品标签列表')
        }
      })
    },
    /* 修改名称 */
    sureName(item, index) {
      const row = Object.assign({}, item)
      this.productionList.splice(index, 1, row)
      if (item.editVisible) {
        if (item.name) {
          const params = {
            id: item.id,
            name: item.name
          }
          creatWorkTag(params).then(res => {
            const data = res.data
            if (data.errorCode === 0) {
              row.editVisible = !row.editVisible
              row.isAdd = !row.isAdd
              this.$message.success(data.errorMessage)
              this.$emit('toUpdateTable')
              this.$emit('toUpdateTagList')
              this.getWorkTagList()
            } else {
              this.$message.error(data.errorMessage || '修改失败')
            }
          })
        } else {
          this.$message.error('请填写分类名称')
        }
      }
    },
    /* 修改名称 */
    updateName(item) {
      this.$forceUpdate()
      item.editVisible = true
    },
    /* 删除确认 */
    deleteFunc(val) {
      const params = {
        id: val.id
      }
      deleWorkTag(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          val.delVisible = false
          this.$message.success(data.errorMessage)
          this.$emit('toUpdateTable')
          this.$emit('toUpdateTagList')
          this.getWorkTagList()
        } else {
          this.$message.error(data.errorMessage || '删除失败')
        }
      })
    },
    /* 增加分类 */
    addTypeFunc() {
      this.productionList.unshift(
        {
          name: '',
          works: '0',
          editVisible: true,
          isAdd: true
        }
      )
    },
    /* 取消 */
    cancel(item, index) {
      if (item.name) {
        this.$forceUpdate()
        item.editVisible = false
      } else {
        this.productionList.splice(index, 1)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
a {
  color: #46b6ee;
}
.manage_type {
  overflow: auto;
  max-height: 400px;
  border-top: 1px solid #ddd;
  border-left: 1px solid #ddd;
  margin-bottom: 20px;
  .manage_type_head_item,
  .manage_type_content_item {
    padding: 0 10px;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #ddd;
    border-right: 1px solid #ddd;
    background: #f6f7f9;
    font-weight: 700;
  }
  .manage_type_content_item {
    background: #fff;
    font-weight: normal;
  }
}
.addType {
  text-align: right;
}
</style>
