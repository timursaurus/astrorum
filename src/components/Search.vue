<template>
  <header class="slider bg-dark-800 py-5 px-10">
    <div class="flex">
      <h1 class="text-white text-4xl">Astrorum</h1>
      <div class="relative text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 absolute p-1 m-1 right-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input v-model="query" @change="search" @blur='search' @submit="search" class="rounded-md text-gray-100 py-1 px-2 bg-dark-100 placeholder-gray-500" type="text" placeholder="Explore the space" />
      </div>
    </div>
    <div>
      <input type="range" :min="settings.start" :max="settings.end" v-model="sliderStart" step="1" @blur='search'  />
      <input type="range" :min="settings.start" :max="settings.end" v-model="sliderEnd" step="1" @blur='search' />
    </div>
    <div>
      <button></button>
    </div>
  </header>
  <main class="px-10 bg-black text-gray-100">
    <h1>Res</h1>
    <p v-if='results.meta' > {{ results.meta }} findings for "{{ query }}" between {{ slider.start_date }} and {{ slider.end_date }}  </p>
    <div v-for="(res, index) in results.items" :key="index">
      <div class="py-5">
        <header class='text-gray-300' >
          <h3 class='font-serif text-xl text-gray-100 ' >{{ res.data[0].title }}</h3>
          <h4> {{ res.data[0].center }} <span v-if='res.data[0].secondary_creator' class='' > &mdash; {{ res.data[0].secondary_creator }} </span> </h4>
          
          <time class='' > {{ res.data[0].date_created.slice(0, 10).toString() }} </time>
        </header>
        <div class='relative' >
          <img :src="res.links[0].href" :alt="res.data[0].title" class='py-2' />
          <h5 class='text-gray-600' v-if='res.data[0].photographer' >Photo by {{ res.data[0].photographer }} </h5>
          <!-- <a v-if='res.data[0].nasa_id' class='absolute right-0 p-2' target='_blank' :href="`http://images-assets.nasa.gov/image/${res.data[0].nasa_id}/${res.data[0].nasa_id}~orig.jpg`" title='See in original resolution' > <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg> </a> -->
        </div>
        <p v-if="res.data[0].description !== res.data[0].title" class='text-gray-300 my-2 text-lg font-light ' >{{ res.data[0].description }}</p>
      </div>
    </div>
  </main>
</template>

<script>
import { SEARCH } from '../api.js'

export default {
  name: 'Search',
  data() {
    return {
      slider: {
        start_date: 1920,
        end_date: 2021, // the year of development
      },
      settings: {
        start: 1920,
        end: 2021,
      },
      query: '',
      results: {
        items: [],
        links: [],
        meta: 0,
      },
    }
  },
  computed: {
    sliderStart: {
      get() {
        let year = parseInt(this.slider.start_date)
        return year
      },
      set(year) {
        year = parseInt(year)
        if (year > this.slider.end_date) {
          this.slider.end_date = year
        }
        this.slider.start_date = year
        // console.log('start_date', this.slider.start_date)
      },
    },
    sliderEnd: {
      get() {
        let year = parseInt(this.slider.end_date)
        return year
      },
      set(year) {
        year = parseInt(year)
        if (year < this.slider.start_date) {
          this.slider.start_date = year
        }
        this.slider.end_date = year
        // console.log('end_date', this.slider.end_date)
      },
    },
  },
  mounted() {
    this.UpToDate()
  },
  methods: {
    UpToDate() {
      const today = new Date().getFullYear()
      // console.log(today)
      this.settings.end = today
      this.slider.end_date = today
    },
    async search() {
      console.log('SEARCH')
      const res = await SEARCH.get(`/search?q=${this.query}&page=1&media_type=image&year_start=${this.slider.start_date}&year_end=${this.slider.end_date}`)

      this.results.items = res.data.collection.items
      this.results.links = res.data.collection.links
      this.results.meta = res.data.collection.metadata.total_hits
      console.log(this.results.items)

      console.log(res)
    },
  },
}
</script>

<style>
.slider {
  margin: auto;
  text-align: center;
  position: relative;
}

.slider input[type='range'] {
  position: absolute;
}

input[type='range']::-webkit-slider-thumb {
  z-index: 2;
}
input[type='range']:focus {
  outline: none;
}

input[type='range']::-webkit-slider-runnable-track {
  width: 100%;
  height: 3px;
  cursor: pointer;
  background: #fff;
  border-radius: 1px;
  box-shadow: none;
  border: 0;
}
</style>