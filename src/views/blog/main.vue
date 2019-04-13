<template>
  <div class="blog">

    <div class="param">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="关键字">
          <el-input placeholder="关键字" v-model="param.keyword"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-select placeholder="选择分类" v-model="param.category_id">
            <el-option label="全部分类" value=""></el-option>
            <el-option :label="item.name" :value="item.id" v-for="(item, i) in categoryList" :key="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">查询</el-button>
          <el-button @click="res">重置</el-button>
        </el-form-item>

        <router-link style="float: right" to="/admin/blog/edit">
          <el-button icon="el-icon-plus" type="primary" plain>发表</el-button>
        </router-link>
      </el-form>
    </div>

    <div class="list">

      <el-table
          :data="list"
          border
          style="width: 100%">
        <el-table-column
            label="#"
            align="center"
            width="50">
          <template slot-scope="scope">
            {{showIndex(scope.$index)}}
          </template>
        </el-table-column>
        <el-table-column
            prop="name"
            label="首图"
            width="80">
          <template slot-scope="scope">
            <img class="list_img" :src="scope.row.img" alt="">
          </template>
        </el-table-column>
        <el-table-column
            prop="title"
            label="标题">
        </el-table-column>
        <el-table-column
            prop="tag_name"
            label="分类"
            align="center"
            width="80">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.category_name" size="small">{{scope.row.category_name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="user_name"
            label="作者"
            align="center"
            width="80">
        </el-table-column>
        <el-table-column
            prop="time"
            label="创建时间"
            align="center"
            width="160">
          <template slot-scope="scope">
            {{$Tool.formatDate(scope.row.time, 'YY年MM月DD日hh点mm')}}
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            prop="is_draft"
            label="设为草稿"
            width="80">
          <template slot-scope="scope">
            <el-switch
                @change="e => setDraft(scope.row.id, e)"
                v-model="scope.row.is_draft">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="操作"
            width="210">
          <template slot-scope="scope">
            <a target="_blank" :href="`https://bstu.cn/detail/${scope.row.code}`">
              <el-button size="mini">查看</el-button>
            </a>
            <router-link :to="`/admin/blog/edit?id=${scope.row.id}`">
              <el-button type="primary" size="mini">编辑</el-button>
            </router-link>
            <el-popover
                :ref="scope.row.id"
                placement="top"
                width="160">
              <p>确定删除吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                <el-button type="primary" size="mini" @click="del(scope.row.id)">确定</el-button>
              </div>
              <el-button type="danger" slot="reference" size="mini">删除</el-button>
            </el-popover>
          </template>
        </el-table-column>

      </el-table>

    </div>

    <div class="page">
      <el-pagination
          background
          @size-change="pageSizeFun"
          @current-change="pageIndexFun"
          :current-page="param.pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="param.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import {category_list} from '@/api/category'
  import {server_list, blog_status} from '@/api/blog'

  export default {
    data() {
      return {
        delSta: false,
        param: {
          pageIndex: 1,
          pageSize: 10,
          keyword: '',
          category_id: '',
        },
        total: 0,
        list: [],
        categoryList: [], // 分类列表
      }
    },
    created() {
      this.getList();
      this.getCategoryList();
    },
    methods: {
      // 获取分类
      getCategoryList() {
        category_list().then(res => {
          if (res.code === 200) {
            this.categoryList = res.data;
          } else {
            this.$message.error(res.message);
          }
        })
      },
      // 每页条数改变
      pageSizeFun(val) {
        this.param.pageSize = val;
        this.param.pageIndex = 1;
        this.getList();
      },
      // 分页改变
      pageIndexFun(val) {
        this.param.pageIndex = val;
        this.getList();
      },
      // 重置
      res() {
        this.param = {
          ...this.param,
          keyword: '',
          category_id: '',
        };
      },
      // 序号
      showIndex(index) {
        return index + (this.param.pageIndex - 1) * this.param.pageSize + 1;
      },
      // 获取数据
      getList() {
        server_list(this.param).then(res => {
          console.log(res);
          if (res.code === 200) {
            this.list = [];
            res.data.list.map(item => {
              this.list.push({
                ...item,
                is_draft: item.is_draft ? true : false
              })
            });
            console.log(this.list);
            this.total = res.data.total;
          } else {
            this.$message.error(res.message);
          }
        })
      },
      // 删除
      del(id) {
        let dat = {id: id, sta: 1};
        blog_status(dat).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功');
            this.$refs[id].doClose();
            this.getList();
          } else {
            this.$message.error(res.message);
          }
        });
      },
      // 设为草稿
      setDraft(id, e) {
        let dat = {id: id, draft: e ? 1 : 0};
        blog_status(dat).then(res => {
          if (res.code === 200) {
            this.$message.success('设置成功');
            this.$refs[id].doClose();
          } else {
            this.$message.error(res.message);
          }
        });
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/less/theme.less";

  .blog {
    .param {
      border-bottom: 1px solid #f1f1f1;
    }

    .list {
      margin-top: 22px;
    }

    .page {
      text-align: right;
      margin-top: 22px;
    }

    .list_img {
      width: 60px;
      height: 40px;
    }
  }
</style>
