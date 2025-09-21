import { createApp } from 'vue'

import './style.css'
import vuetify from "./vuetify.js";
import App from './App.vue'
import { router } from "./router.js";

createApp(App).use(router).use(vuetify).mount('#app')
