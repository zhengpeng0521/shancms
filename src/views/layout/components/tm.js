export default {
  name: 'TmView',
  functional: true,
  props: {
    info: {
      type: Object
    }
  },
  render(_, { props, children, parent, data }) {
    const h = parent.$createElement
    const name = props.info.name
    const cache = parent._tmViewCache || (parent._tmViewCache = {})
    const component = cache[name] || props.info.component
    cache[name] = cache[name] || component
    return h(component, data, children)
  }
}
