<template>
  <div class="coursewareOverdue">
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
                  @click="coursewareChangePage('last',coursewareImgIndex)"
                >
                <img
                  src="https://img.ishanshan.com/gimg/n/20190312/5c39878b5b50c97cd53a72599a2fba7e"
                  @click="coursewareChangePage('next',coursewareImgIndex)"
                >
                <!-- <i
                class="dxicon dxicon-image-suoxiao"
                @click="zoomIn(0.2)"
              />
              <div class="thumb-divider" />
              <i
                class="dxicon dxicon-image-fangda"
                @click="zoomOut(0.2)"
              /> -->
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
                <!-- <i
                class="el-icon-caret-left"
                @click="coursewareChangePage('last',coursewareImgIndex)"
              />
              <el-input
                v-model="coursewareImgIndex"
                :min="1"
                :max="imgTotal"
                style="width:60px"
                @keyup.native="coursewareChangePage('input')"
              />
              <i
                class="el-icon-caret-right"
                @click="coursewareChangePage('next',coursewareImgIndex)"
              />
              <div style="color : #fff ;display:inline-block">共{{ imgTotal }}张</div>
              <i
                class="dxicon dxicon-image-xuanzhuan"
                @click="onRotationBtnClick"
              />
              <i
                class="dxicon dxicon-image-xuanzhuan"
                @click="onRotationLeftBtnClick"
              />
              <i
                class="dxicon dxicon-image-jiantou"
                @click="onArrowBtnClick"
              /> -->

                <!-- <i
                class="dxicon dxicon-image-huabi"
                @click="onFreeDrawBtnClick"
              /> -->

                <!-- <i
                class="dxicon dxicon-image-text"
                @click="onTextBtnClick"
              />
              <i
                class="dxicon dxicon-image-jiancai"
                @click="onPanBtnClick"
              /> -->
                <!-- <i
                class="dxicon dxicon-image-masaike"
                @click="onMosaicBtnClick"
              /> -->
                <!-- <i
                class="dxicon dxicon-image-xuanzhuan"
                @click="onRotationBtnClick"
              />
              <i
                class="dxicon dxicon-image-jiancai"
                @click="onCropBtnClick"
              />

              <span class="tools-divider" />
              <span
                class="file-button-cancel"
                @click="onClearBtnClick"
              >复原</span> -->
                <!-- <span
                class="file-button-cancel"
                @click="onUndoBtn"
              >undo</span>

              <span
                class="file-button-cancel"
                @click="onRedoBtn"
              >redo</span> -->
                <!-- <span
                class="file-button-cancel"
                @click="onURL"
              >url</span> -->
                <!-- <i
                class="el-icon-close"
                @click="close"
              /> -->
                <!-- {menus} -->
                <!-- <div class="tools-panel" v-if="state.editState === '
                FREE_DRAWING'"
              >
                <div class="tools-panel-brush">
                  <div>
                    <span class="small-brush"> </span>
                  </div>
                  <div>
                    <span class="normal-brush"> </span>
                  </div>
                  <div>
                    <span class="big-brush"> </span>
                  </div>
                </div>
                <span class="tools-divider"> </span>
                <div class="tools-panel-color">
                  <span
                    class="color red"
                    @click="changeEditorColor('#FF3440')"
                  > </span>
                  <span
                    class="color yellow"
                    @click="changeEditorColor('#FFCF50')"
                  > </span>
                  <span
                    class="color green"
                    @click="changeEditorColor('#00A344')"
                  > </span>
                  <span
                    class="color blue"
                    @click="changeEditorColor('#0DA9D6')"
                  > </span>
                  <span
                    class="color grey"
                    @click="changeEditorColor('#999999')"
                  > </span>
                  <span
                    class="color black"
                    @click="changeEditorColor('#ffffff')"
                  > </span>
                  <span
                    class="color white"
                    @click="changeEditorColor('#000000')"
                  > </span>
                </div>
            </div> -->
                <!-- </i> -->
              </div>
              <div class="ctn-btns" />
            </div>
            <div class="draw_board">
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
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import $ from 'jquery'
import FabricPhoto from '../croe/index'
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
      rowInfo: {},
      // btnClassname: ({
      //   'file-button': true,
      //   'upload-success': true
      // }),
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
      this.rowInfo = row
      if (row) {
        this.getImgTotal()
        this.coursewareImgIndex = 1
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
          this.dialogVisible = true
          const url = `data:image/jpg;base64,${data.arr}`
          this.$nextTick(function() {
            this.fp = new FabricPhoto('#upload-file-image-preview', {
              cssMaxWidth: 900,
              cssMaxHeight: 600
            })
            this.fp.once('loadImage', (oImage) => {
              this.fp.clearUndoStack()
            })
            // this.fp.loadImageFromURL('http://mss.ximing.ren/v1/mss_814dc1610cda4b2e8febd6ea2c809db5/image/1484297783302.jpg', 'image name');
            this.fp.loadImageFromURL(url, 'image name')
            // this.fp.loadImageFromURL('http://mss.ximing.ren/v1/mss_814dc1610cda4b2e8febd6ea2c809db5/image/1484297784312.png', 'image name');
            // this.fp.loadImageFromURL('http://mss.ximing.ren/v1/mss_814dc1610cda4b2e8febd6ea2c809db5/image/1484297783376.jpeg', 'image name');
            // this.fp.loadImageFromURL('http://mss.ximing.ren/v1/mss_814dc1610cda4b2e8febd6ea2c809db5/image/1484297783036.png', 'image name');
            // this.fp.loadImageFromURL('http://mss.ximing.ren/v1/mss_814dc1610cda4b2e8febd6ea2c809db5/image/1486378338826.png','带文字的')
            this.fp.on('selectObject', (obj) => {
              // console.log('selectObject--->',obj);
              if (obj.type === 'rect' || obj.type === 'circle' || obj.type === 'triangle') {
                this.state.editState = consts.states.SHAPE
                // this.setState({
                //     editState: consts.states.SHAPE,
                // });
                this.activateShapeMode()
              } else if (obj.type === 'text') {
                this.state.editState = consts.states.TEXT
                // this.setState({
                //     editState: consts.states.TEXT,
                // });
                this.activateTextMode()
              }
            })
            this.fp.on('activateText', (obj) => {
              // console.log('activateText----obj--->',obj);
              // add new text on cavas
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
                // $btnUndo.addClass('disabled');
                // resizeEditor();
              },
              emptyRedoStack: () => {
                // $btnRedo.addClass('disabled');
                // resizeEditor();
              },
              pushUndoStack: () => {
                // $btnUndo.removeClass('disabled');
                // resizeEditor();
              },
              pushRedoStack: () => {
                // $btnRedo.removeClass('disabled');
                // resizeEditor();
              },
              endCropping: () => {
                // $cropSubMenu.hide();
                // resizeEditor();
              },
              endFreeDrawing: () => {
                // $freeDrawingSubMenu.hide();
              },
              adjustObject: (obj, type) => {
                if (obj.type === 'text' && type === 'scale') {
                  // $inputFontSizeRange.val(obj.getFontSize());
                }
              }
            })
          })
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
    coursewareChangePage(type, index) {
      const obj = {
        coursewareId: this.rowInfo.coursewareId,
        checkStr: this.createRandom(16, 10, 99).join('')
      }
      if (type === 'input') {
        var reg = /^[1-9]\d*$/
        if (this.coursewareImgIndex) {
          if (reg.test(this.coursewareImgIndex)) {
            if ((this.coursewareImgIndex + '').indexOf('.') > -1) {
              this.$message.warning('页码不可以为小数')
              this.coursewareImgIndex = 1
              const params = {
                index: 1,
                ...obj
              }
              imgDetail(params).then(res => {
                const data = res.data
                if (data.errorCode === 0) {
                  const url = `data:image/jpg;base64,${data.arr}`
                  this.loadImage(url)
                } else {
                  this.$message.error(data.errorMessage || '图片获取出错')
                }
              })
            } else if (this.coursewareImgIndex < 1) {
              this.coursewareImgIndex = 1
              this.$message.warning('页码不可以为负数')
            } else if (this.coursewareImgIndex > this.imgTotal) {
              this.coursewareImgIndex = 1
              this.$message.warning('页码不可以超出总张数')
            } else {
              const params = {
                index: this.coursewareImgIndex,
                ...obj
              }
              imgDetail(params).then(res => {
                const data = res.data
                if (data.errorCode === 0) {
                  const url = `data:image/jpg;base64,${data.arr}`
                  this.loadImage(url)
                } else {
                  this.$message.error(data.errorMessage || '图片获取出错')
                }
              })
            }
          } else {
            this.coursewareImgIndex = 1
          }
        } else {
          this.coursewareImgIndex = 1
        }
      } else if (type === 'last') {
        if (this.coursewareImgIndex === 1) {
          this.$message.warning('已经是第一页')
        } else {
          this.coursewareImgIndex = this.coursewareImgIndex - 1
          const params = {
            index: index - 1,
            ...obj
          }
          imgDetail(params).then(res => {
            const data = res.data
            if (data.errorCode === 0) {
              const url = `data:image/jpg;base64,${data.arr}`
              this.loadImage(url)
            } else {
              this.$message.error(data.errorMessage || '图片获取出错')
            }
          })
        }
      } else if (type === 'next') {
        if (this.coursewareImgIndex === this.imgTotal) {
          this.$message.warning('已经是最后一页')
        } else {
          this.coursewareImgIndex = this.coursewareImgIndex + 1
          const params = {
            index: index + 1,
            ...obj
          }
          imgDetail(params).then(res => {
            const data = res.data
            if (data.errorCode === 0) {
              const url = `data:image/jpg;base64,${data.arr}`
              this.loadImage(url)
            } else {
              this.$message.error(data.errorMessage || '图片获取出错')
            }
          })
        }
      }
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
    left: calc((100% - 546px) / 2);
    display: inline-flex;
    margin-top: 30px;
    bottom: 40px;
  }
  .draw_board {
    left: calc(((100% - 364px) / 2) + 374px) !important;
    width: 172px !important;
    height: 40px;
    padding: 11px 20px;
    bottom: 40px;
    // position: fixed;
    color: #ccc;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    justify-content: space-between;
    -webkit-box-align: center;
    align-items: center;
    display: flex;
    img {
      // font-size: 0px;
      // vertical-align: middle;
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
