<template>
  <div class="app-container">
    <div class="select">
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
    </div>
    <div class="draw">
      <div id="map1"></div>
      <div id="map2"></div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { getHomeData, getWorkyear } from '@/api/visual'
import { formatData, formatSelectData } from '@/utils/index'

export default {
  data() {
    return {
      currentJob: '',
      jobOptions: []
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
        const currentJob = jobs[0].label
        this.jobOptions = jobs
        this.currentJob = currentJob
        this.getMapData(currentJob)
      })
    },
    drawMap(name, data, pieData) {
      const oldMap = echarts.getInstanceByDom(document.getElementById('map1'))
      if (oldMap) {
        oldMap.dispose()
      }
      const map1 = echarts.init(document.getElementById('map1'))
      const map2 = echarts.init(document.getElementById('map2'))
      const text = name + '工作经验要求分布'
      const text1 = name + '工作经验与平均薪资对比'
      const option1 = {
        title: {
          text
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
            data: pieData
          }
        ]
      }
      const option2 = {
        title: {
          text: text1
        },
        tooltip: {
          trigger: 'axis'
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          },
          right: 0,
          bottom: 0
        },
        xAxis: [
          {
            type: 'category', // 类目轴
            data: data.main,
            axisLabel: {
              interval: 0,
              rotate: 40
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '千/月'
          }
        ],
        series: [
          {
            name: '薪资',
            type: 'bar',
            data: data.salary,
            markPoint: {
              data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          }
        ]
      }

      map1.setOption(option1)
      map2.setOption(option2)
    },
    handleJobChange(val) {
      this.getMapData(val)
    },
    getMapData(name) {
      console.log(name)
      getWorkyear({ name }).then(res => {
        res = res.message
        const pieData = formatData(res)
        this.drawMap(name, res, pieData)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
 .select {
   padding-bottom: 20px;
 }
  .draw {
    display: flex;
    width: 100%;
    height: 600px;
    #map1, #map2 {
      height: 100%;
    }
    #map1 {
      width: 40%;
    }
    #map2 {
      width: 60%;
    }
  }
</style>
