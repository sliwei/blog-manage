<template>
  <div>
    <div slot="header" class="clearfix">
      <span>友链列表</span>
      <el-button style="float: right" icon="el-icon-plus" circle size="mini" type="primary" plain
                 @click="add"></el-button>
    </div>
    <div>

      <el-table
          :data="friendList"
          style="width: 100%">
        <el-table-column
            type="index"
            width="50">
        </el-table-column>
        <el-table-column
            prop="title"
            label="名称">
        </el-table-column>
        <el-table-column
            prop="website"
            label="站点">
        </el-table-column>
        <el-table-column
            prop="address"
            label="操作"
            width="230">
          <template slot-scope="scope">
            <a target="_blank" :href="scope.row.website">
              <el-button size="mini">去看看</el-button>
            </a>
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
        :title="friend.id ? '编辑友链' : '添加友链'"
        :visible.sync="friendSta"
        width="30%">
      <div class="friend_dig">
        <el-form :model="friend" status-icon :rules="rules" ref="friend" label-width="60px" class="demo-ruleForm">
          <el-form-item label="名称" prop="title">
            <el-input v-model="friend.title" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="站点" prop="website">
            <el-input v-model="friend.website"></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 30px">
            <el-button type="primary" :loading="wait" @click="saveFriend()">保 存</el-button>
            <el-button @click="friendSta = false">取 消</el-button>
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
        friend: {}, // 修改友链时存的对象
        rules: { // 友链校验
          title: [{required: true, message: '请输入名称', trigger: 'blur'},],
          website: [{required: true, message: '请输入站点', trigger: 'blur'},],
        },
        friendSta: false, // 操作友链弹窗
        wait: false, // 友链保存时保存按钮的Loading
        friendList: [],  // 友链列表
      }
    },
    created() {
      this.getFriendList();
    },
    methods: {

      // 获取友链列表
      getFriendList() {
        this.$Axios.get('/yun/blog/friend_list').then(res => {
          if (res.code === 200) {
            this.friendList = res.data;
          } else {
            this.$message.error(res.message);
          }
        })
      },

      // 删除友链
      del(id) {
        let dat = {
          id: id,
          sta: 1,
        };
        this.$Axios.post('/yun/blog/operation_friend', dat).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功');
            this.getFriendList();
          } else {
            this.$message.error(res.message);
          }
        })
      },

      // 添加
      add() {
        this.friend = {};
        this.friendSta = true;
      },

      // 打开修改友链
      edit(dat) {
        this.friend = JSON.parse(JSON.stringify(dat));
        this.friendSta = true;
      },

      // 保存、修改友链
      saveFriend() {
        this.$refs.friend.validate((valid) => {
          if (valid) {
            this.wait = true;
            let dat = {
              id: this.friend.id,
              title: this.friend.title,
              website: this.friend.website,
            };
            this.$Axios.post('/yun/blog/operation_friend', dat).then(res => {
              this.friendSta = false;
              this.wait = false;
              if (res.code === 200) {
                this.$message.success('保存成功');
                this.getFriendList();
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
  .friend_dig {
    padding: 10px 40px 0;
  }
</style>
