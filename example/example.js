/* eslint-disable */
document.addEventListener('DOMContentLoaded', function(){
    Vue.use(VuePromiseBtn)
    Vue.use(bootstrapVue)

    const CustomSpinner = Vue.component('custom-spinner', {
        template: '<span>...</span>'
    })

    Vue.component('custom-form', {
        template: `<form @submit.prevent="$emit('submit', 'data')">
            <p>
                <button type="submit">Button Form Submit - Handle Component Event</button>
            </p>
        </form>`
    })

    new Vue({
        el: '#app',
        data: {
            currentChain: 0,
            currentYear: new Date().getFullYear(),
            promiseBtnOptions: {
                customComponentLoader: { loader: CustomSpinner },
                customHTMLLoader: { loader: '<b>(HTML loader...)</b>' },
            },
            dataPromise: null,
            bootstrapBtnPromise: null,
        },
        methods: {
            incrementChain () {
                return this.currentChain++
            },
            dummyAsyncAction () {
                return new Promise((resolve, reject) => setTimeout(resolve, 2000))
            },
            asyncActionWithArgs ($event, param) {
                return () => {
                    // double return to show that expression to promise can be
                    return () => {
                        return this.dummyAsyncAction()
                    }
                }
            },
            asyncWithPromiseInData (param) {
                console.log(param);
                this.dataPromise = this.dummyAsyncAction()
            },
            vueBootstrap (param) {
                console.log(param);
                this.bootstrapBtnPromise = this.dummyAsyncAction()
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
        }
    })

});