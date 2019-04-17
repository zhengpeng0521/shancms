<template>
  <span>
    <transition
      :name="transition"
      @after-enter="handleAfterEnter"
      @after-leave="handleAfterLeave"
    >
      <div
        v-show="!disabled && showPopper"
        ref="popper"
        :class="[popperClass, content && 'el-popover--plain']"
        :style="{ width: width + 'px' }"
        :id="tooltipId"
        :aria-hidden="(disabled || !showPopper) ? 'true' : 'false'"
        class="el-popover el-popper"
        role="tooltip"
        @method="sure"
      >
        <div
          v-if="title"
          class="el-popover__title"
          v-text="title"
        />
        <slot>{{ content }}</slot>
        <div style="float:right;margin:0px 4px 4px 0;">
          <el-button
            size="mini"
            class="delete_btn"
            @click="doClose"
          >取消</el-button>
          <el-button
            type="primary"
            size="mini"
            class="edit_btn"
            @click="sure"
          >确定</el-button>
        </div>
      </div>
    </transition>
    <slot name="reference" />
  </span>
</template>
<script>
import Popper from 'element-ui/src/utils/vue-popper'
import { on, off } from 'element-ui/src/utils/dom'
import { addClass, removeClass } from 'element-ui/src/utils/dom'
import { generateId } from 'element-ui/src/utils/util'

export default {

  mixins: [Popper],

  props: {
    trigger: {
      type: String,
      default: 'click',
      validator: value => ['click', 'focus', 'hover', 'manual'].indexOf(value) > -1
    },
    openDelay: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: null
    },
    reference: {}, //eslint-disable-line
    popperClass: String, //eslint-disable-line
    width: {}, //eslint-disable-line
    visibleArrow: { //eslint-disable-line
      default: true
    },
    arrowOffset: {
      type: Number,
      default: 0
    },
    transition: {
      type: String,
      default: 'fade-in-linear'
    }
  },

  computed: {
    tooltipId() {
      return `el-popover-${generateId()}`
    }
  },
  watch: {
    showPopper(val) {
      if (this.disabled) {
        return
      }
      val ? this.$emit('show') : this.$emit('hide')
    }
  },

  mounted() {
    let reference = this.referenceElm = this.reference || this.$refs.reference
    const popper = this.popper || this.$refs.popper

    if (!reference && this.$slots.reference && this.$slots.reference[0]) {
      reference = this.referenceElm = this.$slots.reference[0].elm
    }
    // 可访问性
    if (reference) {
      addClass(reference, 'el-popover__reference')
      reference.setAttribute('aria-describedby', this.tooltipId)
      reference.setAttribute('tabindex', 0) // tab序列
      popper.setAttribute('tabindex', 0)

      if (this.trigger !== 'click') {
        on(reference, 'focusin', () => {
          this.handleFocus()
          const instance = reference.__vue__
          if (instance && typeof instance.focus === 'function') {
            instance.focus()
          }
        })
        on(popper, 'focusin', this.handleFocus)
        on(reference, 'focusout', this.handleBlur)
        on(popper, 'focusout', this.handleBlur)
      }
      on(reference, 'keydown', this.handleKeydown)
      on(reference, 'click', this.handleClick)
    }
    if (this.trigger === 'click') {
      on(reference, 'click', this.doToggle)
      on(document, 'click', this.handleDocumentClick)
    } else if (this.trigger === 'hover') {
      on(reference, 'mouseenter', this.handleMouseEnter)
      on(popper, 'mouseenter', this.handleMouseEnter)
      on(reference, 'mouseleave', this.handleMouseLeave)
      on(popper, 'mouseleave', this.handleMouseLeave)
    } else if (this.trigger === 'focus') {
      if (reference.querySelector('input, textarea')) {
        on(reference, 'focusin', this.doShow)
        on(reference, 'focusout', this.doClose)
      } else {
        on(reference, 'mousedown', this.doShow)
        on(reference, 'mouseup', this.doClose)
      }
    }
  },

  destroyed() {
    const reference = this.reference

    off(reference, 'click', this.doToggle)
    off(reference, 'mouseup', this.doClose)
    off(reference, 'mousedown', this.doShow)
    off(reference, 'focusin', this.doShow)
    off(reference, 'focusout', this.doClose)
    off(reference, 'mousedown', this.doShow)
    off(reference, 'mouseup', this.doClose)
    off(reference, 'mouseleave', this.handleMouseLeave)
    off(reference, 'mouseenter', this.handleMouseEnter)
    off(document, 'click', this.handleDocumentClick)
  },

  methods: {
    sure() {
      this.$emit('method')
      this.showPopper = !this.showPopper
    },
    doToggle() {
      this.showPopper = !this.showPopper
    },
    doShow() {
      this.showPopper = true
    },
    doClose() {
      this.showPopper = false
    },
    handleFocus() {
      addClass(this.referenceElm, 'focusing')
      if (this.trigger !== 'manual') this.showPopper = true
    },
    handleClick() {
      removeClass(this.referenceElm, 'focusing')
    },
    handleBlur() {
      removeClass(this.referenceElm, 'focusing')
      if (this.trigger !== 'manual') this.showPopper = false
    },
    handleMouseEnter() {
      clearTimeout(this._timer)
      if (this.openDelay) {
        this._timer = setTimeout(() => {
          this.showPopper = true
        }, this.openDelay)
      } else {
        this.showPopper = true
      }
    },
    handleKeydown(ev) {
      if (ev.keyCode === 27 && this.trigger !== 'manual') { // esc
        this.doClose()
      }
    },
    handleMouseLeave() {
      clearTimeout(this._timer)
      this._timer = setTimeout(() => {
        this.showPopper = false
      }, 200)
    },
    handleDocumentClick(e) {
      let reference = this.reference || this.$refs.reference
      const popper = this.popper || this.$refs.popper

      if (!reference && this.$slots.reference && this.$slots.reference[0]) {
        reference = this.referenceElm = this.$slots.reference[0].elm
      }
      if (!this.$el ||
        !reference ||
        this.$el.contains(e.target) ||
        reference.contains(e.target) ||
        !popper ||
        popper.contains(e.target)) return
      this.showPopper = false
    },
    handleAfterEnter() {
      this.$emit('after-enter')
    },
    handleAfterLeave() {
      this.$emit('after-leave')
      this.doDestroy()
    }
  }
}
</script>
