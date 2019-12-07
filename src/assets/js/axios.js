import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {Message} from 'element-ui'

// axios 超时
axios.defaults.timeout = 8000;

// 异常处理
const error = (dat = {}) => {
  switch (parseInt(dat.code)) {
    case 400:
      Message.error(dat.message);
      break;
    case 401:
      window.location.href = '/';
      Message.error(dat.message);
      break;
    case 403:
      Message.error(dat.message);
      break;
    case 404:
      Message.error(dat.message);
      break;
    case 500:
      Message.error(dat.message);
      break;
    case 503:
      Message.error(dat.message);
      break;
    default:
      Message.error(dat.message || '网络异常');
      break;
  }
};

// 请求拦截器
axios.interceptors.request.use(function (req) {
  NProgress.start();
  NProgress.set(0.5);
  NProgress.inc();
  return req;
}, function (error) {
  console.log(error);
  return Promise.reject(error);
});

// 响应拦截器
axios.interceptors.response.use(function (res) {
  NProgress.done();
  // 请求返回状态码0～200为请求正常，200为业务正常，0～199其他为普通业务异常（需将异常返回到页面）
  if (res.data.code >= 0 && res.data.code <= 200) {
    return res;
  } else {
    // -1为严重业务异常（可不返回到页面，直接终止），200+为请求异常
    error(res.data);
    return {};
  }
}, function (e) {
  NProgress.done();
  error(e.response ? e.response.data : '');
  return Promise.reject(e);
});

// 封装请求
export default (url, options) => {
  let opt = options || {};
  opt.token = sessionStorage.getItem("token") || '';
  let headers = opt.headers || {'Content-Type': 'application/json'};
  return new Promise((resolve, reject) => {
    axios({
      method: opt.type || 'GET',
      url: url,
      baseURL: opt.baseURL || URL[opt.otherURL] || URL.baseURL,
      params: opt.params || {},
      // 判断是否有自定义头部，以对参数进行序列化。不定义头部，默认对参数序列化为查询字符串。
      data: opt.data || {},
      responseType: opt.dataType || 'json',
      withCredentials: opt.withCredentials || false,
      // 设置默认请求头
      headers: {...headers, 'Authorization': opt.token}
    }).then(res => {
      resolve(res.data || {})
    }).catch(error => {
      reject(error)
    })
  })
}
