/*
 *	打印函数(传入id)
 */
export function do_print(id_str) {
  var el = document.getElementById(id_str)
  var iframe = document.createElement('iframe')
  var doc = null
  iframe.setAttribute(
    'style',
    'position:absolute;width:0px;height:0px;left:-500px;top:-500px;'
  )
  document.body.appendChild(iframe)
  doc = iframe.contentWindow.document
  doc.write('<div>' + el.innerHTML + '</div>')
  doc.close()
  iframe.contentWindow.focus()
  iframe.contentWindow.print()
  if (navigator.userAgent.indexOf('MSIE') > 0) {
    document.body.removeChild(iframe)
  }
}

/**
 * 打印图片函数(传入图片数组)
 */
export function do_printImg(courseWareArr) {
  var iframe = document.createElement('iframe')
  var elInner = ''
  !!courseWareArr &&
    courseWareArr.map((item, index) => {
      elInner +=
        '<img src="' +
        item +
        '" key ="' +
        index +
        '" style="width:100%;height:auto" id="pimg' +
        index +
        '"/>'
    })
  var doc = null
  iframe.setAttribute(
    'style',
    'position:absolute;width:0px;height:auto;left:-500px;top:-500px;'
  )
  document.body.appendChild(iframe)
  doc = iframe.contentWindow.document
  doc.write(
    '<div id="print_img_div" style="width:1000px">' + elInner + '</div>'
  )
  doc.close()
  const count = (!!courseWareArr && courseWareArr.length) || 0
  var pintImgTimer = setInterval(function() {
    let allComplete = true
    for (let i = 0; i < count; i++) {
      if (!doc.getElementById('pimg' + i).complete) {
        allComplete = false
      }
    }
    if (allComplete) {
      iframe.contentWindow.focus()
      iframe.contentWindow.print()
      if (navigator.userAgent.indexOf('MSIE') > 0) {
        document.body.removeChild(iframe)
      }
      clearInterval(pintImgTimer)
    }
  }, 1000)
}
