import fetch from '@/assets/js/axios';

/**
 * lw 友链列表
 */
const devops_list = params => fetch('/blog/manage/devops/devops_list', {params: params, type: 'POST'});
/**
 * lw 添加、修改、删除友链
 * @param id 编号
 * @param title 站点名称
 * @param website 友链地址
 * @param sta 删除1:删除 0:正常
 */
const operation_devops = data => fetch('/blog/manage/devops/operation_devops', {data: data, type: 'POST'});
/**
 * lw 部署
 * @param name 名称
 * @param branch 分支
 * @param env 环境
 */
const build_devops = data => fetch('/blog/manage/devops/build_devops', {data: data, type: 'POST'});

export {
  devops_list,
  operation_devops,
  build_devops,
}
