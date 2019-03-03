import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import $ from 'jquery';
import { Message } from 'element-ui';

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

get.interceptors.response.use(
  response => {
    let data = response.data;
    if (data.code !== 1) {
      Message({
        type: "error",
        message: data.description
      });
    }
    return data;
  },
  error => error
);

post.interceptors.response.use(
  response => {
    let data = response.data;
    if (data.code !== 1) {
      Message({
        type: "error",
        message: data.description
      });
    }
    return data;
  },
  error => error
);

let syncAjax = opts => {
  var result;
  $.ajax({
    url: '/novice' + opts.url,
    type: opts.method || 'get',
    async: false,
    data: opts.method === 'post' ? JSON.stringify(opts.data) : opts.data,
    contentType: opts.method === 'post' ? 'application/json' : 'application/x-www-form-urlencoded',
    dataType: 'json',
    complete: function (data) {
      result = data.responseJSON;
      if (result.code !== 1) {
        Message({
          type: "error",
          message: result.description
        });
      }
    },
  });
  return result;
}

export default {
  get, post, syncAjax
}
