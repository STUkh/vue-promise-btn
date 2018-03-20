import Vue from 'vue'
import { isString, isObject, isPromise } from '../utils/objectUtils'

const pluginElPropName = '$promiseBtnId'
let elementId = 0

export const stringHTMLRenderer = function (options) {
  return `
  <span class="promise-btn__spinner-wrapper" 
        :class="{[options.spinnerHiddenClass]: !show || false}"
        v-show="options.autoHideSpinnerWrapper ? show : true"
  >
    ${options.loader}
  </span>`
}

export const componentRenderer = function (options) {
  return function (h) {
    return h('span', {
      class: {
        'promise-btn__spinner-wrapper': true,
        [options.spinnerHiddenClass]: options.spinnerHiddenClass ? !this.show : false
      },
      directives: [{
        name: 'show',
        value: options.autoHideSpinnerWrapper ? this.show : true
      }]
    }, [
      h(options.loader)
    ])
  }
}

const initSpinner = function (btnEl, options, vnode, isLoaderString) {
  const dummyEl = document.createElement('SPAN')
  btnEl.appendChild(dummyEl)

  let vueSpinnerOptions = {
    el: dummyEl,
    data: { show: false },
    props: {
      parent: {
        type: Object,
        default: () => vnode.context
      }
    },
    render: options.componentRenderer(options)
  }

  if (isLoaderString) {
    const tpl = options.stringHTMLRenderer(options)
    const res = Vue.compile(tpl)
    vueSpinnerOptions = {
      ...vueSpinnerOptions,
      data: {
        ...vueSpinnerOptions.data,
        options
      },
      render: res.render,
      staticRenderFns: res.staticRenderFns
    }
  }

  return vueSpinnerOptions
}

const enableBtn = function (el, options) {
  if (el.getAttribute('disabled') && options.disableBtn) el.removeAttribute('disabled')
  el.classList.remove(options.btnLoadingClass)
}

const disableBtn = function (el, options) {
  if (options.disableBtn) el.setAttribute('disabled', 'disabled')
  el.classList.add(options.btnLoadingClass)
}

export const setupVuePromiseBtn = function (globalOptions) {
  const directive = {
    listeners: {},
    init (el, binding, vnode) {
      const isBindingValueObj = isObject(binding.value)
      const id = el[pluginElPropName] = elementId++
      const instanceOptions = isBindingValueObj ? binding.value : {}
      const options = {
        ...globalOptions,
        ...instanceOptions
      }
      const handler = vnode.data.on && vnode.data.on[options.action] && vnode.data.on[options.action]._withTask
      const isLoaderString = isString(options.loader)
      let btnEl = el
      let spinnerVM = null
      let minTimeoutDone = false
      let promiseDone = false

      const handleLoadingFinished = () => {
        if (minTimeoutDone && promiseDone) {
          spinnerVM.show = false
          minTimeoutDone = false
          promiseDone = false
          enableBtn(btnEl, options)
        }
      }

      const beforeResponseHandler = function () {
        scheduled = true
        disableBtn(btnEl, options)
        if (options.showSpinner) {
          spinnerVM.show = true
          setTimeout(function () {
            minTimeoutDone = true
            handleLoadingFinished(minTimeoutDone, promiseDone, spinnerVM)
          }, options.minTimeout)
        }
      }

      const resolveHandler = function () {
        scheduled = false
        if (options.showSpinner) {
          promiseDone = true
          handleLoadingFinished(minTimeoutDone, promiseDone, spinnerVM)
        }
      }

      // Register info in listeners object
      directive.listeners[id] = {
        el,
        eventType: options.action,
        handler: handler
      }

      // Remove native event listener
      el.removeEventListener(options.action, handler)

      if (!handler) throw new Error('Please, provide proper handler/action for promise-btn')
      if (options.action === 'submit') {
        btnEl = el.querySelector('[type="submit"]')
        if (!btnEl) throw new Error('No submit button found')
      }

      if (options.showSpinner) {
        const vueSpinnerOptions = initSpinner(btnEl, options, vnode, isLoaderString)
        spinnerVM = new Vue(vueSpinnerOptions)
      }

      let scheduled = false

      // Set custom event that will replace original listener
      directive.listener = function (e) {
        if (options.disableBtn && scheduled) return
        const response = handler(e)
        if (isPromise(response)) {
          beforeResponseHandler()
          response
            .then(resolveHandler)
            .catch(e => {
              resolveHandler()
              throw e
            })
        }
      }
    },
    bind (el, binding, vnode) {
      // Init
      binding.def.init(...arguments)

      // Replace native event listener
      const id = el[pluginElPropName]
      const { eventType } = directive.listeners[id]
      el.addEventListener(eventType, directive.listener)
    },
    unbind (el, binding) {
      const id = el[pluginElPropName]
      const { eventType } = directive.listeners[id]
      el.removeEventListener(eventType, directive.listener)
      delete directive.listeners[id]
      delete el[pluginElPropName]
    }
  }
  return directive
}

export default setupVuePromiseBtn
