<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-tabs class="tab" v-model="activeName">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visite"></el-tab-pane>
      </el-tabs>
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <el-date-picker
          v-model="date"
          class="date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="18">
          <div class="salecharts" ref="charts"></div>
        </el-col>
        <el-col :span="6">
          <h3>门店{{ title }}排名</h3>
          <ul class="saleUl">
            <li>
              <span class="rindex">0</span>
              <span>肯德基</span>
              <span class="rvalue">126864</span>
            </li>
            <li>
              <span class="rindex">0</span>
              <span>肯德基</span>
              <span class="rvalue">126864</span>
            </li>
            <li>
              <span class="rindex">0</span>
              <span>肯德基</span>
              <span class="rvalue">126864</span>
            </li>
            <li>
              <span class="rindex">0</span>
              <span>肯德基</span>
              <span class="rvalue">126864</span>
            </li>
            <li>
              <span class="rindex">0</span>
              <span>肯德基</span>
              <span class="rvalue">126864</span>
            </li>
            <li>
              <span class="rindex">0</span>
              <span>肯德基</span>
              <span class="rvalue">126864</span>
            </li>
            <li>
              <span class="rindex">0</span>
              <span>肯德基</span>
              <span class="rvalue">126864</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import * as echarts from 'echarts';
import dayjs from 'dayjs';
import { mapState } from 'vuex';

export default {
  name: 'Sale',
  data() {
    return {
      activeName: 'sale',
      myCharts: null,
      date: [],
    };
  },
  mounted() {
    this.myCharts = echarts.init(this.$refs.charts);
    this.myCharts.setOption({
      title: {
        text: this.title + '趋势',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: [],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: [],
        },
      ],
    });
  },
  computed: {
    title() {
      return this.activeName == 'sale' ? '销售额' : '访问量';
    },
    ...mapState({
      listState: (state) => state.home.list,
    }),
  },
  watch: {
    title() {
      this.myCharts.setOption({
        title: {
          text: this.title + '趋势',
        },
        xAxis: {
          data:
            this.title == '销售额'
              ? this.listState.orderFullYearAxis
              : this.listState.userFullYearAxis,
        },
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data:
              this.title == '销售额'
                ? this.listState.orderFullYear
                : this.listState.userFullYear,
          },
        ],
      });
    },
    listState() {
      this.myCharts.setOption({
        title: {
          text: this.title + '趋势',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: this.listState.orderFullYearAxis,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: this.listState.orderFullYear,
          },
        ],
      });
    },
  },
  methods: {
    setDay() {
      const day = dayjs().format('YYYY-MM-DD');
      this.date = [day, day];
    },
    setWeek() {
      const start = dayjs().day(1).format('YYYY-MM-DD');
      const end = dayjs().day(7).format('YYYY-MM-DD');
      this.date = [start, end];
    },
    setMonth() {
      const start = dayjs().startOf('month').format('YYYY-MM-DD');
      const end = dayjs().endOf('month').format('YYYY-MM-DD');
      this.date = [start, end];
    },
    setYear() {
      const start = dayjs().startOf('year').format('YYYY-MM-DD');
      const end = dayjs().endOf('year').format('YYYY-MM-DD');
      this.date = [start, end];
    },
  },
};
</script>

<style>
.clearfix {
  display: flex;
  position: relative;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;
}
.right .date {
  width: 220px;
  margin-left: 20px;
}
.right span {
  margin: 0px 10px;
}
.salecharts {
  width: 100%;
  height: 300px;
}
.saleUl {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0;
}
.saleUl li {
  height: 8%;
  margin: 5px 10px;
}
.rindex {
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #111;
  color: #fff;
  text-align: center;
  line-height: 20px;
}
li span {
  margin: 0px 10px;
}
.rvalue {
  float: right;
}
</style>