import fetch from '@/assets/js/axios';

/**
 * lw 标签列表
 */
const tag_list = params => fetch('/blog/manage/tag/tag_list', {params: params, type: 'GET'});
/**
 * lw 添加、修改、删除标签
 * @param id 编号
 * @param name 名称
 * @param sta 删除1:删除 0:正常
 */
const operation_tag = data => fetch('/blog/manage/tag/operation_tag', {data: data, type: 'POST'});

export {
  tag_list,
  operation_tag,
}