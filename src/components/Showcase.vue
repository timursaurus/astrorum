<template>
  <main class="md:px-10 px-2 bg-black text-gray-100">
    <article class="min-h-screen" v-for="showcase in showcases" :key="showcase.url">
      <header class="py-5">
        <h1 class="font-serif text-4xl">{{ showcase.title }}</h1>
        <h2 class="text-xl text-gray-200">Astronomy Picture of the Day</h2>
        <time class="text-gray-300"> {{ showcase.date }} </time>
        <p class="text-gray-300" v-if="showcase.copyright">&copy; {{ showcase.copyright }}</p>
      </header>
      <div class="md:flex text-xl text-gray-300">
        <div v-if="showcase.media_type === 'image'" class="min-w-1/2 md:pr-5 mb-5">
          <img class="min-w-full" v-show="!settings.HD" :src="showcase.url" :alt="showcase.title" />
          <img class="min-w-full" v-if="settings.HD" :src="showcase.hdurl" :alt="showcase.title" />
        </div>
        <iframe v-else class="pr-5 mb-5 min-w-1/2" :src="showcase.url" frameborder="0" allowfullscreen allow="encrypted-media"></iframe>
        <div>
          <p class="font-light">{{ showcase.explanation }}</p>
          <div class="py-5 flex all:mr-2">
            <a v-if="!settings.HD" :href="showcase.url" title="Image source" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
            <a v-else :href="showcase.hdurl" title="Image source" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
            <button @click="randomAPOD" title="Random picture of the day">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
            <button @click="settings.HD = !settings.HD" title="Change image quality" :class="{ ' text-yellow-400': settings.HD }">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            </button>
          </div>
          <hr />
          <footer class="py-2 font-light all:py-1">
            <p>Made with <span class="italic">love & care</span> by <a class="hover:underline" href="https://github.com/timursaurus">Timur Bolotov</a></p>
            <p>Powered by <a class="hover:underline" href="https://api.nasa.gov/">NASA API</a></p>
          </footer>
        </div>
      </div>
    </article>
  </main>
</template>

<script>
import { HTTP, apiKey } from '../api.js'

export default {
  name: 'Showcase',
  data() {
    return {
      showcases: [
        // title: null,
        // date: null,
        // explanation: null,
        // hdurl: null,
        // url: null,
        // media_type: null,
        // copyright: 'timursaurus',
      ],
      settings: {
        HD: false,
        date: null,
      },
    }
  },
  mounted() {
    this.loadAPOD()
  },
  methods: {
    async loadAPOD() {
      const today = new Date().toISOString().slice(0, 10)
      const res = await HTTP.get(`planetary/apod?start_date=${today}&end_date=${today}&api_key=${apiKey}`)
      this.showcases = res.data
      // console.log(res)
    },
    async randomAPOD() {
      const res = await HTTP.get(`planetary/apod?count=1&api_key=${apiKey}`)
      this.showcases = res.data
      // console.log(res)
    },
  },
}
</script>

<style>
</style>