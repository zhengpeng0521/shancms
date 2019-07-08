<template>
  <transition name="slide-fade">
    <div
      v-show="isVisible"
      ref="sideModal"
      class="side-zhezhao"
    >
      <div
        v-show="isVisible"
        class="side-dialog"
      >
        <div
          v-if="topShow"
          class="top"
        >
          <div class="top-left">
            <span class="lan" />
            <span>{{ this.$parent.obj.dataTitle }}</span>
          </div>
          <div class="top-right">
            <Confirm
              :text="'关闭'"
              :placement="'top'"
              :content="'确认关闭么?'"
              :confirm="close"
              :is-button="true"
              :btn-type="'plain'"
            />
            <Confirm
              :text="'保存'"
              :placement="'top'"
              :content="'确认保存么?'"
              :confirm="save"
              :is-button="true"
              :disabled="$parent.obj.isHq===1"
              :btn-type="'primary'"
            />
          </div>
        </div>
        <div :class="topShow===true? 'contBox':'contBox1'">
          <iframe
            id="ifr"
            :src="url"
            class="cont"
          />
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import Confirm from '@/components/MiniCommon/Confirm'
import { mapState, mapActions } from 'vuex'
export default {
  components: { Confirm },
  props: {
    'visible': {
      type: Boolean,
      default: true
    },
    isEdit: {
      type: Boolean,
      required: true
    },
    editUrl: {
      type: String,
      required: true
    },
    resetEdit: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      visible2: false,
      visible3: false,
      isVisible: this.visible,
      url: '',
      topShow: true
    }
  },
  computed: {
    ...mapState('changeThirdMain', [
      'tabsName'
    ])
  },
  watch: {
    'visible'(val) {
      this.isVisible = val
    },
    'isVisible'(val) {
      this.$emit('update:visible', val)
    }
  },
  mounted() {
    const side = this.$refs.sideModal
    document.body.appendChild(side)
    this.url = this.isEdit ? this.editUrl : `${this.$parent.obj.provider}/page?m=create&tenantId=${this.$parent.obj.tenantId}&orgId=${this.$parent.obj.orgId}&gameCode=${this.$parent.obj.gameCode}&gameId=${this.$parent.obj.gameId}&dataId=${this.$parent.obj.dataId}&uid=${this.$store.getters.id}&runAs=runAs&isHq=0`
    if (this.$parent.obj.isGameEdit === 'false' || this.$parent.obj.isGameEdit === null || this.$parent.obj.isGameEdit === '') {
      this.topShow = true
    } else {
      this.topShow = false
    }
    const self = this
    window.addEventListener('message', function(e) {
      if (e.data === 'close') {
        self.close()
      } else if (e.data === 'closeAndLink' || (e.data && e.data.messageType === 'preview')) {
        self.reloadList()
        if (typeof e.data === 'object' && e.data.messageType === 'preview') {
          self.openPreviewDialog(e.data)
          self.close()
        } else {
          self.close()
          setTimeout(() => {
            self.setBlankCard()
          }, 10)
        }
      }
    }, false)
  },
  methods: {
    reloadList() {
      this.$emit('reloadList')
    },
    openPreviewDialog(data) {
      this.$emit('openPreviewDialog', data)
    },
    close() {
      this.isVisible = false
      this.visible2 = false
      this.resetEdit({ isEdit: false, editUrl: '' })
    },
    save() {
      const ifr = document.getElementById('ifr')
      ifr.contentWindow.postMessage({
        type: 'game'
      }, '*')
    },
    ...mapActions('changeThirdMain', [
      'changeTabs'
    ]),
    setBlankCard() {
      this.changeTabs('myGame')
    }

  }
}
</script>
<style lang="scss" scoped>
.side-zhezhao {
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0px;
  right: 0px;
  z-index: 2000;
}

.side-dialog {
  top: 0px;
  right: 0px;
  z-index: 1000;
  width: calc(100% - 150px);
  position: fixed;
  margin-left: -20px;
  height: 100%;
  background-color: rgba(255, 255, 255, 1);
  -moz-box-shadow: 2px 2px 5px #333333;
  -webkit-box-shadow: 2px 2px 5px #333333;
  box-shadow: 2px 2px 5px #333333;
  .top {
    width: calc(100vw - 180px) !important;
    min-height: 40px;
    justify-content: space-between;
    border-bottom: 4px solid #5d9cec;
    display: flex;
    justify-content: space-between;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-left: 20px;
    .lan {
      background-color: #5d9cec;
      width: 8px;
      height: 14px;
      border-radius: 3px;
      display: inline-block;
      margin-right: 5px;
    }
    .top-left {
      display: flex;
      font-size: 16px;
      margin-top: 10px;
    }
    .top-right {
      display: flex;
      .el-button {
        margin-left: 10px;
        margin-bottom: 10px;
      }
    }
  }
  .contBox {
    width: calc(100vw - 150px);
    height: calc(100vh - 60px);
    .cont {
      width: 99%;
      height: 100%;
      border: 0;
    }
  }
  .contBox1 {
    width: calc(100vw - 150px);
    height: calc(100vh);
    .cont {
      width: 99%;
      height: 100%;
      border: 0;
    }
  }
}

.slide-fade-enter-active {
  transition: all 0.5s ease;
}
.slide-fade-leave-active {
  transition: all 0.5s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(1000px);
  opacity: 0;
}
</style>
<style lang="scss" >
.tanchukuang {
  z-index: 20000 !important;
  p {
    font-size: 12px;
    color: #666;
  }
}
</style>

