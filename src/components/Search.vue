<template>
  <header class="bg-dark-800 py-5 md:px-10 px-2">
    <div class="md:flex md:justify-between self-center">
      <h1 class="text-white text-4xl max-w-10">Astrorum</h1>
      <div class="relative text-gray-500 py-2">
        <svg v-if='!query' xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 absolute cursor-pointer mx-2 mt-1 right-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <svg v-else @click='clearRes()' xmlns="http://www.w3.org/2000/svg" class="h-6 w-6  absolute cursor-pointer mx-2 mt-1 right-0 " fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        <input v-model="query" @change="search" @focus="search" @blur="search" @click="search" @submit="search" class="rounded-md max-w-screen-sm <md:min-w-full lg:w-120 text-gray-100 text-lg py-1 px-2 bg-dark-100 placeholder-gray-500" type="text" placeholder="Explore the space" />
      </div>
      <div class="<sm:hidden min-w-10 text-gray-100">
        
      </div>
    </div>
    <div class="slider md:py-5 md:mx-10 py-2">
      <!-- <div class='flex text-gray-100 max-w-full ' >  
          <p v-for="(year) in (settings.end - settings.start)" :key=year >{{ year }}</p>     
      </div> -->
      <div class="flex justify-between text-gray-500">
        <p>{{ settings.start }}</p>
        <div class='flex text-gray-300 ' >
          <p> {{ slider.start_date }} </p>
          <p class='px-1' > &mdash; </p>
          <p> {{ slider.end_date }} </p>
        </div>
        <p>{{ settings.end }}</p>
      </div >
      <div class='relative' >
        <input type="range" class='tip' :min="settings.start" :max="settings.end" v-model="sliderStart" step="1" @blur="search" />
        <input type="range" class='tip' :min="settings.start" :max="settings.end" v-model="sliderEnd" step="1" @blur="search" />
      </div>
    
    </div>
  </header>
  <main class="md:px-10 px-2 bg-black text-gray-100">
    <div class='py-2 sm:flex justify-between ' >
      <p v-if="query.length >= 1 && !checkDate()"  >{{ results.meta }} findings for "{{ query }}" between {{ slider.start_date }} and {{ slider.end_date }}</p>
      <div v-if='results.meta > 100' class='flex <sm:my-2 ' >
        <button :disabled='settings.page === 1' @click="settings.page -= 1;search()" ><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg></button>
        <p class='mx-2' >{{ settings.page }} </p>
        <button :disabled='settings.page === settings.maxPage' @click='settings.page += 1;search()' ><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></button>
      </div>
    </div>
    <div class='' v-for="(res, index) in results.items" :key="index">
      <div class="py-5 ">
        <header class="text-gray-300">
          <h3 class="font-serif text-xl text-gray-100">{{ res.data[0].title }}</h3>
          <h4>
            {{ res.data[0].center }} <span v-if="res.data[0].secondary_creator" class=""> &mdash; {{ res.data[0].secondary_creator }} </span>
          </h4>

          <time class=""> {{ res.data[0].date_created.slice(0, 10) }} </time>
        </header>
        <div class='lg:flex' >
        
          <div class="relative lg:mr-5 ">
            <img :src="res.links[0].href" :alt="res.data[0].title" class=" md:min-w-100 lg:max-w-100 xl:max-w-200 " />
            <h5 class="text-gray-600" v-if="res.data[0].photographer">Photo by {{ res.data[0].photographer }}</h5>
            <!-- <a v-if='res.data[0].nasa_id' class='absolute right-0 p-2' target='_blank' :href="`http://images-assets.nasa.gov/image/${res.data[0].nasa_id}/${res.data[0].nasa_id}~orig.jpg`" title='See in original resolution' > <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg> </a> -->
          </div>
          <p v-if="res.data[0].description !== res.data[0].title" class="text-gray-300 my-2 sm:text-lg font-light">{{ res.data[0].description }}</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { SEARCH } from '../api.js'
import { mapMutations } from 'vuex'

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
        page: 1,
        maxPage: 1,
        prevQuery: ''
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

    ...mapMutations(['changeApod']),

    UpToDate() {
      const today = new Date().getFullYear()
      // console.log(today)
      this.settings.end = today
      this.slider.end_date = today
    },
    clearRes() {
      this.query = ''
      this.results.items = []
      this.results.links = []
      this.results.meta = 0
      this.settings.page = 1
      this.settings.maxPage = 1

    },

    checkDate() {
      if(Date.parse(this.query) && this.query.length >= 7) {

        let past = new Date('1995-06-16')
        let date = new Date(this.query) 
        let today = new Date()

        if ( today > date && date > past ) {
          return true
        }
      }
    },
    
    async search() {
      // console.log('SEARCH', this.query.length)
      if (this.checkDate()) {
        let date = new Date(this.query).toISOString().substr(0,10)
      
        this.changeApod(date)
        
      } 

      else if (this.query.length >= 1) {
        const res = await SEARCH.get(`/search?q=${this.query}&page=${this.settings.page}&media_type=image&year_start=${this.slider.start_date}&year_end=${this.slider.end_date}`)

        if (this.query !== this.settings.prevQuery) {
          this.settings.page = 1
        }

        this.results.items = res.data.collection.items
        this.results.links = res.data.collection.links
        this.results.meta = res.data.collection.metadata.total_hits

        this.settings.maxPage = Math.ceil(this.results.meta/100)
        this.settings.prevQuery = this.query


      } else if (this.query.length <= 1) {
        this.clearRes()
      }
      // console.log(this.results.items)

      // console.log(res)
    },
  },
}
</script>

<style>
.slider {
  text-align: center;
  position: relative;
}

.slider input[type='range'] {
  position: absolute;
  left: 0;
  width: 100%;
  
}

.slider input[type='range']::-webkit-slider-thumb {
  z-index: 2;
  margin-top: -6px;
  
  
}

.slider input[type='range']:focus {
  outline: none;
}

.slider input[type='range']::-webkit-slider-runnable-track {
  width: 100%;
  border-radius: 20px;
  height: 5px;
  cursor: pointer;
  box-shadow: none;
  border: none;
}


</style>