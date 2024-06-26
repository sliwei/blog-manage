// 开发
const dev = {
  NODE_ENV: 'development', // 在webpack中它的用途是判断生产环境或开发环境的依据
  url: { // 自定义api前缀(在webpack的插件DefinePlugin中配置为URL,即可在项目中直接URL.baseURL来使用)
    baseURL: '"http://localhost:3004"', // 默认api前缀
    otherURL: '"http://localhost:3002"', // 其他api前缀
    // baseURL: '"https://api.bstu.cn"',
    // otherURL: '"https://api.bstu.cn"',
  }
};

// 测试
const test = {
  NODE_ENV: 'production',
  url: {
    baseURL: '"http://localhost:3004"',
    otherURL: '"http://localhost:3002"',
  }
};

// 预发
const prod = {
  NODE_ENV: 'production',
  url: {
    baseURL: '"http://localhost:3004"',
    otherURL: '"http://localhost:3002"',
  }
};

// 线上
const live = {
  NODE_ENV: 'production',
  url: {
    baseURL: '"https://api.bstu.cn"',
    otherURL: '"https://api.bstu.cn"',
  }
};

module.exports = {
  dev,
  test,
  prod,
  live
};
