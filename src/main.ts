import Vue from 'vue'
import Ionic from '@ionic/vue' // 0.0.4
//import { IonicVue } from '@ionic/vue' // 5.9.1
//import * as IonComponents from '@ionic/vue' //>=0.0.9
import App from './App.vue'
import router from './router'
import store from './store'
import './filters'
import '@ionic/core/css/core.css'
import '@ionic/core/css/ionic.bundle.css'
Vue.config.productionTip = false

Vue.use(Ionic)
//>=0.0.9
// Object.keys(IonComponents).forEach(key => {
//     if (/^Ion[A-Z]\w+$/.test(key)) {
//         Vue.component(key, IonComponents[key])
//     }
// })

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
