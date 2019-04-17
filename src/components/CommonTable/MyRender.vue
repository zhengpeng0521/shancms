<script>
export default {
  functional: true,
  props: {
    row: {
      type: Object,
      default: () => {}
    },
    render: Function,//eslint-disable-line
    index: {
      type: Number,
      default: null
    },
    column: {
      type: Object,
      default: null
    }
  },
  render: (h, ctx) => {
    const params = {
      row: ctx.props.row,
      index: ctx.props.index
    }
    if (ctx.props.column) params.column = ctx.props.column
    return ctx.props.render(h, params)
  }
}
</script>
