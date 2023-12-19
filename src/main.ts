
import routes from "pages-generated"
import 'virtual:windi.css'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

import './main.css'
const app = createApp(App)


let router = createRouter({
    history: createWebHistory(),
    routes,
})


app.use(router)

app.mount('#app')
