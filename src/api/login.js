import fetch from '@/assets/js/axios';

/**
 * lw 验证信息
 * @param Authorization token
 */
const info = params => fetch('/blog/manage/login/info', {params: params, type: 'GET'});
/**
 * lw 登录
 * @param user 账号
 * @param password 密码
 * @param code 验证码
 */
const login = data => fetch('/blog/manage/login/login', {data: data, type: 'POST'});
/**
 * Gt 登陆
 * @param data
 * @returns {Promise<unknown>}
 */
const gt_login = data => fetch('/blog/manage/login/gt_login', {data: data, type: 'POST'});
/**
 * lw 注册
 * @param name 昵称
 * @param user 账号
 * @param rpassword 密码
 * @param code 验证码
 */
const register = data => fetch('/blog/manage/login/register', {data: data, type: 'POST'});

export {
  info,
  login,
  gt_login,
  register,
}
