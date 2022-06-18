<template>
  <div>
    <div class="card-header">
      <span>{{ title }}</span>
      <i>11</i>
    </div>
    <div class="card-content">{{ count }}</div>
    <div class="card-charts">
      <slot name="charts"></slot>
    </div>
    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Detail',
  props: ['title', 'count']
};
</script>

<style>
.card-header {
  display: flex;
  justify-content: space-between;
  color: #d9d9d9;
  font-size: 15px;
}
.card-content {
  font-size: 30px;
  padding: 10px 0px;
}
.card-charts {
  height: 50px;
  position: relative;
}
.card-footer {
  border-top: 1px solid #eee;
  height: 20px;
  padding: 10px 0;
}
.charts-center {
  position: absolute;
  bottom: 5px;
}
</style>