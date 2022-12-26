import Vue from 'vue'

Vue.filter('date_format_jpn', function (value) {
  const date = new Date(value)

  const year = date.getFullYear()
  let month = date.getMonth() + 1
  if (month < 10) { month = '0' + month }
  let day = date.getDate()
  if (day < 10) { day = '0' + day }

  return year + '年' + month + '月' + day + '日'
})

Vue.filter('timestamp_to_datetime_format', function (value) {
  const date = new Date(value * 1000)

  const year = date.getFullYear()
  let month = date.getMonth() + 1
  if (month < 10) { month = '0' + month }
  let day = date.getDate()
  if (day < 10) { day = '0' + day }
  let hour = date.getHours()
  if (hour < 10) { hour = '0' + hour }
  let minute = date.getMinutes()
  if (minute < 10) { minute = '0' + minute }

  return year + '/' + month + '/' + day + ' ' + hour + ':' + minute
})

Vue.filter('datetime_format', function (value) {
  const date = new Date(value)

  const year = date.getFullYear()
  let month = date.getMonth() + 1
  if (month < 10) { month = '0' + month }
  let day = date.getDate()
  if (day < 10) { day = '0' + day }
  let hour = date.getHours()
  if (hour < 10) { hour = '0' + hour }
  let minute = date.getMinutes()
  if (minute < 10) { minute = '0' + minute }

  return year + '/' + month + '/' + day + ' ' + hour + ':' + minute
})

Vue.filter('short_datetime_format', function (value) {
  const date = new Date(value)

  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  let minute = date.getMinutes()
  if (minute < 10) { minute = '0' + minute }

  return month + '/' + day + ' ' + hour + ':' + minute
})

Vue.filter('mb_substr', function (str, length) {
  const begin = 0
  const end = length
  let ret = ''
  for (let i = 0, len = 0; i < str.length; i++, len++) {
    const upper = str.charCodeAt(i)
    const lower = str.length > (i + 1) ? str.charCodeAt(i + 1) : 0
    let s = ''
    if (isSurrogatePear(upper, lower)) {
      i++
      s = String.fromCharCode(upper, lower)
    } else {
      s = String.fromCharCode(upper)
    }
    if (begin <= len && len < end) { ret += s }
  }
  if (str.length > length) { ret += '...' }
  return ret
})

function isSurrogatePear (upper, lower) {
  return upper >= 0xD800 && upper <= 0xDBFF && lower >= 0xDC00 && lower <= 0xDFFF
}
