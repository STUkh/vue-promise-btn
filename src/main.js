import Spinner from './components/Spinner.vue'
import { setupVuePromiseBtn, stringHTMLRenderer, componentRenderer } from './directives/vue-promise-btn.directive'

const defaultOptions = {
  btnLoadingClass: 'loading',
  showSpinner: true,
  action: 'click',
  disableBtn: true,
  stringHTMLRenderer: stringHTMLRenderer,
  componentRenderer: componentRenderer,
  minTimeout: 400,
  spinnerHiddenClass: 'hidden',
  autoHideSpinnerWrapper: false,
  loader: Spinner
}

function install (Vue, options) {
  const globalOptions = {...defaultOptions, ...options}
  Vue.directive('promise-btn', setupVuePromiseBtn(globalOptions))
}

export default {
  install,
  Spinner,
  setupVuePromiseBtn
}
