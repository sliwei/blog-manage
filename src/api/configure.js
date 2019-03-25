import fetch from '@/assets/js/axios';

/**
 * lw 获取配置
 */
const get_configure = params => fetch('/blog/manage/configure/get_configure', {params: params, type: 'GET'});
/**
 * lw 修改配置
 * @param c_key 配置项 author：作者
 * @param val 配置项值
 */
const set_configure = data => fetch('/blog/manage/configure/set_configure', {data: data, type: 'POST'});

export {
  get_configure,
  set_configure,
}