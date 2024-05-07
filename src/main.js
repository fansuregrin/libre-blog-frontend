import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import naive from 'naive-ui'
import router from './router'

const i18n = createI18n();
const app = createApp(App);

app.use(router)
app.use(naive)
app.use(i18n)
app.mount('#app')
