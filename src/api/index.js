import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

let get = Vue.axios.create({
  method: 'GET',
  baseURL: '/novice'
})

let post = Vue.axios.create({
  method: 'POST',
  baseURL: '/novice',
  headers: { 'Content-Type': 'application/json' }
})

export default {
  get, post
}
