import fetch from '@/assets/js/axios';

/**
 * lw 评论、留言
 * @param name 昵称
 * @param website 站点
 * @param mail 邮箱
 * @param b_id 博客编号
 * @param f_id 回复者编号
 * @param cont 内容
 */
const evaluate = data => fetch('/blog/manage/comment/evaluate', {data: data, type: 'POST'});
/**
 * lw 评论、留言列表
 * @param pageIndex 页码
 * @param pageSize 每页输
 */
const comment_list = params => fetch('/blog/manage/comment/comment_list', {params: params, type: 'GET'});
/**
 * lw 评论列表
 * @param b_id 博客编号
 */
const evaluate_list = params => fetch('/blog/manage/comment/evaluate_list', {params: params, type: 'GET'});
/**
 * lw 评论审核通过
 * @param id 评论编号
 * @param sta 是否通过审核 0:待审核 1:通过 2:未通过
 */
const evaluate_examine = data => fetch('/blog/manage/comment/evaluate_examine', {data: data, type: 'POST'});
/**
 * lw 评论删除
 * @param id 评论编号
 * @param sta 是否删除 0:正常 1:删除
 */
const evaluate_del = data => fetch('/blog/manage/comment/evaluate_del', {data: data, type: 'POST'});

export {
  evaluate,
  comment_list,
  evaluate_list,
  evaluate_examine,
  evaluate_del,
}