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
      const isLoaderString = isString(options.loader)
      let btnEl = el
      let spinnerVM = null
      let minTimeoutDone = false
      let promiseDone = false
      let scheduled = false

      // START: loading state handlers
      const handleLoadingFinished = (btnEl) => {
        if (minTimeoutDone && promiseDone) {
          if (options.showSpinner) {
            spinnerVM.show = false
          }
          minTimeoutDone = false
          promiseDone = false
          enableBtn(btnEl, options)
        }
      }

      const initLoading = (btnEl) => {
        scheduled = true
        disableBtn(btnEl, options)
        if (options.showSpinner) {
          spinnerVM.show = true
        }
        setTimeout(function () {
          minTimeoutDone = true
          handleLoadingFinished(btnEl)
        }, options.minTimeout)
      }

      const finishLoading = () => {
        scheduled = false
        promiseDone = true
        handleLoadingFinished(btnEl)
      }

      const getFiniteHandler = (expression) => {
        let result = expression
        while (typeof result === 'function') {
          result = result()
        }
        return result
      }

      const promiseHanlder = (btnEl, promise) => {
        initLoading(btnEl)
        return promise
          .then(() => finishLoading(btnEl))
          .catch(e => {
            finishLoading(btnEl)
            throw e
          })
      }
      // END: loading state handlers

      // Bind individual params to directive
      directive.listeners[id] = {
        el,
        eventType: options.action
      }

      // Setup button element if directive defined on form element
      if (options.action === 'submit') {
        btnEl = el.querySelector('[type="submit"]')
        if (!btnEl) throw new Error('No submit button found')
      }

      // Setup option to show/hide spinner
      if (options.showSpinner) {
        const vueSpinnerOptions = initSpinner(btnEl, options, vnode, isLoaderString)
        spinnerVM = new Vue(vueSpinnerOptions)
      }

      // Finish initialization for Extended Mode (if we want use external promise from model)
      if (options.hasOwnProperty('promise')) {
        directive.listeners[id].promiseHanlder = promiseHanlder
        return
      }

      const isComponent = !!vnode.componentInstance
      if (isComponent) {
        // Continue initialization for component usage mode
        // Extract vue component event
        const componentEventHandler = vnode.componentInstance.$listeners && vnode.componentInstance.$listeners[options.action]
        if (!componentEventHandler) throw new Error('Please, provide proper handler/action for promise-btn')
        // Save nativeEventHandler in directive instance
        directive.listeners[id].eventHandler = componentEventHandler
        // Remove vue component event listener
        vnode.componentInstance.$off(options.action)
      } else {
        // Continue initialization for simplified usage mode
        // Extract default event listener internally generated by Vue
        // _withTask - legacy method for Vue < 2.6, _wrapper - for Vue >= 2.6
        const nativeEventHandler = vnode.data.on &&
            vnode.data.on[options.action] &&
            (vnode.data.on[options.action]._withTask || vnode.data.on[options.action]._wrapper)
        if (!nativeEventHandler) throw new Error('Please, provide proper handler/action for promise-btn')
        // Save nativeEventHandler in directive instance
        directive.listeners[id].eventHandler = nativeEventHandler
        // Remove native event listener
        el.removeEventListener(options.action, nativeEventHandler)
      }

      // Set custom event that will replace original listener
      directive.listener = function (e) {
        const { eventHandler } = directive.listeners[id]
        if (options.disableBtn && scheduled) return
        const expression = eventHandler(e)
        const handlerPromise = typeof expression === 'function' ? getFiniteHandler(expression) : expression
        if (isPromise(handlerPromise)) {
          return promiseHanlder(btnEl, handlerPromise)
        }
      }
    },
    bind (el, binding, vnode) {
      // Init
      binding.def.init(...arguments)

      // Replace native event listener
      const isComponent = !!vnode.componentInstance
      const id = el[pluginElPropName]
      const { eventType, promiseHanlder } = directive.listeners[id]
      if (!promiseHanlder) {
        if (isComponent) {
          // Add event handler for component mode
          vnode.componentInstance.$on(eventType, directive.listener)
        } else {
          // Add event handler for simplified mode
          el.addEventListener(eventType, directive.listener)
        }
      }
    },
    unbind (el, binding, vnode) {
      const isComponent = !!vnode.componentInstance
      // Cleanups if element removed to prevent memory leaks
      const id = el[pluginElPropName]
      const { eventType } = directive.listeners[id]
      if (isComponent) {
        vnode.componentInstance.$off(eventType, directive.listener)
      } else {
        el.removeEventListener(eventType, directive.listener)
      }
      delete directive.listeners[id]
      delete el[pluginElPropName]
    },
    componentUpdated (el, binding, vnode, oldVnode) {
      // Extended Mode trigger
      if (binding && binding.value &&
          binding.value.promise &&
          binding.value.promise !== binding.oldValue.promise
      ) {
        const id = el[pluginElPropName]
        const { promiseHanlder } = directive.listeners[id]
        promiseHanlder(el, binding.value.promise)
      }
    }
  }
  return directive
}

export default setupVuePromiseBtn
