let isObjectEmpty = function (jsonObject) {
  if (jsonObject === null || jsonObject === undefined) return true
  else if(jsonObject > 0) return false
  return Object.keys(jsonObject).length === 0
}

let getQueryVariable = function (variable, defaultValue, statedUrl='') {
  var querys = !this.isObjectEmpty(statedUrl) ? statedUrl : window.location.href
  if (querys.split('?').length > 1) {
    var query = querys.split('?')[1]
    var vars = query.split('&')
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=')
      if (pair[0] === variable) {
        return pair[1]
      }
    }
  }
  return defaultValue
}

let filterByObjectid = function (obj, filtervalue) {
  var newobj = obj.filter(function (a) {
    return a.id == filtervalue
  })
  return newobj
}

export default {
  isObjectEmpty,
  getQueryVariable,
  filterByObjectid,
}
  