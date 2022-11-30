const emailCheck = (str) => {
  const pattern = /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/
  const regExp = new RegExp(pattern)
  return regExp.test(str)
}

export default ({ app }, inject) => {
  inject('email_check', emailCheck)
}
