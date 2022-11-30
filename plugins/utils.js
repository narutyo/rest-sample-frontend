import queryString from 'query-string'

const urlShorter = (str) => {
  if (str === '' || str === undefined) { return '' }

  str = str.replace(/(https?:\/\/[a-zA-Z0-9\-_.:@!~*'(¥);/?&=+$,%#]+)/g, function (match) {
    return mbSubstr(match, 40)
  })
  return str
}

const nl2br = (str) => {
  if (str === '' || str === undefined) { return '' }
  str = str.replace(/\r\n/g, '<br />')
  str = str.replace(/(\n|\r)/g, '<br />')
  return str
}

const mbSubstr = (str, length, noAdd = false) => {
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
  if (str.length > length && !noAdd) { ret += '&hellip;' }
  return ret
}

function isSurrogatePear (upper, lower) {
  return upper >= 0xD800 && upper <= 0xDBFF && lower >= 0xDC00 && lower <= 0xDFFF
};

function formatDate (dt) {
  const y = dt.getFullYear()
  const m = ('00' + (dt.getMonth() + 1)).slice(-2)
  const d = ('00' + dt.getDate()).slice(-2)
  return (y + '-' + m + '-' + d)
}

function escapeHtml (str) {
  if (typeof str !== 'string') {
    return str
  }
  return str.replace(/[&'`"<>]/g, function (match) {
    return {
      '&': '&amp;',
      "'": '&#x27;',
      '`': '&#x60;',
      '"': '&quot;',
      '<': '&lt;',
      '>': '&gt;'
    }[match]
  })
}

function searchParams (paramJson) {
  const params = new URLSearchParams(queryString.stringify(paramJson))
  return params.toString()
}

export default ({ app }, inject) => {
  inject('nl2br', nl2br)
  inject('mb_substr', mbSubstr)
  inject('url_shorter', urlShorter)
  inject('format_date', formatDate)
  inject('escape_html', escapeHtml)
  inject('search_params', searchParams)
}
