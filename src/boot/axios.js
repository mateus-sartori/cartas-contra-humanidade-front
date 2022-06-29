import Vue from 'vue'
import axios from 'axios'

// Vue.prototype.$axios = axios

window.axios = require("axios");

window.axios.defaults.headers.common["Content-Type"] = "application/json";



export { axios };
