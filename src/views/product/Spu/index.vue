<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="scene != 0"
      ></CategorySelect>
    </el-card>
    <el-card>
      <!-- 展示SPU列表的结构 -->
      <div v-show="scene == 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 10px"
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <HintButton
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></HintButton>
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部sku列表"
                @click="handler(row)"
              ></el-button>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <el-button
                  style="margin-left: 10px"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper, ->, sizes, total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
          :total="total"
        >
        </el-pagination>
      </div>
      <SpuForm
        v-show="scene == 1"
        @changeScene="changeScene"
        ref="spu"
      ></SpuForm>
      <SkuForm
        v-show="scene == 2"
        ref="sku"
        @changeScenes="changeScenes"
      ></SkuForm>
    </el-card>
    <el-dialog
      :title="`${spu.spuName}的sku列表`"
      :visible.sync="dialogTableVisible"
      :before-close="close"
    >
      <el-table :data="skuList" style="width: 100%" border v-loading="loading">
        <el-table-column
          prop="skuName"
          label="名称"
          width="width"
        ></el-table-column>
        <el-table-column
          prop="price"
          label="价格"
          width="width"
        ></el-table-column>
        <el-table-column
          prop="weight"
          label="重量"
          width="width"
        ></el-table-column>
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{ row }">
            <img
              :src="row.skuDefaultImg"
              alt=""
              style="width: 100px; height: 100px"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
// 引入子组件
import SpuForm from './SpuForm';
import SkuForm from './SkuForm';

export default {
  name: 'Spu',
  data() {
    return {
      // 分别是分类的id
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 分页器当前第几页
      page: 1,
      // 每一页需要展示多少条数据
      limit: 3,
      // spu列表的数据
      records: [],
      // 分页器一共需要展示数据的条数
      total: 0,
      // 0代表展示SPU列表数据  1代表展示 添加SPU|修改SPU  2代表 添加SKU
      scene: 0,
      // 控制对话框的显示与隐藏
      dialogTableVisible: false,
      spu: {},
      // 存储的是SKU列表的数据
      skuList: [],
      loading: true,
    };
  },
  methods: {
    // 三级联动的自定义事件，可以把子组件的相应的id传递给父组件
    getCategoryId({ categoryId, level }) {
      // categoryId：获取到一、二、三级分类的id，level：为了区分是几级id
      if (level == 1) {
        this.category1Id = categoryId;
        // 清除2、3级分类的id
        this.category2Id = '';
        this.category3Id = '';
      } else if (level == 2) {
        this.category2Id = categoryId;
        // 清除3级id
        this.category3Id = '';
      } else {
        this.category3Id = categoryId;
        // 获取SPU列表数据进行展示
        this.getSpuList();
      }
    },
    // 获取SPU列表数据的方法
    async getSpuList(pages = 1) {
      this.page = pages;
      const { page, limit, category3Id } = this;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    // 当分页器的某一个展示数据条数发生变化的回调
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    // 添加SPU按钮的回调
    addSpu() {
      this.scene = 1;
      this.$refs.spu.addSpuData(this.category3Id);
    },
    // 修改某一个SPU
    updateSpu(row) {
      this.scene = 1;
      this.$refs.spu.initSpuData(row);
    },
    // 自定义事件回调（SpuForm）
    changeScene({ scene, flag }) {
      this.scene = scene;
      if (flag == '修改') {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
    },
    // 删除SPU的回调
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({
          type: 'success',
          message: '删除成功',
        });
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },
    // 添加 SKU 按钮的回调
    addSku(row) {
      this.scene = 2;
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    // skuForm 通知父组件修改场景
    changeScenes(scene) {
      this.scene = scene;
    },
    // 查看SKU的按钮的回调
    async handler(spu) {
      this.dialogTableVisible = true;
      // 保存spu信息
      this.spu = spu;
      // 获取sku列表的数据进行展示
      let result = await this.$API.spu.reqSkuList(spu.id);
      if (result.code == 200) {
        this.skuList = result.data;
        this.loading = false;
      }
    },
    // 关闭对话框的回调
    close(done) {
      this.loading = true;
      this.skuList = [];
      // 关闭对话框
      done();
    },
  },
  components: {
    SpuForm,
    SkuForm,
  },
};
</script>

<style scoped lang="less">
</style>