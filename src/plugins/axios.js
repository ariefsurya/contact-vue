// src/plugins/axios.js
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'X-API-KEY': 'Key',
  }
})

export default axiosInstance
