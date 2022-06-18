<template>
  <div class="charts" ref="charts">
    
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'LineChart',
  mounted() {
    let lineCharts = echarts.init(this.$refs.charts);
    lineCharts.setOption({
      xAxis: {
        show: false,
        type: 'category',
      },
      yAxis: {
        show: false
      },
      series: [
        {
          type: 'line',
          data: [40, 12, 53, 12, 88, 9, 43, 5],
          itemStyle: {
            opacity: 0
          },
          lineStyle: {
            color: 'purple'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'purple'
                },
                {
                  offset: 1,
                  color: '#fff'
                }
              ],
              global: false
            }
          },
          smooth: true
        }
      ],
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 10
      }
    });
    // console.log(echarts);
  },
}
</script>

<style>
.charts {
  width: 100%;
  height: 100%;
}
</style>