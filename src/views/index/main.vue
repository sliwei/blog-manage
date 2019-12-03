<template>
  <div class="admin">

    <el-row :gutter="24">
      <el-col :span="10">
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span>服务器状态 <span class="constants"> <i :style="`background-color: ${sys.constants ? '#4CAF50' : '#F44336'}`"></i> {{sys.constants ? '服务器运行正常' : '服务器异常'}}</span></span>
          </div>
          <div>
            <p>服务器主机名：
              <el-tag size="small">{{sys.hostname}}</el-tag>
            </p>
            <!--<p>运行状态：  服务器出现错误</p>-->
            <p>服务器发行版本：
              <el-tag size="small">{{sys.release}}</el-tag>
            </p>
            <p>Node.js编译运行系统平台：
              <el-tag size="small">{{sys.platform}}</el-tag>
            </p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span>服务器信息</span>
            <el-button @click="getSys" style="float: right; padding: 3px 0" type="text">刷新</el-button>
          </div>
          <div>
            <el-row :gutter="24">
              <el-col :span="12">
                <p>操作系统：
                  <el-tag size="small">{{sys.hostname}}</el-tag>
                </p>
                <p>服务器总内存数：
                  <el-tag size="small" type="success">{{sys.totalmem}}</el-tag>
                </p>
                <p>服务器已用内存数：
                  <el-tag size="small" type="success">{{sys.freemem}}</el-tag>
                </p>
              </el-col>
              <el-col :span="12" style="text-align: center">
                <el-progress type="circle" :percentage="percentage"></el-progress>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="24" style="margin-top: 20px">
      <el-col :span="24">
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span>CPU信息</span>
          </div>
          <div>
            <el-table
                :data="sys.cpu"
                border
                style="width: 100%">
              <el-table-column
                  prop="model"
                  label="CPU内核模型">
              </el-table-column>
              <el-table-column
                  prop="speed"
                  label="CPU频率(Hz)">
              </el-table-column>
              <el-table-column
                  prop="times"
                  label="CPU空闲">
                <template slot-scope="scope">
                  {{scope.row.times.idle}}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import {sys} from '@/api/admin'

  export default {
    data() {
      return {
        percentage: 0,
        sys: {
          cpu: [],
        },
      }
    },
    methods: {
      getSys() {
        sys().then(res => {
          if (res.code === 200) {
            this.sys = res.data;
            this.percentage = parseInt(parseInt(this.sys.freemem) / parseInt(this.sys.totalmem) * 100);
          } else {
            this.$message.error(res.message);
          }
        })
      },
    },
    created() {
      this.getSys();
    },
  }
</script>

<style lang="less" scoped>
  @import "~@/assets/less/theme.less";

  .admin {
    padding: 40px 60px;

    .constants {
      float: right;
      vertical-align: bottom;
      font-size: 12px;
      display: inline-block;
      border: 1px solid #e1e1e1;
      padding: 5px 10px;
      border-radius: 5px;

      i {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 5px;

        margin-right: 5px;
      }
    }
  }
</style>
