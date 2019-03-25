import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {Message} from 'element-ui'

// axios 配置
axios.defaults.timeout = 8000;

// 异常处理
const error = (dat = {}) => {
  switch (parseInt(dat.code)) {
    case 0:
      Message.error(dat.message);
      break;
    case 1:
      Message.error(dat.message);
      break;
    case 200:
      Message.error(dat.message);
      break;
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
  if (res.data.code === 200) {
    return res;
  } else {
    error(res.data);
    return {};
  }
}, function (error) {
  NProgress.done();
  error(error.response.data);
  return Promise.reject(error);
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
      baseURL: opt.baseURL || defUrl,
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
