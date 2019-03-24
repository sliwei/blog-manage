<template>
  <div>
    <div slot="header" class="clearfix">
      <span>标签列表</span>
      <el-button style="float: right" icon="el-icon-plus" circle size="mini" type="primary" plain
                 @click="add"></el-button>
    </div>
    <div>
      <el-table
          :data="tagList"
          style="width: 100%">
        <el-table-column
            type="index"
            width="50">
        </el-table-column>
        <el-table-column
            prop="name"
            label="名称">
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
        :title="tag.id ? '编辑标签' : '添加标签'"
        :visible.sync="tagSta"
        width="30%">
      <div class="tag_dig">
        <el-form :model="tag" status-icon :rules="rules" ref="tag" label-width="60px" class="demo-ruleForm">
          <el-form-item label="名称" prop="title">
            <el-input v-model="tag.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 30px">
            <el-button type="primary" :loading="wait" @click="saveTag()">保 存</el-button>
            <el-button @click="tagSta = false">取 消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        tag: {}, // 修改标签时存的对象
        rules: { // 标签校验
          name: [{required: true, message: '请输入名称', trigger: 'blur'},],
        },
        tagSta: false, // 操作标签弹窗
        wait: false, // 标签保存时保存按钮的Loading
        tagList: [],  // 标签列表
      }
    },
    created() {
      this.getTagList();
    },
    methods: {

      // 获取标签列表
      getTagList() {
        this.$Axios.get('/blog/manage/tag/tag_list').then(res => {
          if (res.code === 200) {
            this.tagList = res.data;
          } else {
            this.$message.error(res.message);
          }
        })
      },

      // 删除标签
      del(id) {
        let dat = {
          id: id,
          sta: 1,
        };
        this.$Axios.post('/yun/blog/operation_tag', dat).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功');
            this.getTagList();
          } else {
            this.$message.error(res.message);
          }
        })
      },

      // 添加
      add() {
        this.tag = {};
        this.tagSta = true;
      },

      // 打开修改标签
      edit(dat) {
        this.tag = JSON.parse(JSON.stringify(dat));
        this.tagSta = true;
      },

      // 保存、修改标签
      saveTag() {
        this.$refs.tag.validate((valid) => {
          if (valid) {
            this.wait = true;
            let dat = {
              id: this.tag.id,
              name: this.tag.name,
            };
            this.$Axios.post('/yun/blog/operation_tag', dat).then(res => {
              this.tagSta = false;
              this.wait = false;
              if (res.code === 200) {
                this.$message.success('保存成功');
                this.getTagList();
              } else {
                this.$message.error(res.message);
              }
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
  .tag_dig {
    padding: 10px 40px 0;
  }
</style>
