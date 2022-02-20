<template>
  <el-card class="box-card" shadow="never">
    <div>
      <div slot="header" class="clearfix">
        <span>任务列表</span>
        <el-button style="float: right" icon="el-icon-plus" circle size="mini" type="primary" plain
                   @click="add"></el-button>
      </div>
      <div>

        <el-table
            :data="devopsList"
            style="width: 100%" v-if="devopsList.length">
          <el-table-column
              type="index"
              width="50">
          </el-table-column>
          <el-table-column
              prop="name"
              label="任务名称">
          </el-table-column>
          <el-table-column
              prop="branch"
              label="分支">
          </el-table-column>
          <el-table-column
              prop="env"
              label="环境">
          </el-table-column>
          <el-table-column
              prop="action"
              label="操作"
              width="300">
            <template slot-scope="scope">
              <a v-if="scope.row.url" target="_blank" :href="scope.row.url">
                <el-button size="mini">访问</el-button>
              </a>
              <span>
                    <el-button size="mini" type="primary" @click="edit(scope.row)">修改</el-button>
                  </span>
              <el-popover
                  :ref="`${scope.row.id}_build`"
                  placement="top"
                  width="160">
                <p>确定部署吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[`${scope.row.id}_build`].doClose()">取消</el-button>
                  <el-button type="primary" size="mini" @click="build(scope.row)">确定</el-button>
                </div>
                <el-button type="success" slot="reference" size="mini">部署</el-button>
              </el-popover>
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

        <div v-else>
          <el-empty></el-empty>
        </div>

        <div class="skeleton" style="height: 500px;width: 100%" v-show="loading">
          <ul style="margin: 0;padding: 0">
            <li style="width: 100%" class="skeleton-content"></li>
            <li style="width: 100%" class="skeleton-content"></li>
            <li style="width: 100%" class="skeleton-content"></li>
            <li style="width: 100%" class="skeleton-content"></li>
            <li style="width: 100%" class="skeleton-content"></li>
          </ul>
        </div>

      </div>

      <el-dialog
          :title="devops.id ? '编辑项目' : '添加项目'"
          :visible.sync="devopsSta"
          width="50%">
        <div class="devops_dig">
          <el-form :model="devops" :rules="rules" ref="devops" label-width="60px" class="demo-ruleForm">
            <el-form-item label="名称" prop="name">
              <el-input v-model="devops.name" clearable autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="分支" prop="branch">
              <el-select
                  v-model="devops.branch"
                  clearable
                  filterable
                  allow-create
                  default-first-option>
                <el-option
                    v-for="item in branchOptions"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value">
                </el-option>
              </el-select>

            </el-form-item>
            <el-form-item label="环境" prop="env">
              <el-select
                  v-model="devops.env"
                  clearable
                  filterable
                  allow-create
                  default-first-option>
                <el-option
                    v-for="item in envOptions"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="地址" prop="url">
              <el-input v-model="devops.url" clearable></el-input>
            </el-form-item>
            <el-form-item style="margin-top: 30px">
              <el-button type="primary" :loading="wait" @click="saveDevops()">保 存</el-button>
              <el-button @click="devopsSta = false">取 消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
import {devops_list, build_devops, operation_devops} from '@/api/devops'

export default {
  data() {
    return {
      devops: {}, // 修改项目时存的对象
      rules: { // 项目校验
        name: [{required: true, message: '请输入名称', trigger: 'blur'},],
        branch: [{required: true, message: '请输入分支', trigger: 'blur'},],
        env: [{required: false, message: '请输入环境', trigger: 'blur'},],
        url: [{required: false, message: '请输入访问地址', trigger: 'blur'},],
      },
      branchOptions: [
        { value: 'master' },
        { value: 'main' },
        { value: 'feature/1.0.0' },
        { value: 'dev' },
        { value: 'test' },
        { value: 'staging' },
        { value: 'prod' },
        { value: 'product' },
        { value: 'live' }
      ],
      envOptions: [
        { value: 'dev' },
        { value: 'test' },
        { value: 'staging' },
        { value: 'prod' },
        { value: 'product' },
        { value: 'live' }
      ],
      devopsSta: false, // 操作项目弹窗
      wait: false, // 项目保存时保存按钮的Loading
      devopsList: [
        // {name: 'blog-client', branch: '', env: '',},
        // {name: 'blog-serve', branch: '', env: '',},
        // {name: 'chat-serve', branch: '', env: '',},
        // {name: 'core-serve', branch: '', env: '',},
        // {name: 'jingjing', branch: '', env: '',},
        // {name: 'music-serve', branch: '', env: '',},
        // {name: 'qingsong-serve', branch: '', env: '',},
        // {name: 'yun-serve', branch: '', env: '',},
      ],  // 项目列表
      loading: false
    }
  },
  created() {
    this.getDevopsList();
  },
  methods: {

    // 获取项目列表
    getDevopsList() {
      this.loading = true
      devops_list().then(res => {
        if (res.code === 200) {
          this.devopsList = res.data;
        } else {
          this.$message.error(res.message);
        }
      }).finally(() => {
        this.loading = false
      })
    },

    // 部署
    build(data) {
      console.log(data);
      const dat = {
        name: data.name,
        branch: data.branch,
        env: data.env,
      }
      build_devops(dat).then(res => {
        if (res.code === 200) {
          this.$message.success('部署成功');
          // this.getDevopsList();
        } else {
          this.$message.error(res.message);
        }
      })
    },

    // 删除项目
    del(id) {
      let dat = {
        id: id,
        is_del: 1,
      };
      operation_devops(dat).then(res => {
        if (res.code === 200) {
          this.$message.success('删除成功');
          this.getDevopsList();
        } else {
          this.$message.error(res.message);
        }
      })
    },

    // 添加
    add() {
      this.devops = {};
      this.devopsSta = true;
    },

    // 打开修改项目
    edit(dat) {
      this.devops = JSON.parse(JSON.stringify(dat));
      this.devopsSta = true;
    },

    // 保存、修改项目
    saveDevops() {
      this.$refs.devops.validate((valid) => {
        if (valid) {
          this.wait = true;
          let dat = {
            ...this.devops,
            // id: this.devops.id,
            // title: this.devops.title,
            // website: this.devops.website,
          };
          operation_devops(dat).then(res => {
            this.devopsSta = false;
            this.wait = false;
            if (res.code === 200) {
              this.$message.success('保存成功');
              this.getDevopsList();
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
.devops_dig {
  padding: 10px 40px 0;
}
</style>
