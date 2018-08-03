import Vue from "vue";
import axios from "axios";
import Qs from "qs";
import { Loading } from "element-ui";
const url = 'https://apidev.wekouling.com'
window.url = url;
let loading;
let ajax = function (option) {
  let { url, method, headers = null, data } = option;
  let config = {
    url,
    method
  };
  if (headers) {
    Object.assign(config, { headers });
  }
  if (method.toLowerCase() === "get") {
    Object.assign(config, { params: data })
  } else if (method.toLowerCase() === "post") {
    Object.assign(config, { data });
    // config.data = Qs.stringify(config.data);
  }
  let promise = axios(config);
  // promise.then(function () {
  //   loading.close()
  // }, function () {
  //   loading.close()
  // })
  return promise;
};
window.initAjax = initAjax;
let initAjax = method => {
  return ({ api, data, isLoading = true }, baseUrl) => {
    let innerUrl;
    let headers = localStorage.getItem("auth_token") ? { auth_token: localStorage.getItem("auth_token") } : null;
    if (baseUrl !== undefined) {
      innerUrl = baseUrl;
    } else {
      innerUrl = url;
    }
    // if (isLoading) {
    //   loading = Loading.service({
    //     lock: true,
    //     text: "Loading",
    //     spinner: "el-icon-loading",
    //     background: "rgba(0, 0, 0, 0.7)"
    //   });
    // }
    return ajax({
      url: innerUrl + api,
      method,
      headers,
      data
    });
  };
};
export default initAjax;
