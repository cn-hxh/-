<template>
  <div>
    <div class="header">
      <span>搜索用户数</span>
      <i class="el-icon-warning-outline"></i>
    </div>
    <div class="main">
      <span class="main-title">12321</span>
      <span class="main-content">17.1</span>
      <i class="el-icon-caret-top" style="color: greenyellow"></i>
      <i class="el-icon-caret-bottom" style="color: red"></i>
    </div>
    <div class="footer">
      <div class="charts" ref="charts"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'LineCharts',
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
          type: 'line',
          data: [40, 12, 53, 12, 88, 9, 43, 5],
          itemStyle: {
            opacity: 0,
          },
          lineStyle: {
            color: 'skyblue',
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
                  color: 'skyblue',
                },
                {
                  offset: 1,
                  color: '#fff',
                },
              ],
              global: false,
            },
          },
          smooth: true,
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

<style scoped>
.header {
  display: flex;
  align-items: center;
}
.header span {
  margin-right: 10px;
}
.main {
  margin: 10px 0;
}
.main-title {
  margin-right: 30px;
}
.main-content {
  margin-right: 10px;
}
.charts {
  width: 100%;
  height: 50px;
}
</style>