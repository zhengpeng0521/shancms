<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :append-to-body="true"
    custom-class="erweimaBox"
    center
  >
    <!-- <ELTreeSelect
      ref="treeSelect"
      :styles="styles"
      v-model="schoolVal"
      :select-params="selectParams"
      :tree-params="treeParams"
      @searchFun="_searchFun"
    /> -->
    <div style="margin-top:20px">
      <qrcode
        v-if="message!==''"
        ref="qr"
        :options="{ width: 300,height:300,padding:0,margin:0 }"
        :value="message"
        class="erweima"
      />
    </div>
    <p>请使用微信扫一扫</p>
    <div class="erweima-footer">
      <div class="ipt">
        <el-input ref="url" v-model="message" :readonly="true"/>
      </div>
      <el-button
        v-clipboard:copy="message"
        v-clipboard:success="onCopy"
        v-clipboard:error="onError"
        type="primary"
      >复制地址</el-button>
    </div>
  </el-dialog>
</template>
<script>
// 二维码装换插件
import Vue from 'vue'
import VueQrcode from '@chenfengyuan/vue-qrcode'
Vue.component(VueQrcode.name, VueQrcode)
// 复制插件
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
// 树形选择下拉插件
import ELTreeSelect from 'el-tree-select'
import { queryCourseUrl } from '@/api/microWeb/lessonShow.js'
export default {
  components: { ELTreeSelect },
  props: {
    // dialogVisible: {
    //   type: Boolean,
    //   required: true
    // },
    // erweimaObj: {
    //   type: Object,
    //   required: undefined
    // }

  },
  data() {
    return {
      // 二维码弹框数据
      dialogVisible: false,
      message: '',
      styles: {
        width: '300px'
      },
      test: '',
      schoolVal: '333',
      selectParams: {

        placeholder: '请输入内容'
      },
      treeParams: {
        'default-expand-all': true,
        filterable: true,
        'check-strictly': true,
        'render-content': this._renderFun,
        data: [],
        props: {
          children: 'children',
          label: 'name',
          value: 'testId'
        }
      }
    }
  },
  watch: {
    // dialogVisible() {
    //   const data = [
    //     {
    //       testId: '1',
    //       name: '所有校区',
    //       children: [
    //         {
    //           testId: '22',
    //           name: '杭州市',
    //           children: [{
    //             testId: '333',
    //             name: '王氏教育'
    //           }]
    //         }
    //       ]
    //     }

    //   ]
    //   this.treeParams.data = data

    //   this.$nextTick(function() {
    //     // console.log(this.$refs.treeSelect, '111111')
    //     this.$refs.treeSelect.treeDataUpdateFun(data)
    //   })
    // }
  },
  methods: {
    //  二维码弹框方法
    showDialog(row) {
      const params = {
        tenantId: row.tenantId,
        orgId: row.orgIds,
        courseId: row.id
      }
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中。。。',
        spinner: 'el-icon-loading',
        fullscreen: false,
        // background: 'rgba(0, 0, 0, 0.7)',
        target: document.querySelector('.activityShow-container')
      })
      queryCourseUrl(params).then((res) => {
        if (res.data.errorCode === 0) {
          loading.close()
          let qrurl = res.data.results.url
          if (!qrurl) {
            qrurl = ''
          } else if (qrurl.startsWith('//')) {
            qrurl = window.location.protocol + qrurl
          } else if (!qrurl.startsWith('http')) {
            qrurl = 'http://' + qrurl
          }
          this.message = qrurl
          this.dialogVisible = true
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    },
    onCopy: function(e) {
      this.$message({
        message: '复制成功',
        type: 'success'
      })
      // console.log(this.$refs.url)
      this.$refs.url.style.background = 'rgba(51,141,233,1)'
      this.$refs.url.style.color = '#fff'
    },
    onError: function(e) {
      this.$message.error('复制失败')
    },
    // 树形插件方法
    // 下拉框修改
    _selectChange(val) {
      console.log(val, '<-select change')
    },
    // 树点击
    // _nodeClickFun(data, node, vm) {
    //   console.log('this _nodeClickFun', this.schoolVal, data, node)
    // },
    // 树过滤
    _searchFun(value) {
      console.log(value, '<--_searchFun')
      // 自行判断 是走后台查询，还是前端过滤
      // this.$refs.treeSelect.$refs.tree.filter(value);
      this.$refs.treeSelect.filterFun(value)
      // 后台查询
      // this.$refs.treeSelect.treeDataUpdateFun(treeData);
    },
    selectClear() {
      this.$emit('select-clear')
    }
    // 自定义render
    // _renderFun(h, { node, data, store }) {
    //   return (
    //     <span class="custom-tree-node">
    //       <span>{node.label}</span>
    //     </span>
    //   );
    // }
  }
}
</script>
<style lang="scss" >
.erweimaBox {
  width: 335px;
  // height: 470px;
  .el-dialog__header {
    border-bottom: 0;
  }
  .el-dialog__body {
    padding: 10px 0 0 17px !important;
    p {
      margin-top: 14px;
      margin-bottom: 20px;
      font-size: 15px;
      text-align: center;
    }
    .erweima-footer {
      display: flex;
      justify-content: space-around;
      margin-bottom: 20px;
      .ipt {
        width: 220px;
        border-radius: 4px;
        transition: all 0.3s;
        line-height: 28px;
        overflow: hidden;
        white-space: nowrap;
      }
      .el-input__inner {
        padding: 0 10px;
      }
      .el-button {
        margin-left: 2%;
      }
    }
  }
}
</style>

