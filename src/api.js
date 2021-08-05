import axios from 'axios'

let request = {
  baseURL: 'https://api.nasa.gov/',
}

let surl = {
    baseURL: 'https://images-api.nasa.gov/',
}

export const HTTP = axios.create(request)

export const SEARCH = axios.create(surl)

export const apiKey = import.meta.env.VITE_API_KEY
