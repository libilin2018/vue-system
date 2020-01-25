<template>
  <div class="app-container">
    <el-select
      v-model="currentJob"
      placeholder="请选择"
      class="select-job"
      @change="handleJobChange"
    >
      <el-option
        v-for="item in jobs"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <div class="wash-content">
      <div class="wash-info">
        <h3>总招聘信息</h3>
        <span class="number">{{ total }}</span>
        <h3>/条</h3>
        <span class="tip">最近更新时间：{{ updateTime }}</span>
      </div>
      <div class="wash-info">
        <h3>有效招聘信息</h3>
        <span class="number">{{ valid }}</span>
        <h3>/条</h3>
        <span class="tip">剔除不含职位关键字、无薪资等招聘信息</span>
      </div>
      <div class="wash-table">
        <div>
          <h3>城市需求数量TOP10及其平均薪资</h3>
          <el-table
            :data="list1"
            border
            fit
            highlight-current-row
            :default-sort="{prop: 'num', order: 'ascending'}"
          >
            <el-table-column align="center" label="城市" width="95">
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="数量/条" width="95" prop="num" sortable>
              <template slot-scope="scope">
                {{ scope.row.value }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="薪资/千" width="95">
              <template slot-scope="scope">
                {{ scope.row.salary }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div>
          <h3>学历要求与平均薪资</h3>
          <el-table
            :data="list2"
            border
            fit
            highlight-current-row
          >
            <el-table-column align="center" label="学历" width="95">
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="数量/条" width="95">
              <template slot-scope="scope">
                {{ scope.row.value }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="薪资/千" width="95">
              <template slot-scope="scope">
                {{ scope.row.salary }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div>
          <h3>工作经验与平均薪资</h3>
          <el-table
            :data="list3"
            border
            fit
            highlight-current-row
          >
            <el-table-column align="center" label="经验" width="110">
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="数量/条" width="95">
              <template slot-scope="scope">
                {{ scope.row.value }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="薪资/千" width="95">
              <template slot-scope="scope">
                {{ scope.row.salary }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div>
          <h3>企业类型与平均薪资</h3>
          <el-table
            :data="list4"
            border
            fit
            highlight-current-row
          >
            <el-table-column align="center" label="类型" width="110">
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="数量/条" width="95">
              <template slot-scope="scope">
                {{ scope.row.value }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="薪资/千" width="95">
              <template slot-scope="scope">
                {{ scope.row.salary }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatTime } from '@/utils/index'
import { getHomeData, getWashData } from '@/api/visual'
import { formatData, formatSelectData } from '@/utils/index'

export default {
  data() {
    return {
      total: 0,
      valid: 0,
      updateTime: '',
      currentJob: '',
      jobs: [],
      list1: [],
      list2: [],
      list3: [],
      list4: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      getHomeData().then(res => {
        res = res.message
        const jobs = formatSelectData(res.jobs)
        // console.log(jobs)
        const job = jobs[0].label
        this.jobs = jobs
        this.currentJob = job
        this.getWash(job)
      })
    },
    getWash(name) {
      getWashData({ name }).then(res => {
        res = res.message
        this.total = res.total
        this.valid = res.valid
        this.updateTime = formatTime(parseInt(res.updateTime))
        this.list1 = formatData(res.requireTop10)
        this.list2 = formatData(res.education)
        this.list3 = formatData(res.workyear)
        this.list4 = formatData(res.companytype)
        console.log(this.list1, this.list2)
      })
    },
    handleJobChange(job) {
      console.log(job)
      this.getWash(job)
    }
  }
}
</script>

<style lang="scss" scoped>
  .wash-content {
    & > div {
      padding-top: 20px;
    }
    .wash-info > * {
      display: inline-block
    }
    .tip {
      font-size: 12px;
      color: #999;
      padding-left: 20px;
    }
    .wash-table {
      display: flex;
      justify-content: space-between
    }
  }
</style>
