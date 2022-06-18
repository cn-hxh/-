<template>
  <div class="charts" ref="charts"></div>
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
        min: 0,
        max: 100
      },
      yAxis: {
        show: false,
        type: 'category',
      },
      series: [
        {
          type: 'bar',
          data: [75],
          barWidth: 10,
          color: 'yellowgreen',
          showBackground: true,
          label: {
            show: true,
            formatter: '|',
            fontSize: 14,
            fontWeight: '1000',
            color: '#aaa',
            position: 'right'
          }
        },
      ],
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 10,
      },
    });
  },
};
</script>

<style>
.charts {
  width: 100%;
  height: 100%;
}
</style>