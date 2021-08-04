<template>
  <header class='slider bg-dark-800 py-5 px-10 ' >
    <h1 class='text-white text-4xl' >Astrorum</h1>
    <div>
      <input type="range" :min='settings.start' :max='settings.end' v-model='sliderStart' step=1 >
      <input type="range" :min='settings.start' :max='settings.end' v-model='sliderEnd'  step=1 >
    </div>
  </header>

</template>

<script>
export default {
  name: 'Search',
  data() {
    return {
      slider: {
        start_date: 1995, // Jun 16, 1995
        end_date: 2021, // the year of development
      },
      settings: {
        start: 1995,
        end: 2021, 
      }
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
      }
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
      }
    }
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
    }
  }
}
</script>

<style>

.slider {
  margin: auto;
  text-align: center;
  position: relative;
  
}

.slider input[type=range] {
  position: absolute;
  
}

input[type=range]::-webkit-slider-thumb {
  z-index: 2;
}
input[type=range]:focus {
  outline: none;
}

input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 3px;
  cursor: pointer;
  background: #fff;
  border-radius: 1px;
  box-shadow: none;
  border: 0;
}



</style>