import fetch from '@/assets/js/axios';

/**
 * lw 友链列表
 */
const friend_list = params => fetch('/blog/manage/friend/friend_list', {params: params, type: 'GET'});
/**
 * lw 添加、修改、删除友链
 * @param id 编号
 * @param title 站点名称
 * @param website 友链地址
 * @param sta 删除1:删除 0:正常
 */
const operation_friend = data => fetch('/blog/manage/friend/operation_friend', {data: data, type: 'POST'});

export {
  friend_list,
  operation_friend,
}