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
    <div id="map"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { getHomeData, getRequireTop10 } from '@/api/visual'
import { formatSelectData } from '@/utils/index'

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
    drawMap(name, data) {
      const oldMap = echarts.getInstanceByDom(document.getElementById('map'))
      if (oldMap) {
        oldMap.dispose()
      }
      const map = echarts.init(document.getElementById('map'))
      const text = name + '需求数量Top10及其平均薪资'
      const option = {
        title: {
          text,
          subtext: '111',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          right: '0',
          data: ['需求数量', '平均薪资']
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
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: data.main
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '数量/条'
          },
          {
            type: 'value',
            name: '万/月'
          }
        ],
        series: [
          {
            name: '需求数量',
            type: 'bar',
            data: data.value,
            markPoint: {
              data: [
                { type: 'max', name: '需求最多城市' }
              ]
            },
            markLine: {
              data: [
                { type: 'average', name: '平均值' }
              ]
            }
          },
          {
            name: '平均薪资',
            type: 'bar',
            data: data.salary,
            yAxisIndex: 1,
            markPoint: {
              data: [
                { type: 'max', name: '平均薪资最高' }
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
      map.setOption(option)
    },
    handleJobChange(val) {
      this.getMapData(val)
    },
    getMapData(name) {
      console.log(name)
      getRequireTop10({ name }).then(res => {
        res = res.message
        this.drawMap(name, res)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
 .select {
   padding-bottom: 20px;
 }
  #map {
    width: 90%;
    height: 600px;
  }
</style>
