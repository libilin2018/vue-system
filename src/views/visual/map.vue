<template>
  <div class="app-container">
    <select-job @draw="getMapData"></select-job>
    <div id="map"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/extension/bmap/bmap'
import { geoCoordMap } from '@/json/map'
import { getMap } from '@/api/visual'
import { formatData, formatTime } from '@/utils/index'
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
    drawMap(name, data, time) {
      const oldMap = echarts.getInstanceByDom(document.getElementById('map'))
      if (oldMap) {
        oldMap.dispose()
      }
      const map = echarts.init(document.getElementById('map'))
      const text = name + '全国城市需求分布'
      const subtext = '最近更新：' + formatTime(parseInt(time))
      const scale = data[0].value / 75
      var convertData = function(data) {
        var res = []
        for (var i = 0; i < data.length; i++) {
          var geoCoord = geoCoordMap[data[i].name]
          if (geoCoord) {
            res.push({
              name: data[i].name,
              value: geoCoord.concat(data[i].value)
            })
          }
        }
        // console.log(res)
        return res
      }

      var option = {
        backgroundColor: 'transparent',
        title: {
          text,
          subtext,
          left: 'center',
          top: '20',
          textStyle: {
            color: '#f00'
          }
        },
        // 提示框组件
        tooltip: {
          trigger: 'item'
        },
        bmap: {
          center: [104.114129, 37.550339],
          zoom: 5,
          roam: true,
          mapStyle: {
            styleJson: [{
              'featureType': 'water',
              'elementType': 'all',
              'stylers': {
                'color': '#d1d1d1'
              }
            }, {
              'featureType': 'land',
              'elementType': 'all',
              'stylers': {
                'color': '#f3f3f3'
              }
            }, {
              'featureType': 'railway',
              'elementType': 'all',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'highway',
              'elementType': 'all',
              'stylers': {
                'color': '#fdfdfd'
              }
            }, {
              'featureType': 'highway',
              'elementType': 'labels',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'arterial',
              'elementType': 'geometry',
              'stylers': {
                'color': '#fefefe'
              }
            }, {
              'featureType': 'arterial',
              'elementType': 'geometry.fill',
              'stylers': {
                'color': '#fefefe'
              }
            }, {
              'featureType': 'poi',
              'elementType': 'all',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'green',
              'elementType': 'all',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'subway',
              'elementType': 'all',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'manmade',
              'elementType': 'all',
              'stylers': {
                'color': '#d1d1d1'
              }
            }, {
              'featureType': 'local',
              'elementType': 'all',
              'stylers': {
                'color': '#d1d1d1'
              }
            }, {
              'featureType': 'arterial',
              'elementType': 'labels',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'boundary',
              'elementType': 'all',
              'stylers': {
                'color': '#fefefe'
              }
            }, {
              'featureType': 'building',
              'elementType': 'all',
              'stylers': {
                'color': '#d1d1d1'
              }
            }, {
              'featureType': 'label',
              'elementType': 'labels.text.fill',
              'stylers': {
                'color': '#999999'
              }
            }]
          }
        },
        series: [
          {
            name: '数量',
            type: 'scatter',
            coordinateSystem: 'bmap',
            data: convertData(data),
            // 标志大小
            symbolSize: function(val) {
              return val[2] / scale
            },
            label: {
              // {a}：系列名 {b}：数据名 {c}：数据值
              formatter: '{b}',
              position: 'right'
            },
            itemStyle: {
              color: 'purple'
            },
            emphasis: {
              label: {
                show: true
              }
            }
          },
          {
            name: 'Top 10',
            type: 'effectScatter',
            coordinateSystem: 'bmap',
            data: convertData(data.sort(function(a, b) {
              return b.value - a.value
            }).slice(0, 10)),
            symbolSize: function(val) {
              // let res = val[2]
              // if (res < 100) {
              //   res = 4
              // } else {
              //   res = res / 30
              // }
              return val[2] / scale
            },
            showEffectOn: 'render', // 绘制完成后显示特效
            rippleEffect: {
              brushType: 'stroke' // stoke fill
            },
            hoverAnimation: true,
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: 'purple',
                shadowBlur: 10,
                shadowColor: '#333'
              }
            },
            zlevel: 1
          }
        ]
      }
      map.setOption(option)
    },
    getMapData(name) {
      // console.log(name)
      getMap({ name }).then(res => {
        res = res.message
        const data = formatData(res)
        // console.log(data)
        this.drawMap(name, data, res.time)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  #map {
    width: 100%;
    height: calc(100vh - 120px);
  }
</style>
