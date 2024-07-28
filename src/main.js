import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import globalMixin from './plugins/globalMixin';
import '@mdi/font/css/materialdesignicons.css' // import material icons
import 'bootstrap/dist/css/bootstrap.min.css' // Import Bootstrap CSS

import store from './stores';


const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(vuetify)
app.use(store)
app.mixin(globalMixin);

app.mount('#app')

// new Vue({
//     store,
//     render: (h) => h(App),
//   }).$mount('#app');
