import { createApp } from 'vue'
import App from './App.vue'
import { createStore } from 'vuex'
import 'virtual:windi.css'

const store = createStore({
    state() {
        return {
            apodDate: 'timursaurus'
        }
    },
    mutations: {
        changeApod(state, payload) {
            state.apodDate = payload
        }
    },
    getters: {
        apod(state) {
            return state.apodDate
        }
    }
})

const app = createApp(App)

app.use(store)
app.mount('#app')
