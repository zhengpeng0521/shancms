import Base from './base.js'
import consts from '../consts'
import MosaicShape from '../shape/mosaic.js'
import $ from 'jquery'

/* eslint-disable */
export default class Mosaic extends Base {
  constructor(parent) {
    super()
    this.setParent(parent)

    this.name = consts.moduleNames.MOSAIC

    this._dimensions = 8

    this._listeners = {
      mousedown: this._onFabricMouseDown.bind(this),
      mousemove: this._onFabricMouseMove.bind(this),
      mouseup: this._onFabricMouseUp.bind(this)
    }
  }

  /**
   * @param {{dimensions: ?number}} [setting] - Mosaic width
   */
  start(setting) {
    const canvas = this.getCanvas()

    canvas.defaultCursor = 'crosshair'
    canvas.selection = false

    setting = setting || {}
    this._dimensions = parseInt(setting.dimensions, 10) || this._dimensions

    canvas.forEachObject(obj => {
      obj.set({
        evented: false
      })
    })

    canvas.on({
      'mouse:down': this._listeners.mousedown
    })
  }

  end() {
    const canvas = this.getCanvas()

    canvas.defaultCursor = 'default'
    canvas.selection = false

    canvas.forEachObject(obj => {
      obj.set({
        evented: true
      })
    })
    canvas.off('mouse:down', this._listeners.mousedown)
  }

  _onFabricMouseDown(fEvent) {
    const canvas = this.getCanvas()
    const lowerCanvas = canvas.getElement()
    const mosaicLayer = (this.mosaicLayer = $(lowerCanvas.cloneNode(true)))
    mosaicLayer.removeClass('lower-canvas').addClass('mosaic-canvas')
    this.mosaicArr = []
    $(lowerCanvas).after(mosaicLayer)
    canvas.on({
      'mouse:move': this._listeners.mousemove,
      'mouse:up': this._listeners.mouseup
    })
  }

  _onFabricMouseMove(fEvent) {
    let ratio = this.getCanvasRatio()
    ratio = Math.ceil(ratio)
    const dimensions = this._dimensions * ratio
    const canvas = this.getCanvas()
    const pointer = canvas.getPointer(fEvent.e)
    const imageData = canvas.contextContainer.getImageData(
      parseInt(pointer.x, 10),
      parseInt(pointer.y, 10),
      dimensions,
      dimensions
    )
    // let imageData = canvas.getContext().getImageData(parseInt(pointer.x), parseInt(pointer.y), this._dimensions, this._dimensions);
    const rgba = [0, 0, 0, 0]
    const length = imageData.data.length / 4
    for (let i = 0; i < length; i++) {
      rgba[0] += imageData.data[i * 4]
      rgba[1] += imageData.data[i * 4 + 1]
      rgba[2] += imageData.data[i * 4 + 2]
      rgba[3] += imageData.data[i * 4 + 3]
    }
    const mosaicRect = {
      left: pointer.x,
      top: pointer.y,
      fill: `rgb(${parseInt(rgba[0] / length)},${parseInt(
        rgba[1] / length
      )},${parseInt(rgba[2] / length)})`,
      dimensions: dimensions
    }
    this.mosaicArr.push(mosaicRect)
    const ctx = this.mosaicLayer[0].getContext('2d')
    ctx.fillStyle = mosaicRect.fill
    ctx.fillRect(
      mosaicRect.left,
      mosaicRect.top,
      mosaicRect.dimensions,
      mosaicRect.dimensions
    )
  }

  _onFabricMouseUp() {
    const canvas = this.getCanvas()
    if (this.mosaicArr && this.mosaicArr.length > 0) {
      const __mosaicShape = new MosaicShape({
        mosaicRects: this.mosaicArr,
        selectable: false,
        left: 0,
        top: 0,
        originX: 'center',
        originY: 'center'
      })
      canvas.add(__mosaicShape)
      canvas.renderAll()
    }
    if (this.mosaicLayer) {
      this.mosaicLayer.remove()
    }
    this.mosaicArr = []
    canvas.off({
      'mouse:move': this._listeners.mousemove,
      'mouse:up': this._listeners.mouseup
    })
  }

  /**
   * Get ratio value of canvas
   * @returns {number} Ratio value
   */
  getCanvasRatio() {
    const canvasElement = this.getCanvasElement()
    const cssWidth = parseInt(canvasElement.style.width, 10)
    const originWidth = canvasElement.width
    const ratio = originWidth / cssWidth
    return ratio
  }
}
