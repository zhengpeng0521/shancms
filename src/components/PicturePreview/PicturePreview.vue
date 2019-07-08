<template>
  <div class="picturePreview">
    <el-dialog
      :visible.sync="dialogVisible"
      :show-close="false"
      :close-on-click-modal="false"
      :width="width"
      :modal-append-to-body="false	"
      @close="close"
    >
      <div class="wrap_inner">
        <div class="main">
          <div
            id="upload-file-image-preview"
            class="upload-file-image-preview"
          />
          <div class="tools">
            <div class="file-button upload-success">
              <div class="image-thumb-btns">
                <img
                  src="https://img.ishanshan.com/gimg/n/20190312/27dadf99624d68388e6bfb62b1e58531"
                  @click="coursewareChangePage('last',pictureIndex)"
                >
                <img
                  src="https://img.ishanshan.com/gimg/n/20190312/5c39878b5b50c97cd53a72599a2fba7e"
                  @click="coursewareChangePage('next',pictureIndex)"
                >
              </div>
              <div class="image-thumb-btns">
                <img
                  src="https://img.ishanshan.com/gimg/n/20190312/c6d2d95a64301fba54365a046be72771"
                  @click="zoomIn(0.2)"
                >
                <img
                  src="https://img.ishanshan.com/gimg/n/20190312/2f8cfcf2726bace9000282e66c81d2aa"
                  @click="zoomOut(0.2)"
                >
                <img
                  src="https://img.ishanshan.com/gimg/n/20190312/7a1c1dd64bdd6544391edb5632970f33"
                  @click="onRotationLeftBtnClick"
                >
                <img
                  src="https://img.ishanshan.com/gimg/n/20190312/9cdcffb24c8a1b7e9a62fb4c605f7593"
                  @click="onRotationBtnClick"
                >
                <img
                  src="https://img.ishanshan.com/gimg/n/20190312/13c913d23c904dc6eb4f5a5177c73106"
                  @click="onPanBtnClick"
                >
              </div>
              <div class="image-tools-btns">
                <img
                  src="https://img.ishanshan.com/gimg/n/20190312/36543d215a7e96c0f9699d6044da9d80"
                  @click="close"
                >
              </div>
              <div class="ctn-btns" />
            </div>
            <!-- 绘画板控件 -->
            <!--  <div class="draw_board">
              <img
                src="https://img.ishanshan.com/gimg/n/20190312/05790d97b2d09af85674ecde80938f1d"
                @click="onArrowBtnClick"
              >
              <img
                src="https://img.ishanshan.com/gimg/n/20190312/177ae683c29c9f441f78ce15143d9aec"
                @click="onFreeDrawBtnClick"
              >
              <img
                src="https://img.ishanshan.com/gimg/n/20190312/16be3d21a926a579b6c40de4837456ac"
                @click="onTextBtnClick"
              >
              <img
                src="https://img.ishanshan.com/gimg/n/20190312/258fab5de70e27f24a4ce78973eb119c"
                @click="onClearBtnClick"
              >
            </div> -->
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import $ from 'jquery'
import FabricPhoto from './croe/index'
import consts from './croe/consts'

export default {
  data() {
    return {
      dialogVisible: false,
      pictureIndex: 1,
      width: document.body.clientWidth + '' + 'px',
      pictureList: [],
      state: {
        editState: consts.states.NORMAL,
        arrow: {
          color: '#FF3440',
          stroke: 4
        },
        freeDraw: {
          color: '#FF3440',
          stroke: 4
        },
        text: {
          color: '#FF3440'
        },
        mosaic: {
          stroke: '#FF3440'
        }
      }
    }
  },
  computed: {
    imgTotal() {
      return this.pictureList.length || 0
    }
  },
  mounted: function() {
  },
  destroyed: function() {
    if (this.fp) {
      this.fp.destroy()
      this.fp = null
      $('#upload-file-image-preview-paper').empty()
    }
  },
  methods: {
    show(pictureList, pictureIndex) {
      this.pictureList = pictureList
      if (pictureList) {
        if (pictureIndex) {
          this.pictureIndex = pictureIndex
        } else {
          this.pictureIndex = 1
        }
        this.openPreview()
      }
    },
    openPreview() {
      if (this.pictureList.length <= 0 || this.pictureIndex < 1 || this.pictureIndex > this.pictureList.length) {
        return
      }
      this.dialogVisible = true
      const url = this.pictureList[this.pictureIndex - 1]
      this.$nextTick(function() {
        const wh = this.getDialogViewPort()
        this.fp = new FabricPhoto('#upload-file-image-preview', {
          cssMaxWidth: wh.width,
          cssMaxHeight: wh.height
        })
        this.fp.once('loadImage', (oImage) => {
          this.fp.clearUndoStack()
        })
        this.fp.loadImageFromURL(url, 'image name')
        this.fp.on('selectObject', (obj) => {
          if (obj.type === 'rect' || obj.type === 'circle' || obj.type === 'triangle') {
            this.state.editState = consts.states.SHAPE
            this.activateShapeMode()
          } else if (obj.type === 'text') {
            this.state.editState = consts.states.TEXT
            this.activateTextMode()
          }
        })
        this.fp.on('activateText', (obj) => {
          if (obj.type === 'new') {
            this.fp.addText('双击编辑', {
              styles: {
                fill: this.state.text.color,
                fontSize: 50
              },
              position: obj.originPosition
            })
          }
        })
        this.fp.on({
          emptyUndoStack: () => {
          },
          emptyRedoStack: () => {
          },
          pushUndoStack: () => {
          },
          pushRedoStack: () => {
          },
          endCropping: () => {
          },
          endFreeDrawing: () => {
          },
          adjustObject: (obj, type) => {
          }
        })
      })
    },
    close() {
      this.dialogVisible = false
      if (this.fp) {
        this.fp.destroy()
        this.fp = null
        $('#upload-file-image-preview-paper').empty()
      }
    },
    activateShapeMode() {
      if (this.fp.getCurrentState() !== consts.states.SHAPE) {
        this.fp.endFreeDrawing()
        this.fp.endTextMode()
        this.fp.endLineDrawing()
        this.fp.endMosaicDrawing()
        this.fp.endCropping()
        this.fp.endArrowDrawing()
        this.fp.endPan()
        this.fp.startDrawingShapeMode()
      }
    },

    activateTextMode() {
      if (this.fp.getCurrentState() !== consts.states.TEXT) {
        this.fp.endFreeDrawing()
        this.fp.endLineDrawing()
        this.fp.endArrowDrawing()
        this.fp.endMosaicDrawing()
        this.fp.endCropping()
        this.fp.endDrawingShapeMode()
        this.fp.endTextMode()
        this.fp.endPan()
        this.fp.startTextMode()
      }
    },

    getWindowViewPort() {
      return {
        height: $(window).height(),
        width: $(window).width()
      }
    },

    getDialogViewPort() {
      const {
        height,
        width
      } = this.getWindowViewPort()
      return {
        width: width < 680 ? 680 : width < 900 ? 900 : width,
        height: height < 450 ? 450 : height < 600 ? 600 : height
      }
    },

    resetEditorState() {
      this.state.editState = consts.states.TEXT
    },

    onArrowBtnClick() {
      this.fp.endAll()
      if (this.state.editState === consts.states.ARROW) {
        this.resetEditorState()
      } else {
        this.state.editState = consts.states.ARROW
        this.fp.startArrowDrawing({
          width: this.state.arrow.stroke,
          color: this.state.arrow.color
        })
      }
    },

    onFreeDrawBtnClick() {
      this.fp.endAll()
      if (this.state.editState === consts.states.FREE_DRAWING) {
        this.resetEditorState()
      } else {
        this.state.editState = consts.states.FREE_DRAWING
        this.fp.startFreeDrawing({
          width: this.state.freeDraw.stroke,
          color: this.state.freeDraw.color
        })
      }
    },

    onMosaicBtnClick() {
      this.fp.endAll()
      if (this.state.editState === consts.states.MOSAIC) {
        this.resetEditorState()
      } else {
        this.state.editState = consts.states.MOSAIC
        this.fp.startMosaicDrawing({
          dimensions: this.state.mosaic.stroke
        })
      }
    },

    onTextBtnClick() {
      if (this.fp.getCurrentState() === consts.states.TEXT) {
        this.fp.endAll()
        this.resetEditorState()
      } else {
        this.state.editState = consts.states.TEXT
        this.fp.endAll()
        this.fp.startTextMode()
      }
    },
    /* 顺时针旋转 */
    onRotationBtnClick() {
      this.fp.endAll()
      this.fp.rotate(90)
      this.resetEditorState()
    },
    /* 逆时针旋转 */
    onRotationLeftBtnClick() {
      this.fp.endAll()
      this.fp.rotate(-90)
      this.resetEditorState()
    },

    onCropBtnClick() {
      this.fp.startCropping()
    },

    onClearBtnClick() {
      this.resetEditorState()
      this.fp.clearObjects()
    },
    onApplyCropBtn() {
      this.fp.endCropping(true)
    },

    onCancleCropBtn() {
      this.fp.endCropping()
    },

    onUndoBtn() {
      this.fp.undo()
    },
    onRedoBtn() {
      this.fp.redo()
    },

    onPanBtnClick() {
      this.fp.endAll()
      this.fp.startPan()
    },

    /* 放大 */
    zoomOut(delta) {
      const nextZoom = this.fp.getZoom() + delta
      if (nextZoom > 4) {
        return
      }
      this.fp.setZoom(nextZoom)
    },
    /* 缩小 */
    zoomIn(delta) {
      const nextZoom = this.fp.getZoom() - delta
      if (nextZoom < 0) {
        return
      }
      this.fp.setZoom(nextZoom)
    },

    changeEditorColor() {
      return () => {}
    },
    /* 图片上一张下一张切换 */
    coursewareChangePage(type, index) {
      if (type === 'input') {
        var reg = /^[1-9]\d*$/
        if (this.pictureIndex) {
          if (reg.test(this.pictureIndex)) {
            if ((this.pictureIndex + '').indexOf('.') > -1) {
              this.$message.warning('页码不可以为小数')
              this.pictureIndex = 1
            } else if (this.pictureIndex < 1) {
              this.pictureIndex = 1
              this.$message.warning('页码不可以为负数')
            } else if (this.pictureIndex > this.imgTotal) {
              this.pictureIndex = 1
              this.$message.warning('页码不可以超出总张数')
            }
          } else {
            this.pictureIndex = 1
          }
        } else {
          this.pictureIndex = 1
        }
      } else if (type === 'last') {
        if (this.pictureIndex === 1) {
          this.$message.warning('已经是第一页')
          return
        } else {
          this.pictureIndex = this.pictureIndex - 1
        }
      } else if (type === 'next') {
        if (this.pictureIndex === this.imgTotal) {
          this.$message.warning('已经是最后一页')
          return
        } else {
          this.pictureIndex = this.pictureIndex + 1
        }
      }
      this.loadImage()
    },
    loadImage() {
      if (this.pictureList.length <= 0 || this.pictureIndex < 1 || this.pictureIndex > this.pictureList.length) {
        return
      }
      const url = this.pictureList[this.pictureIndex - 1]
      this.fp.loadImageFromURL(url, 'image name')
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./scss/index.scss"; //导入外部scss文件

.picturePreview /deep/ {
  .v-modal {
    opacity: 0.6;
  }
  .el-dialog {
    margin-top: 40px !important;
    height: calc(100vh - 0px);
    margin: 0 auto;
    background: transparent;
    box-shadow: none;
  }
  .test_two_box {
    text-align: center;
  }
  .el-input--mini .el-input__inner {
    text-align: center;
    background: transparent;
    color: #fff;
  }
  .tools {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 40px;
  }
  .draw_board {
    left: calc(((100% - 364px) / 2) + 374px) !important;
    width: 172px !important;
    height: 40px;
    padding: 11px 20px;
    bottom: 40px;
    color: #ccc;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    justify-content: space-between;
    -webkit-box-align: center;
    align-items: center;
    display: flex;
    img {
      cursor: pointer;
    }
    i {
      font-size: 20px;
      vertical-align: middle;
      cursor: pointer;
      margin-left: 12px;
      line-height: 30px;
      &:hover {
        color: $primary;
      }
    }
    i:first-child {
      margin-left: 0;
    }
  }
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 0 !important;
    max-height: 100%;
    height: calc(100vh - 0px);
  }
  .el-dialog__footer {
    text-align: center;
  }
  .main {
    .xm-fabric-photo-editor-canvas-container {
      margin: 0 auto !important;
    }
  }
}
</style>
