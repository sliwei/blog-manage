<template>
  <div>
    <div slot="header" class="clearfix">
      <span>分类列表</span>
      <el-button style="float: right" icon="el-icon-plus" circle size="mini" type="primary" plain
                 @click="add"></el-button>
    </div>
    <div>
      <el-table
          :data="categoryList"
          style="width: 100%">
        <el-table-column
            type="index"
            width="50">
        </el-table-column>
        <el-table-column
            prop="name"
            label="分类名称">
        </el-table-column>
        <el-table-column
            prop="address"
            label="操作"
            width="150">
          <template slot-scope="scope">
            <span>
              <el-button size="mini" type="primary" @click="edit(scope.row)">修改</el-button>
            </span>
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

    <el-dialog
        :title="category.id ? '编辑分类' : '添加分类'"
        :visible.sync="categorySta"
        width="30%">
      <div class="category_dig">
        <el-form :model="category" status-icon :rules="rules" ref="category" label-width="60px" class="demo-ruleForm">
          <el-form-item label="名称" prop="title">
            <el-input v-model="category.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 30px">
            <el-button type="primary" :loading="wait" @click="saveCategory()">保 存</el-button>
            <el-button @click="categorySta = false">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {category_list, operation_category} from '@/api/category'

  export default {
    data() {
      return {
        category: {}, // 修改分类时存的对象
        rules: { // 分类校验
          name: [{required: true, message: '请输入名称', trigger: 'blur'},],
        },
        categorySta: false, // 操作分类弹窗
        wait: false, // 分类保存时保存按钮的Loading
        categoryList: [],  // 分类列表
      }
    },
    created() {
      this.getCategoryList();
    },
    methods: {

      // 获取分类列表
      getCategoryList() {
        category_list().then(res => {
          if (res.code === 200) {
            this.categoryList = res.data;
          } else {
            this.$message.error(res.message);
          }
        })
      },

      // 删除分类
      del(id) {
        let dat = {
          id: id,
          sta: 1,
        };
        operation_category(dat).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功');
            this.$refs[id].doClose();
            this.getCategoryList();
          } else {
            this.$message.error(res.message);
          }
        })
      },

      // 添加
      add() {
        this.category = {};
        this.categorySta = true;
      },

      // 打开修改分类
      edit(dat) {
        this.category = JSON.parse(JSON.stringify(dat));
        this.categorySta = true;
      },

      // 保存、修改分类
      saveCategory() {
        this.$refs.category.validate((valid) => {
          if (valid) {
            this.wait = true;
            let dat = {
              id: this.category.id,
              name: this.category.name,
            };
            operation_category(dat).then(res => {
              this.categorySta = false;
              this.wait = false;
              if (res.code === 200) {
                this.$message.success('保存成功');
                this.getCategoryList();
              } else {
                this.$message.error(res.message);
              }
            }).catch(() => {
              this.wait = false;
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>

<style lang="less" scoped>
  .category_dig {
    padding: 10px 40px 0;
  }
</style>
