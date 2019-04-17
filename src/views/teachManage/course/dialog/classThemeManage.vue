<template>
  <div class="themeManage">
    <el-dialog
      :visible.sync="themeVisible"
      :close-on-click-modal="false"
      title="管理上课主题"
      width="600px"
    >
      <div>
        <div
          v-if="themeList && themeList.length > 0"
          class="theme_content"
        >
          <div class="theme_head">
            <div class="head_item">主题名称</div>
            <div class="head_item">类型</div>
            <div class="head_item">操作</div>
          </div>
          <div class="theme_row">
            <div
              v-for="(item, index) of themeList"
              :key="index"
              class="row_item"
            >
              <div
                class="tr_item"
                style="text-align: left;width: 40%;"
              >
                <el-popover
                  placement="top"
                  trigger="hover"
                >
                  <div style="text-align:center">{{ item.title }}</div>
                  <div
                    slot="reference"
                    style="float: left;"
                    class="theme_title"
                  >{{ item.title }}</div>
                </el-popover>
              </div>
              <div
                v-if="item.type == '1'"
                class="tr_item"
              >正课</div>
              <div
                v-if="item.type == '2'"
                class="tr_item"
              >开学典礼</div>
              <div
                v-if="item.type == '3'"
                class="tr_item"
              >公开课</div>
              <div
                v-if="item.type == '4'"
                class="tr_item"
              >家长会</div>
              <div
                v-if="item.type == '5'"
                class="tr_item"
              >毕业典礼</div>
              <div class="tr_item">
                <a
                  v-if="currentInfo.orgKind == '2'"
                  style="margin-right:20px;color:#999"
                >编辑</a>
                <a
                  v-else
                  style="margin-right:20px"
                  @click="editTheme(item)"
                >编辑</a>
                <el-popover
                  v-model="item.deleteThemeVisible"
                  placement="top"
                  trigger="click"
                >
                  <div style="margin:4px 4px 16px">确定删除<span style="color:red">{{ item.title }} </span>?</div>
                  <div style="float:right;margin:0px 4px 4px 0">
                    <el-button
                      class="delete_btn"
                      @click="item.deleteThemeVisible = false"
                    >取消</el-button>
                    <el-button
                      type="primary"
                      class="edit_btn"
                      @click="deleteTheme(item)"
                    >确定</el-button>
                  </div>
                  <a
                    v-if="currentInfo.orgKind == '2'"
                    slot="reference"
                    style="color:#999"
                    @click="item.deleteThemeVisible = true"
                  >删除</a>
                  <a
                    v-else
                    slot="reference"
                  >删除</a>
                </el-popover>
              </div>
            </div>
          </div>
        </div>
        <NullData
          v-else
          style="height:445px"
        />
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="themeVisible = false"
        >关闭</el-button>
        <el-button
          :disabled="currentInfo.orgKind == '2'? true :false"
          type="primary"
          @click="addThemeFunc"
        >新增主题</el-button>
      </span>
    </el-dialog>
    <AddTheme
      ref="addTheme"
      @toAddTheme="getAddData"
      @toEditTheme="getEditData"
    />
  </div>
</template>
<script>
import AddTheme from './addNewTheme'
import { queryCourseTheme, updateStatusCourseTheme } from '@/api/teachManage/course'
import NullData from '@/components/MiniCommon/NullData'
// import { getCourseThemeList } from '@/api/course'
export default {
  components: {
    AddTheme,
    NullData
  },
  data() {
    return {
      themeVisible: false, // 弹窗显示
      currentInfo: {}, // 当前的信息
      themeList: []
    }
  },

  methods: {
    show(row) {
      console.info(row)
      this.themeVisible = true
      this.currentInfo = row
      this.getCourseTheme()
    },
    /* 主题列表查询 */
    getCourseTheme() {
      const params = {
        courseId: this.currentInfo.id
      }
      queryCourseTheme(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.themeList = data.results
        }
      })
    },
    /* 新增主题 */
    addThemeFunc() {
      this.$refs.addTheme.show(this.currentInfo.id, 'add')
    },
    editTheme(item) {
      this.$refs.addTheme.show(item, 'edit')
    },
    /* 新增主题 */
    getAddData() {
      this.getCourseTheme()
    },
    /* 编辑主题 */
    getEditData() {
      this.getCourseTheme()
    },
    /* 删除主题 */
    deleteTheme(item) {
      const params = {
        id: item.id,
        status: '0'
      }
      updateStatusCourseTheme(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          item.deleteThemeVisible = false
          this.getCourseTheme()
          this.$message.success(data.errorMessage)
        } else {
          this.$message.error(data.errorMessage || '删除主题失败')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.themeManage {
  .theme_content {
    height: 455px;
    margin-bottom: 14px;
    .theme_head {
      display: flex;
      flex-wrap: nowrap;
      -webkit-box-orient: horizontal;
      -webkit-box-direction: normal;
      flex-direction: row;
      border-bottom: 1px solid #ddd;
      .head_item {
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        text-align: center;
        width: 30%;
      }
    }
    .theme_head .head_item:first-child {
      text-align: left;
      width: 40%;
    }
    .theme_head .head_item:last-child {
      text-align: right;
      width: 30%;
    }
    .theme_row {
      height: calc(100% - 40px);
      overflow: auto;
      .row_item {
        display: flex;
        flex-wrap: nowrap;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
        flex-direction: row;
        height: 40px;
        line-height: 40px;
        text-align: center;
        .tr_item {
          padding: 0 20px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 30%;
          a {
            color: #46b6ee;
          }
        }
      }
    }
    .row_item .tr_item:last-child {
      text-align: right;
      width: 30%;
    }
    .theme_title {
      text-align: left;
      text-overflow: ellipsis;
      white-space: normal;
      -webkit-box-orient: vertical;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      word-break: break-all;
    }
  }
}
</style>
