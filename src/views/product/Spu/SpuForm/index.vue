<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="tm in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          resize="none"
          rows="4"
          placeholder="描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="http://gmall-h5-api.atguigu.cn/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handlerSuccess"
          :file-list="spuImageList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unSelectSaleAttr.length}未选择`"
          v-model="attrIdAndAttrName"
        >
          <el-option
            :label="unselect.name"
            :value="`${unselect.id}:${unselect.name}`"
            v-for="unselect in unSelectSaleAttr"
            :key="unselect.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-left: 10px"
          :disabled="!attrIdAndAttrName"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <el-table
          style="width: 100%; margin-top: 20px"
          border
          :data="spu.spuSaleAttrList"
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      // 存储SPU信息属性
      spu: {
        category3Id: 0,
        description: '',
        spuName: '',
        tmId: '',
        spuImageList: [],
        spuSaleAttrList: [],
      },
      // 存储品牌信息
      tradeMarkList: [],
      // 存储SPU图片的数据
      spuImageList: [],
      // 存储销售属性的数据
      saleAttrList: [],
      // 收集未选择的销售属性的id
      attrIdAndAttrName: '',
    };
  },
  methods: {
    handleRemove(file, fileList) {
      this.spuImageList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 初始化SpuForm数据
    async initSpuData(spu) {
      // 获取SPU信息的数据
      let spuResult = await this.$API.spu.reqSpu(spu.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      // 获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      // 获取spu图片的数据
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageResult.code == 200) {
        let listArr = spuImageResult.data;
        listArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = listArr;
      }
      // 获取平台全部的销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    // 照片墙图片上传成功的回调
    handlerSuccess(response, file, fileList) {
      this.spuImageList = fileList;
    },
    // 添加新的销售属性
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(':');
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      this.spu.spuSaleAttrList.push(newSaleAttr);
      // 清空数据
      this.attrIdAndAttrName = '';
    },
    // 添加按钮的回调
    addSaleAttrValue(row) {
      this.$set(row, 'inputVisible', true);
      this.$set(row, 'inputValue', '');
    },
    // el-input 失去焦点的事件
    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue } = row;
      if (inputValue.trim() == '') {
        this.$message('属性值不能为空');
        row.inputVisible = false;
        return;
      }
      let result = row.spuSaleAttrValueList.every(
        (item) => item.saleAttrValueName != inputValue
      );
      if (!result) {
        this.$message('属性值重复了');
        row.inputVisible = false;
        return;
      }
      let newSaleAttrValue = {
        baseSaleAttrId,
        saleAttrValueName: inputValue,
      };
      row.spuSaleAttrValueList.push(newSaleAttrValue);
      row.inputVisible = false;
    },
    // 保存按钮的回调
    async addOrUpdateSpu() {
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imageName: item.name,
          imgUrl: (item.response && item.response.data) || item.url,
        };
      });
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if (result.code == 200) {
        this.$message({
          type: 'success',
          message: '保存成功',
        });
        this.$emit('changeScene', {
          scene: 0,
          flag: this.spu.id? '修改' : '添加'
        });
      }
      // 清除数据
      Object.assign(this._data, this.$options.data());
    },
    // 点击添加SPU按钮的时候，发请求的函数
    async addSpuData(category3Id) {
      this.spu.category3Id = category3Id;
      // 获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      // 获取平台全部的销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    // 取消按钮
    cancel() {
      this.$emit('changeScene', {
        scene: 0,
        flag: ''
      });
      // this._data 是当前组件的 data 对象
      // this.$options 是当前组件的配置对象
      // this.$options.data 是当前组件的配置对象的 data 方法，它会返回当前组件最初始的 data 对象
      Object.assign(this._data, this.$options.data());
    }
  },
  computed: {
    // 计算出还未选择的销售属性
    unSelectSaleAttr() {
      let result = this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
      return result;
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>