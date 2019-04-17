<script>

import { DatePicker } from 'element-ui'

export default {
  mixins: [DatePicker], // 继承el-table-column

  methods: {
    parseValue(value) {
      console.log('parseValue===>')
      return value
    },

    formatToValue(date) {
      console.log('formatToValue===>')
      return date
    },

    // {parse, formatTo} String deals with user input
    parseString(value) {
      console.log('parseString===>')
      return value
    },

    formatToString(value) {
      console.log('formatToString===>')
      return value
    }
  }

}
</script>

