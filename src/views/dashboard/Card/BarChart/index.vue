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
        type: 'category',
      },
      yAxis: {
        show: false,
      },
      series: [
        {
          type: 'bar',
          data: [40, 62, 53, 42, 88, 79, 43, 65, 80, 95],
        },
      ],
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 10,
      },
    });
    // console.log(echarts);
  },
};
</script>

<style>
.charts {
  width: 100%;
  height: 100%;
}
</style>