import axios from 'axios'

const key = process.env.API_KEY

let request = {
    baseURL: 'https://api.nasa.gov/'
}

export const HTTP = axios.create(request)

export const apiKey = key