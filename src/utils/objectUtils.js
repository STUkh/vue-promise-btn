export const isPromise = function (obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'
}

export const isString = function (obj) {
  return typeof obj === 'string'
}

export const isObject = function (obj) {
  return obj === Object(obj)
}
