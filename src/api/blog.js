import fetch from '@/assets/js/axios';

/**
 * lw 博客列表
 * @param pageIndex 页码
 * @param pageSize 每页输
 */
const server_list = params => fetch('/blog/manage/blog/server_list', {params: params, type: 'GET'});
/**
 * lw 添加、修改博客
 * @param id 博客编号 不传则新增
 * @param tag_id 标签编号id
 * @param title 标题
 * @param content html内容
 * @param markdown markdown内容
 * @param is_draft 是否为草稿 1:草稿 0:默认非草稿
 * @param img 首图
 * @param time 自定义发布时间
 * @param is_evaluate 是否关闭评论 1:不允许 0:默认允许评论
 * @param code 不传，自动生成
 */
const edit = data => fetch('/blog/manage/blog/edit', {data: data, type: 'POST'});
/**
 * lw 博客删除、恢复、草稿、发布
 * @param id 博客编号
 * @param sta 博客状态 1删除 0正常
 * @param draft 博客草稿状态 1草稿 0发布
 */
const blog_status = data => fetch('/blog/manage/blog/blog_status', {data: data, type: 'POST'});
/**
 * lw 博客详情
 * @param id 博客编号
 */
const detail = params => fetch('/blog/manage/blog/detail', {params: params, type: 'GET'});

export {
  server_list,
  edit,
  blog_status,
  detail,
}