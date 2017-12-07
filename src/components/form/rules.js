function RuleRequire(isRequired = true) {
  return {
    /**
     * @param field
     * @returns {{required: boolean, message: string}}
     */
    toConfig: function(field) {
      return {
        required: isRequired,
        message: `${field.label}不能为空`
      }
    }
  }
}
function RuleNumber() {
  return {
    /**
     * @param field
     * @returns {{validator: function}}
     */
    toConfig: function(field) {
      let checkNumber = (rule, value, callback) => {
        if (/^\d+$/.test(value) === false) {
          callback(new Error(`${field.label}只能是数字`))
        } else {
          callback()
        }
      }
      return {
        validator: checkNumber
      }
    }
  }
}
const Range = {
  shortest: {min: 0, max: 1},
  short: {min: 0, max: 20},
  shortMiddle: {min: 0, max: 50},
  middle: {min: 0, max: 100},
  long: {min: 0, max: 500},
  longest: {min: 0, max: 1200}
}
function RuleRange(range = 'short') {
  return {
    /**
     * @returns {{required: boolean, message: string}}
     */
    toConfig: function() {
      return {
        min: range.min,
        max: range.max,
        message: `长度在 ${range.min} 到 ${range.max} 个字符`,
        trigger: 'blur'
      }
    }
  }
}

export {RuleRequire, RuleNumber, RuleRange, Range}
