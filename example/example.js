Vue.use(VuePromiseBtn)

const CustomSpinner = Vue.component('custom-spinner', {
  template: '<span>...</span>'
})

new Vue({
  el: '#app',
  data: {
    currentChain: 0,
    currentYear: new Date().getFullYear(),
    promiseBtnOptions: {
      customComponentLoader: { loader: CustomSpinner },
      customHTMLLoader: { loader: '<b>(HTML loader...)</b>' },
    }
  },
  methods: {
    incrementChain () {
      return this.currentChain++
    },
    dummyAsyncAction () {
      return new Promise((res, rej) => setTimeout(res, 2000))
    },
    chain () {
      this.currentChain = 1
      return this.dummyAsyncAction()
        .then(this.incrementChain)
        .then(this.dummyAsyncAction)
        .then(this.incrementChain)
        .then(this.dummyAsyncAction)
        .then(() => { this.currentChain = 0 })
    }
  },
})