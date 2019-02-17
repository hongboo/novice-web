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

let syncGet = opts => {
  var result;
  $.ajax({
    url: '/novice' + opts.url,
    type: 'get',
    async: false,
    data: opts.params,
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
  get, post, syncGet
}
