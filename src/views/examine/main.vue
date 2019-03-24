<template>
  <div class="blog">

    <div class="param">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="时间区间查询">
          <el-date-picker
              v-model="date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">查询</el-button>
        </el-form-item>
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
            prop="time"
            label="类型"
            align="center"
            width="80">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.type === 0">评论</el-tag>
            <el-tag size="small" v-else type="success">留言</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="cont"
            label="内容">
        </el-table-column>
        <el-table-column
            prop="user_name"
            label="书写人"
            align="center"
            width="80">
        </el-table-column>
        <el-table-column
            prop="create_time"
            label="评论时间"
            align="center"
            width="160">
          <template slot-scope="scope">
            {{$Tool.formatDate(scope.row.create_time, 'YY年MM月DD日hh点mm')}}
          </template>
        </el-table-column>
        <el-table-column
            prop="time"
            label="状态"
            align="center"
            width="80">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.is_pass === 0">待审核</el-tag>
            <el-tag size="small" v-else-if="scope.row.is_pass === 1" type="success">已通过</el-tag>
            <el-tag size="small" v-else-if="scope.row.is_pass === 2" type="danger">不通过</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            width="230">
          <template slot-scope="scope">
            <a v-if="!scope.row.type" target="_blank" :href="`http://lwc.bstu.cn/detail/${scope.row.code}`">
              <el-button size="mini">查看原文</el-button>
            </a>
            <span v-if="scope.row.is_pass === 0">
              <el-button size="mini" type="primary" @click="examineFun(scope.row)">审核</el-button>
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

    <el-dialog
        :title="examineDat.type ? '留言审核' : '评论审核'"
        :visible.sync="examineSta"
        width="50%">
      <div class="examine_dig">

        <div class="examine_msg">
          <el-alert
              title="审核提醒"
              type="warning"
              description="请遵循国家对网上发帖、评论的法律条例约束和规范严格审核"
              close-text="知道了"
              show-icon>
          </el-alert>
        </div>

        <div class="examine">

          <p v-if="!examineDat.type">原文:</p>

          <div v-if="!examineDat.type" class="look">
            <a target="_blank" :href="`http://lwc.bstu.cn/detail/${examineDat.code}`">
              <span>{{examineDat.blog_title}}</span>
            </a>
          </div>

          <p>内容:</p>

          <div class="cont" v-html="examineDat.cont"
               style="width: 100%; height: 300px;border: 1px solid #e1e1e1; padding: 10px; overflow: auto">
          </div>

        </div>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="examineSta = false">取 消</el-button>
        <el-button type="danger" @click="examineOperction(2)" :loading="examineLoading">不通过</el-button>
        <el-button type="success" @click="examineOperction(1)" :loading="examineLoading">通过</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import qs from 'qs'
  import moment from 'moment'

  export default {
    data() {
      return {
        date: [],
        delSta: false,
        param: {
          pageIndex: 1,
          pageSize: 10,
          title: '',
          type: '',
        },
        total: 0,
        list: [],
        examineDat: {},
        examineSta: false,
        examineLoading: false,
      }
    },
    created() {
      this.getList();
    },
    methods: {
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
      // 序号
      showIndex(index) {
        return index + (this.param.pageIndex - 1) * this.param.pageSize + 1;
      },
      // 获取数据
      getList() {
        this.param.startTime = moment(this.date[0]).format('YYYY-MM-DD HH:mm:ss');
        this.param.endTime = moment(this.date[0]).format('YYYY-MM-DD HH:mm:ss');

        console.log(this.param);

        this.$Axios.get(`/yun/blog/comment_list?${qs.stringify(this.param)}`).then(res => {
          console.log(res);
          if (res.code === 200) {
            this.list = res.data.list;
            this.total = res.data.total;
          } else {
            this.$message.error(res.message);
          }
        })
      },
      // 删除
      del(id) {
        let dat = {id: id, sta: 1};
        this.$Axios.post('/yun/blog/evaluate_del', dat).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功');
            this.$refs[id].doClose();
          } else {
            this.$message.error(res.message);
          }
        });
      },
      // 设为草稿
      setDraft(id, e) {
        let dat = {id: id, draft: e ? 1 : 0};
        this.$Axios.post('/yun/blog/blog_status', dat).then(res => {
          if (res.code === 200) {
            this.$message.success('设置成功');
            this.$refs[id].doClose();
          } else {
            this.$message.error(res.message);
          }
        });
      },
      examineFun(dat) {
        console.log(dat);
        this.examineDat = dat;
        this.examineSta = true;
      },
      examineOperction(sta) {
        this.examineLoading = true;
        let dat = {
          id: this.examineDat.id,
          sta: sta,
        };
        this.$Axios.post('/yun/blog/evaluate_examine', dat).then(res => {
          this.examineLoading = false;
          if (res.code === 200) {
            this.$message.success('审核成功');
            this.examineDat = {};
            this.examineSta = false;
            this.getList();
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
      height: 60px;
    }

    /deep/ .el-range-separator {
      width: auto;
    }

    .examine_dig {
      .examine_msg {
      }

      .examine {
        margin-top: 10px;

        p {
          font-weight: bold;
        }

        .cont {
          width: 100%;
          height: 300px;
          border: 1px solid #e1e1e1;
          padding: 10px;
          overflow: auto;
        }

        .look {
          a {
            color: #409EFF;
            text-decoration: underline;
          }
        }
      }
    }
  }
</style>
