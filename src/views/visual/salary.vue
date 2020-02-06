<template>
  <div class="app-container">
    <select-job @draw="getMapData"></select-job>
    <div id="map"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { getRequireTop10 } from '@/api/visual'
import SelectJob from '@/components/SelectJob'

export default {
  components: {
    SelectJob
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
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
    getMapData(name) {
      // console.log(name)
      getRequireTop10({ name }).then(res => {
        res = res.message
        this.drawMap(name, res)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  #map {
    width: 90%;
    height: 600px;
  }
</style>
