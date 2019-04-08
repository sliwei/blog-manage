import fetch from '@/assets/js/axios';

/**
 * lw 分类列表
 */
const category_list = params => fetch('/blog/manage/category/category_list', {params: params, type: 'GET'});
/**
 * lw 添加、修改、删除分类
 * @param id 编号
 * @param name 名称
 * @param sta 删除1:删除 0:正常
 */
const operation_category = data => fetch('/blog/manage/category/operation_category', {data: data, type: 'POST'});

export {
  category_list,
  operation_category,
}