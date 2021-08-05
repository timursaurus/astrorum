import axios from 'axios'

let request = {
  baseURL: 'https://api.nasa.gov/',
}

export const HTTP = axios.create(request)

export const apiKey = import.meta.env.VITE_API_KEY
