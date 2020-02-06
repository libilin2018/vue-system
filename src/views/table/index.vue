<template>
  <div class="app-container">
    <div class="app-select">
      <el-select
        v-model="currentJob"
        placeholder="请选择"
        class="select-job"
        @change="handleJobChange"
      >
        <el-option
          v-for="item in jobOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <div class="select-content">
        <el-input
          v-model="inputContent"
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          class="select-input"
        >
        </el-input>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      height="600"
      class="table"
    >
      <el-table-column label="岗位名称" width="130" align="center">
        <template slot-scope="scope">
          {{ scope.row.job }}
        </template>
      </el-table-column>
      <el-table-column label="公司" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.companyname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地区" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.area }}
        </template>
      </el-table-column>
      <el-table-column label="公司类型" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.companytype }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="公司规模" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.company_people }}
          <!-- <el-tag>{{ scope.row.scale }}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="学历要求" width="110">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.education }}</span>
        </template>
      </el-table-column>
      <el-table-column label="招聘需求" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.require_people }}
        </template>
      </el-table-column>
      <el-table-column label="工作经验" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.workyear }}
        </template>
      </el-table-column>
      <el-table-column label="工资" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.salary }}
        </template>
      </el-table-column>
      <el-table-column label="" width="110" align="center" class-name="table-btns">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-menu" size="mini" title="更多信息" @click="handleDialogClick(scope.row)"></el-button>
          <el-button v-permission="['admin', 'super-admin']" type="danger" icon="el-icon-delete" size="mini" title="删除" @click="handleDelClick(scope.row, scope.$index, list)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page.sync="page"
      :page-size="30"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      layout="total, sizes, prev, pager, next"
      :total="counts"
      :background="true"
      @current-change="handlePageSizeChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>
    <el-dialog title="职位信息" :visible.sync="dialogJobVisible" class="dialog">
      <el-form :model="jobForm" label-width="120px">
        <el-form-item label="职位名称">
          <el-input v-model="jobForm.job" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="职位描述">
          <el-input v-model="jobForm.job_describe" type="textarea" rows="5"></el-input>
        </el-form-item>
        <el-form-item label="福利">
          <el-input v-model="jobForm.welfare" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogJobVisible = false">确定</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import { getHomeData, getRaw, getRawQuery, getRawDelete } from '@/api/visual'
import { formatSelectData } from '@/utils/index'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      page: 1,
      pageSize: 30,
      counts: 0,
      list: null,
      listLoading: false,
      inputContent: '',
      dialogJobVisible: false,
      currentJob: '',
      jobForm: {
        job: '',
        job_describe: '',
        welfare: ''
      },
      jobOptions: [],
      roles: []
    }
  },
  created() {
    // this.init()
    this.fetchData()
  },
  methods: {
    init() {
      const roles = this.$store.getters.roles
      // console.log(roles.includes('admin'))
      this.roles = roles
    },
    fetchData() {
      getHomeData().then(res => {
        res = res.message
        const jobs = formatSelectData(res.jobs)
        const currentJob = jobs[0].label
        this.jobOptions = jobs
        this.currentJob = currentJob
        this.getRawData(currentJob, 1)
      })
    },
    getRawData(name, page, pageSize = this.pageSize, keyword) {
      this.listLoading = true
      if (keyword) {
        getRawQuery({ name, page, pageSize, keyword }).then(res => {
          res = res.message
          this.counts = res.counts
          this.list = res.jobs
          this.listLoading = false
        })
      } else {
        getRaw({ name, page, pageSize }).then(res => {
          res = res.message
          this.counts = res.counts
          this.list = res.jobs
          this.listLoading = false
        })
      }
    },
    handlePageSizeChange(page) {
      if (this.inputContent) {
        this.getRawData(this.currentJob, page, undefined, this.inputContent)
      } else {
        this.getRawData(this.currentJob, page)
      }
    },
    handleSizeChange(pageSize) {
      // console.log(pageSize)
      this.pageSize = pageSize
      if (this.inputContent) {
        this.getRawData(this.currentJob, this.page, undefined, this.inputContent)
      } else {
        this.getRawData(this.currentJob, this.page)
      }
    },
    handleJobChange(name) {
      this.page = 1
      this.inputContent = ''
      this.getRawData(name, 1)
    },
    handleDialogClick(item) {
      // console.log(item)
      this.jobForm = item
      this.dialogJobVisible = true
    },
    handleEditEmit() {
      // console.log(this.jobForm)
    },
    handleDelClick(item, index, rows) {
      // 删除数据操作
      const id = item.jobId
      const name = this.currentJob
      if (id) {
        this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          getRawDelete({ name, id }).then(res => {
            this.listLoading = false
            rows.splice(index, 1)
            this.counts = this.counts - 1
            // this.fetchData()
            this.$message({
              type: 'success',
              message: '已删除'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$message({
          message: '缺少字段，删除失败'
        })
      }
    },
    handleSearch() {
      const content = this.inputContent
      if (!content) {
        this.$message({
          message: '内容为空，请输入！'
        })
        return
      }
      this.getRawData(this.currentJob, this.page, undefined, content)
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-select {
    display: flex;
    width: 100%;
    padding-bottom: 10px;
    .select-job {
      width: 20%;
    }
    .select-content {
      display: flex;
      width: 80%;
      padding-left: 20px;
      .select-input {
        width: 60%;
        padding-right: 20px;
      }
    }
  }
  .table >>> .table-btns {
    border: none;
  }
  .table >>> .tableStyle{
    background-color: #409eff;
    color:#fff;
    font-weight:400;
  }
  .table >>> .tableStyle:nth-child(11) {
    background-color: #fff
  }
  .table >>> .table-btns .cell {
    display: flex
  }
</style>
