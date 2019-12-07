import fetch from '@/assets/js/axios';

/**
 * lw 生成数字字母验证码
 * @param size
 * @param w
 * @param h
 */
const code = params => fetch('/blog/manage/verification/code', {params: params, type: 'GET'});

/**
 * 获取gt验证
 * @param params
 * @returns {Promise<unknown>}
 */
const gtCode = params => fetch('/blog/manage/verification/gtCode', {params: params, type: 'GET'});

export {
  code,
  gtCode,
}
