<template>
  <div class="coursewareOverdue">
    <el-dialog
      :visible.sync="dialogVisible"
      :show-close="true"
      :close-on-click-modal="true"
    >
      <div class="test_two_box">
        <video
          id="my-video"
          ref="video"
          class="video-js"
          controls
          preload="auto"
          width="500"
          height="300"
          data-setup="{}"
          controlsList="nodownload"
        >
          <source type="video/mp4">
        </video>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import $ from 'jquery'
// import FabricPhoto from '../croe/index'
import consts from '../croe/consts'
// import myVideo from 'video.js'

import {
  getImgTotal,
  imgDetail
} from '@/api/teachManage/courseware'
export default {
  data() {
    return {
      dialogVisible: false,
      coursewareImgIndex: 1,
      imgTotal: 0,
      imgDetail: {},
      width: document.body.clientWidth + '' + 'px',
      rowInfo: {}
    }
  },
  mounted: function() {
    // this.initVideo()
  },
  destroyed: function() {
    if (this.fp) {
      this.fp.destroy()
      this.fp = null
      $('#upload-file-image-preview-paper').empty()
    }
  },
  methods: {
    show(row) {
      this.dialogVisible = true
      this.rowInfo = row
      if (row) {
        this.getImgTotal()
        this.getImgDetail()
      }
    },
    getImgDetail() {
      const payload = {
        coursewareId: this.rowInfo.coursewareId,
        index: this.coursewareImgIndex,
        checkStr: this.createRandom(16, 10, 99).join('')
      }
      imgDetail(payload).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.imgDetail = data
          if (this.imgDetail.type === '3') {
            this.$refs.video.src = data.url
          }
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 图片数量 */
    getImgTotal() {
      const params = {
        coursewareId: this.rowInfo.coursewareId
      }
      getImgTotal(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.imgTotal = data.total
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    createRandom(num, from, to) {
      var arr = []
      var json = {}
      while (arr.length < num) {
        // 产生单个随机数
        var ranNum = Math.ceil(Math.random() * (to - from)) + from
        // 通过判断json对象的索引值是否存在 来标记 是否重复
        if (!json[ranNum]) {
          json[ranNum] = 1
          arr.push(ranNum)
        }
      }
      return arr
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
        width: width < 680 ? 680 : width > 900 ? 900 : width,
        height: height < 450 ? 450 : height > 600 ? 600 : height
      }
    },

    resetEditorState() {
      this.state.editState = consts.states.TEXT
      // this.setState({
      //     editState: consts.states.NORMAL
      // });
    },

    onArrowBtnClick() {
      this.fp.endAll()
      // this.fp.startLineDrawing();
      if (this.state.editState === consts.states.ARROW) {
        this.resetEditorState()
      } else {
        this.state.editState = consts.states.ARROW
        // this.setState({
        //     editState: consts.states.ARROW
        // });
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
        // this.setState({
        //     editState: consts.states.FREE_DRAWING
        // });
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
        // this.setState({
        //     editState: consts.states.MOSAIC
        // });
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
        // this.setState({
        //     editState: consts.states.TEXT
        // });
        // this.activateTextMode();
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

    // renderArrowMenus() {
    //     return (
    //         <div className="tools-panel">
    //             <div className="tools-panel-brush">
    //                 <div>
    //                     <span className="small-brush" onClick={() => { }}> </span>
    //                 </div>
    //                 <div>
    //                     <span className="normal-brush" onClick={() => { }}> </span>
    //                 </div>
    //                 <div>
    //                     <span className="big-brush" onClick={() => { }}> </span>
    //                 </div>
    //             </div>
    //             <span className="tools-divider"> </span>
    //             <div className="tools-panel-color">
    //                 <span className="color red" onClick={this.changeEditorColor('#FF3440')}> </span>
    //                 <span className="color yellow"
    //                     onClick={this.changeEditorColor('#FFCF50')}> </span>
    //                 <span className="color green"
    //                     onClick={this.changeEditorColor('#00A344')}> </span>
    //                 <span className="color blue"
    //                     onClick={this.changeEditorColor('#0DA9D6')}> </span>
    //                 <span className="color grey"
    //                     onClick={this.changeEditorColor('#999999')}> </span>
    //                 <span className="color black"
    //                     onClick={this.changeEditorColor('#ffffff')}> </span>
    //                 <span className="color white"
    //                     onClick={this.changeEditorColor('#000000')}> </span>
    //             </div>
    //         </div>
    //     )
    // },

    // renderFreeDrawMenus() {
    //     return (
    //         <div className="tools-panel">
    //             <div className="tools-panel-brush">
    //                 <div>
    //                     <span className="small-brush" onClick={() => { }}> </span>
    //                 </div>
    //                 <div>
    //                     <span className="normal-brush" onClick={() => { }}> </span>
    //                 </div>
    //                 <div>
    //                     <span className="big-brush" onClick={() => { }}> </span>
    //                 </div>
    //             </div>
    //             <span className="tools-divider"> </span>
    //             <div className="tools-panel-color">
    //                 <span className="color red" onClick={this.changeEditorColor('#FF3440')}> </span>
    //                 <span className="color yellow"
    //                     onClick={this.changeEditorColor('#FFCF50')}> </span>
    //                 <span className="color green"
    //                     onClick={this.changeEditorColor('#00A344')}> </span>
    //                 <span className="color blue"
    //                     onClick={this.changeEditorColor('#0DA9D6')}> </span>
    //                 <span className="color grey"
    //                     onClick={this.changeEditorColor('#999999')}> </span>
    //                 <span className="color black"
    //                     onClick={this.changeEditorColor('#ffffff')}> </span>
    //                 <span className="color white"
    //                     onClick={this.changeEditorColor('#000000')}> </span>
    //             </div>
    //         </div>
    //     )
    // },

    // renderMosaicMenus() {
    //     return (
    //         <div className="tools-panel">
    //             <div className="tools-panel-brush">
    //                 <div>
    //                     <span className="small-brush" onClick={() => { }}> </span>
    //                 </div>
    //                 <div>
    //                     <span className="normal-brush" onClick={() => { }}> </span>
    //                 </div>
    //                 <div>
    //                     <span className="big-brush" onClick={() => { }}> </span>
    //                 </div>
    //             </div>
    //         </div>
    //     )
    // },

    // renderTextMenus() {
    //     return (
    //         <div className="tools-panel">
    //             <div className="tools-panel-color">
    //                 <span className="color red" onClick={this.changeEditorColor('#FF3440')}> </span>
    //                 <span className="color yellow"
    //                     onClick={this.changeEditorColor('#FFCF50')}> </span>
    //                 <span className="color green"
    //                     onClick={this.changeEditorColor('#00A344')}> </span>
    //                 <span className="color blue"
    //                     onClick={this.changeEditorColor('#0DA9D6')}> </span>
    //                 <span className="color grey"
    //                     onClick={this.changeEditorColor('#999999')}> </span>
    //                 <span className="color black"
    //                     onClick={this.changeEditorColor('#ffffff')}> </span>
    //                 <span className="color white"
    //                     onClick={this.changeEditorColor('#000000')}> </span>
    //             </div>
    //         </div>
    //     )
    // },

    // renderCropMenus() {
    //     return (
    //         <div className="tools-panel">
    //             <div className="tools-panel-crop">
    //                 <span className="tools-panel-crop-apply-btn"
    //                     onClick={this.onApplyCropBtn.bind(this)}> </span>
    //                 <span className="tools-panel-crop-cancel-btn"
    //                     onClick={this.onCancleCropBtn.bind(this)}> </span>
    //             </div>
    //         </div>
    //     )
    // },
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
    coursewareChangePage(type, coursewareImgIndex) {
      if (type === 'last') {
        if (coursewareImgIndex === 1) {
          this.$message.warning('已经是第一页')
        } else {
          const params = {
            index: coursewareImgIndex - 1,
            coursewareId: this.rowInfo.coursewareId,
            checkStr: this.createRandom(16, 10, 99).join('')
          }
          this.getImgDetail(params)
        }
      } else if (type === 'next') {
        if (coursewareImgIndex === this.imgTotal) {
          this.$message.warning('已经是最后一页')
        } else {
          const params = {
            index: coursewareImgIndex + 1,
            coursewareId: this.rowInfo.coursewareId,
            checkStr: this.createRandom(16, 10, 99).join('')
          }
          this.getImgDetail(params)
        }
      }
    },
    /* 下一张图片 */
    onURL() {
      const url = this.imgList[2].url
      this.loadImage(url)
    },
    loadImage(url) {
      this.fp.loadImageFromURL(url, 'image name')
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../scss/index.scss"; //导入外部scss文件

.coursewareOverdue /deep/ {
  .el-dialog {
    margin-top: 40px !important;
    height: calc(100vh - 40px);
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
  .draw_board {
    left: calc(((100% - 550px) / 2) + 560px) !important;
    width: 96px !important;
    height: 40px;
    padding: 5px 20px;
    bottom: 40px;
    position: fixed;
    color: #ccc;
    background: rgba(0, 0, 0, 0.4);
    border-top-left-radius: 10px 20px;
    border-top-right-radius: 10px 20px;
    border-bottom-left-radius: 10px 20px;
    border-bottom-right-radius: 10px 20px;
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
    // display: none;
    background: transparent;
    border-bottom: 0;
    .el-dialog__headerbtn .el-dialog__close {
      color: #fff;
      font-size: 20px;
    }
  }
  .el-dialog__body {
    padding: 0 !important;
    max-height: 100%;
    height: calc(100vh - 80px);
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
