<template>
  <div
    v-loading="loading"
    class="game-box"
    element-loading-text="拼命加载中"
  >
    <pull-to
      :is-top-bounce="false"
      @infinite-scroll="loadMore"
    >
      <div class="microGame-container">
        <div class="microGame-top">
          <!-- <div class="bottom-border" /> -->
          <div class="cont">
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

          </div>
        </div>
        <div class="microGame-cont">
          <Game :data="list" />
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
import Game from '../components/game'
import { queryGameInfosWithTenant } from '@/api/marketing/microGame.js'
import { queryAllLabel } from '@/api/marketing/microAct.js'
import PullTo from 'vue-pull-to'
export default {
  components: {
    Game,
    'pull-to': PullTo
  },
  data() {
    return {
      flag: true,
      navList: [],
      labelIds: '',
      list: [],
      // 弹出框参数
      outerVisible: false,
      innerVisible: false,
      // loadmore组件参数
      pageSize: 50,
      pageIndex: 0,
      pageCount: 0,
      textInfo: false,
      paramsArr: [],
      group: [],
      loading: false
    }
  },
  mounted() {
    this.queryAllLabel()
    this.queryGameInfosWithTenant()
  },
  methods: {
    queryGameInfosWithTenant() {
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中',
        fullscreen: false,
        target: document.querySelector('.microGame-container')
      })

      const params = {
        'pageIndex': this.pageIndex,
        'pageSize': this.pageSize
      }
      queryGameInfosWithTenant(params).then(res => {
        if (res.data.errorCode === 0) {
          this.list = res.data.results
          this.pageCount = res.data.data.pageCount
        } else {
          this.$message.error(res.errorMessage)
        }
        loading.close()
      })
    },
    queryAllLabel() {
      const params = {
        product: '2'
      }
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中',
        fullscreen: false,
        target: document.querySelector('.microGame-container')
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
    // 导航栏控制函数
    showCont(item, index) {
      this.navList[index].value.forEach(v => {
        if (v.edit) { v.edit = false; item.switch = !item.switch }
      })
      if (this.group.indexOf(item.group) > -1) {
        this.paramsArr.splice(this.group.indexOf(item.group), 1)
        this.group.splice(this.group.indexOf(item.group), 1)
      }
      const labelIds = this.paramsArr.join(',')
      this.labelIds = labelIds
      const params = {
        'labelIds': this.labelIds,
        pageIndex: 0,
        pageSize: this.pageSize
      }
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中',
        fullscreen: false,
        target: document.querySelector('.microGame-container')
      })
      queryGameInfosWithTenant(params).then(res => {
        if (res.data.errorCode === 0) {
          this.list = res.data.results
          this.pageCount = res.data.data.pageCount
          this.pageIndex = 0
        } else {
          this.$message.error(res.errorMessage)
        }
        loading.close()
      })
    },

    showContList(item, itm, index) {
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
      this.labelIds = labelIds
      const params = {
        'labelIds': this.labelIds,
        pageIndex: 0,
        pageSize: this.pageSize
      }
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中',
        fullscreen: false,
        target: document.querySelector('.microGame-container')
      })
      queryGameInfosWithTenant(params).then(res => {
        if (res.data.errorCode === 0) {
          this.list = res.data.results
          this.pageCount = res.data.data.pageCount
          this.pageIndex = 0
        } else {
          this.$message.error(res.errorMessage)
        }
        loading.close()
      })
    },
    loadMore() {
      this.textInfo = false
      this.pageIndex++
      const params = {
        'labelIds': this.labelIds,
        'pageIndex': this.pageIndex,
        'pageSize': this.pageSize
      }
      if (this.pageIndex < this.pageCount) {
        this.loading = true
        queryGameInfosWithTenant(params).then(res => {
          if (res.data.errorCode === 0) {
            const arr = [...this.list]
            res.data.results.map((val) => {
              arr.push(val)
            })
            this.list = arr
          } else {
            this.$message.error(res.errorMessage)
          }
          this.loading = false
        })
      } else if (this.pageIndex >= this.pageCount && this.list.length > 0) {
        this.textInfo = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.game-box {
  height: calc(100vh - 150px);
}

.microGame-container {
  width: 100%;
  min-width: 1060px;
  height: calc(100vh - 150px);

  .microGame-top .cont {
    width: 100%;
    position: relative;
    padding-bottom: 13px;
    .jieri {
      display: flex;
      padding-top: 10px;
      button {
        background: #fff;
        cursor: pointer;
        color: rgba(51, 51, 51, 1);
        font-weight: 400;
        font-size: 14px;
        border: 1px solid #fff;
        border-radius: 5px;
        padding: 2px 10px;
        margin: 5px 3px;
        outline: none;
        border-color: transparent;
        box-shadow: none;
      }
      button:hover {
        color: #46b6ee;
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
          border: 0;
        }
        .listCont {
          margin: 0px 14px 5px 0px;
        }
      }
    }
  }
  .leads-bottom-text {
    text-align: center;
    color: #999;
    width: 100%;
    height: 30px;
    background: rgba(240, 242, 245, 0.8);
  }
}
</style>

