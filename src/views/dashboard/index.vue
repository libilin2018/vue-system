<template>
  <div class="dashboard-container">
    <div class="dashboard-card">
      <el-card shadow="hover" class="card-item">
        <h3>招聘信息总数</h3>
        <div><span class="number">{{ counts }}</span>条</div>
      </el-card>
      <el-card shadow="hover" class="card-item">
        <h3>职位数</h3>
        <div><span class="number">{{ jobNum }}</span>条</div>
      </el-card>
      <el-card shadow="hover" class="card-item">
        <h3>数据来源</h3>
        <div><a class="primaryTxt" href="https://www.51job.com/" target="_blank">51job</a></div>
      </el-card>
      <el-card shadow="hover" class="card-item">
        <h3>最近添加</h3>
        <div><span class="number">{{ recent }}</span>条</div>
      </el-card>
      <el-card shadow="hover" class="card-item">
        <h3>最近更新时间</h3>
        <div><span class="primaryTxt">{{ updateTime }}</span></div>
      </el-card>
    </div>
    <div class="dashboard-echart">
      <div id="pie"></div>
      <div id="line"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getHomeData } from '@/api/visual'
import { formatTime } from '@/utils/index'
import echarts from 'echarts'

export default {
  name: 'Dashboard',
  data() {
    return {
      jobNum: 0,
      counts: 0,
      recent: 0,
      time: 0
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ]),
    updateTime() {
      return formatTime(this.time)
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      getHomeData().then(res => {
        res = res.message
        const jobs = res.jobs
        this.jobNum = jobs.length
        this.counts = res.counts
        this.recent = res.recent
        this.time = parseInt(res.time)
        this.drawEchart(jobs)
      })
    },
    drawEchart(data) {
      const pie = echarts.init(document.getElementById('pie'))
      const line = echarts.init(document.getElementById('line'))
      const lineOption = {
        title: { text: '近七天数据' },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          areaStyle: {
            color: '"#000'
          },
          symbol: 'emptyCircle',
          symbolSize: 6
        }]
      }
      const pieOption = {
        title: {
          text: '各岗位占比'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          left: 10,
          top: 50,
          bottom: 20
        },
        series: [
          {
            name: '职位名称',
            type: 'pie',
            data
          }
        ]
      }
      line.setOption(lineOption)
      pie.setOption(pieOption)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
  &-card {
    width: 100%;
    padding-bottom: 50px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;

    .card-item {
      width: 32%;
      height: 150px;
      margin: 10px 15px 0 0
    }
  }
  &-echart {
    display: flex;
    width: 100%;
    height: 400px;
    > div {
      width: 50%;
      height: 100%;
    }
  }
}
</style>
