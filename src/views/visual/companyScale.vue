<template>
  <div class="app-container">
    <select-job @draw="getMapData"></select-job>
    <div class="draw">
      <div id="map1"></div>
      <div id="map2"></div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { getCompanyscale } from '@/api/visual'
import { formatData } from '@/utils/index'
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
    drawMap(name, data, pieData) {
      const oldMap = echarts.getInstanceByDom(document.getElementById('map1'))
      if (oldMap) {
        oldMap.dispose()
      }
      const map1 = echarts.init(document.getElementById('map1'))
      const map2 = echarts.init(document.getElementById('map2'))
      const text = name + '企业规模分布'
      const text1 = name + '企业规模与平均薪资对比'
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
            data: pieData,
            selectedMode: 'single'
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
    getMapData(name) {
      // console.log(name)
      getCompanyscale({ name }).then(res => {
        res = res.message
        const pieData = formatData(res)
        this.drawMap(name, res, pieData)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .draw {
    display: flex;
    width: 100%;
    height: 600px;
    #map1, #map2 {
      width: 50%;
      height: 100%;
    }
  }
</style>
