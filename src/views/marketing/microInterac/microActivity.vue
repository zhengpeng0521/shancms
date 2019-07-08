<template>
  <div class="microActivity-box">
    <pull-to @infinite-scroll="loadMore">
      <div class="microActivity-main">
        <div class="top">
          <div class="serach">
            <CommonSearch
              :is-inline="true"
              :params="formInline"
              :forms="formInline"
              @toParent="resetFieldHanle"
            />
          </div>
          <div class="footer">
            <div
              v-for="(item,index) of navList"
              v-show="flag===true?index<3:index<navList.length"
              :key="index"
              class="jieri"
            >
              <strong class="tit">{{ item.group }}:</strong>
              <div>
                <button
                  ref="listCont"
                  :class="{clickClass:!item.switch}"
                  class="listCont"
                  @click="showCont(item,index)"
                >全部</button>

                <button
                  v-for="(itm,i) of item.value"
                  :key="i"
                  :class="{clickClass:itm.edit}"
                  class="listCont"
                  @click="showContList(item,itm,index)"
                >{{ itm.labelName }}</button>

              </div>
            </div>
            <div
              v-show="moreFlag==true && navList.length > 3"
              class="downBtn"
              @click="more"
            ><i class="iconfont icon_nr_xx1" />更多</div>
            <div
              v-show="upFlag===true && navList.length > 3"
              class="upBtn"
              @click="up"
            ><i class="iconfont icon_nr_xs" /> 收起</div>
          </div>
        </div>
        <div class="cont">
          <Pic :data="list" />
          <div
            v-if="textInfo"
            class="leads-bottom-text"
          >没有更多了</div>
        </div>

      </div>

    </pull-to>
  </div>
</template>
<script>
import Pic from '../components/pic'
import PullTo from 'vue-pull-to'
import CommonSearch from '@/components/CommonSearch/CommonSearch'
import { queryAllLabel, getActivityList } from '@/api/marketing/microAct.js'
export default {
  components: {
    Pic,
    CommonSearch,
    'pull-to': PullTo
  },
  data() {
    return {
      // 搜索参数
      formInline: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '活动名称',
            modelValue: 'defMsg',
            isClearable: true,
            itemStyle: 'width: 140px'
          }
        ]
      },
      jieri: '',
      navList: [],
      listCont: '',
      flag: true,
      moreFlag: true,
      upFlag: false,
      list: [],
      // loadmore组件参数
      pageSize: 50,
      pageIndex: 0,
      pageArr: [],
      pageCount: 0,
      textInfo: false,
      paramsArr: [],
      group: []
    }
  },
  mounted() {
    this.queryAllLabel()
    this.getActivityList()
  },

  methods: {

    queryAllLabel() {
      const params = {
        product: '1'
      }
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中',
        fullscreen: false,
        target: document.querySelector('.microActivity-main')
      })
      queryAllLabel(params).then(res => {
        if (res.data.errorCode === 0) {
          this.navList = res.data.results
        } else {
          this.$message.error(res.errorMessage)
        }
        loading.close()
      })
    },
    getActivityList() {
      const params = {
        'labelIds': '',
        'defMsg': '',
        'pageIndex': 0,
        'pageSize': this.pageSize
      }
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中',
        fullscreen: false,
        target: document.querySelector('.microActivity-main')
      })
      getActivityList(params).then(res => {
        if (res.data.errorCode === 0) {
          this.list = res.data.results
          this.pageCount = res.data.data.pageCount
        } else {
          this.$message.error(res.errorMessage)
        }
        loading.close()
      })
    },
    showCont(item, index) {
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中',
        fullscreen: false,
        target: document.querySelector('.microActivity-main')
      })
      this.navList[index].value.forEach(v => {
        if (v.edit) { v.edit = false; item.switch = !item.switch }
      })
      if (this.group.indexOf(item.group) > -1) {
        this.paramsArr.splice(this.group.indexOf(item.group), 1)
        this.group.splice(this.group.indexOf(item.group), 1)
      }
      const labelIds = this.paramsArr.join(',')
      const params = {
        'labelIds': labelIds,
        'defMsg': '',
        pageIndex: 0,
        pageSize: this.pageSize
      }

      getActivityList(params).then(res => {
        if (res.data.errorCode === 0) {
          this.list = res.data.results
        } else {
          this.$message.error(res.errorMessage)
        }
        loading.close()
      })
    },

    showContList(item, itm, index) {
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中',
        fullscreen: false,
        target: document.querySelector('.microActivity-main')
      })
      item.switch = true // 当前块添加开关edit: 给当前块添加属性edit
      // 如果存在开关开着就关闭
      item.value.forEach(v => {
        if (v.edit) { delete v['edit'] }
      })

      const tmpe = Object.assign({}, itm)

      const ii = item.value.indexOf(itm)
      tmpe.edit = true
      this.navList[index].value.splice(ii, 1, tmpe)
      if (this.group.indexOf(item.group) === -1) {
        this.group.push(item.group)
        this.paramsArr.push(itm.id)
      } else {
        this.paramsArr.splice(this.group.indexOf(item.group), 1, itm.id)
      }
      const labelIds = this.paramsArr.join(',')
      const params = {
        'labelIds': labelIds,
        'defMsg': '',
        pageIndex: 0,
        pageSize: this.pageSize
      }

      getActivityList(params).then(res => {
        if (res.data.errorCode === 0) {
          this.list = res.data.results
        } else {
          this.$message.error(res.errorMessage)
        }
        loading.close()
      })
    },
    more() {
      this.moreFlag = false
      this.upFlag = true
      this.flag = false
    },
    up() {
      this.moreFlag = true
      this.upFlag = false
      this.flag = true
    },
    picDetail() {
      this.object.picDetailShowflag = false
    },
    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      this.formValue = formValue
      const labelIds = this.paramsArr.join(',')
      const params = {
        'labelIds': labelIds,
        ...this.formValue,
        pageIndex: 0,
        pageSize: this.pageSize
      }
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中',
        fullscreen: false,
        target: document.querySelector('.microActivity-main')
      })
      getActivityList(params).then(res => {
        this.list = res.data.results
        if (res.data.errorCode === 0) {
          this.list = res.data.results
        } else {
          this.$message.error(res.errorMessage)
        }
        loading.close()
      })
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      this.pageIndex = 0
      this.queryAllLabel()
      this.getActivityList()
    },
    loadMore() {
      this.pageArr = this.list
      this.pageIndex++
      const params = {
        'labelIds': this.paramsArr.join(','),
        'defMsg': '',
        'pageIndex': this.pageIndex,
        'pageSize': this.pageSize
      }
      if (this.pageIndex < this.pageCount) {
        const loading = this.$loading({
          lock: true,
          text: '拼命加载中',
          fullscreen: false,
          target: document.querySelector('.microActivity-main')
        })
        getActivityList(params).then(res => {
          if (res.data.errorCode === 0) {
            const arr = [...this.list]
            res.data.results.map((val, index) => {
              arr.push(val)
            })
            this.list = arr
          } else {
            this.$message.error(res.errorMessage)
          }
          loading.close()
        })
      } else if (this.pageIndex >= this.pageCount && this.list !== []) {
        this.textInfo = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.microActivity-box {
  height: calc(100vh - 150px);
}

.microActivity-main {
  width: 100%;
  min-width: 1060px;
  height: calc(100vh - 150px);
  .top {
    width: 100%;
    background: rgba(255, 255, 255, 1);
    overflow: hidden;
    .serach {
      display: flex;
      .serch-input {
        width: 220px;
        padding-left: 10px;
        padding-right: 10px;
      }
    }
    .footer {
      width: 100%;
      position: relative;
      .downBtn,
      .upBtn {
        display: flex;
        align-items: center;
        color: rgba(102, 102, 102, 1);
        width: 120px;
        margin: 7px 0 14px 50%;
        img:hover {
          color: #46b6ee;
        }
        &:hover {
          color: #46b6ee;
          cursor: pointer;
        }
      }
      .jieri {
        padding-top: 10px;
        display: flex;
        &:first-child {
          padding: 0;
        }
        button {
          background: #fff;
          cursor: pointer;
          color: rgba(51, 51, 51, 1);
          font-weight: 400;
          font-size: 14px;
          border: 1px solid #fff;
          border-radius: 5px;
          padding: 2px 10px;
          margin: 0px 3px 5px 3px;
          outline: none;
          border-color: transparent;
          box-shadow: none;
        }
        button:hover {
          color: rgba(70, 182, 238, 1);
        }
        .tit {
          height: 20px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          line-height: 20px;
          min-width: 42px;
          margin: 0px 5px 10px 20px;
        }
        div {
          flex-wrap: wrap;
          align-items: center;
          .clickClass {
            background: #2ea8e6;
            color: #fff;
          }
        }
      }
    }
  }
  .cont {
    padding-top: 15px;
    background: rgba(240, 242, 245, 0.8);
  }
  .leads-bottom-text {
    text-align: center;
    color: #999;
    width: 100%;
    height: 20px;
  }
}
</style>

