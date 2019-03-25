import fetch from '@/assets/js/axios';

/**
 * lw 获取服务器信息
 */
const sys = () => fetch('/blog/manage/admin/sys', {type: 'GET'});

export {
  sys,
}