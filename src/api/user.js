import fetch from '@/assets/js/axios';

/**
 * lw 修改资料
 * @param id 作者编号
 * @param name 昵称
 * @param rpassword 密码
 * @param mail 邮箱
 * @param website 站点
 * @param head_img 头像
 */
const edit_user = data => fetch('/blog/manage/user/edit_user', {data: data, type: 'POST'});

export {
  edit_user,
}