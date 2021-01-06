<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
        show-icon
        :closable="false"
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
      >
      </el-alert>
      <el-row>
        <el-col class="cat_opt">
          <span>选择商品分类:</span>
          <el-cascader
            v-model="selectCateKeys"
            :options="cateList"
            :props="catProps"
            @change="cateKeysChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="paramsActiveName" @tab-click="paramsHandleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button :disabled="isBtnDisabled" type="primary" size="mini"
            >添加参数</el-button
          >
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button :disabled="isBtnDisabled" type="primary" size="mini"
            >添加参数</el-button
          >
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      selectCateKeys: [],
      catProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      paramsActiveName: "many",
      manyTableData: [],
      onlyTableData: [],
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200)
        return this.$message.error("获取商品列表数据失败！");
      // console.log(res.data)
      this.cateList = res.data;
    },
    cateKeysChange() {
      this.getParamsData();
    },
    paramsHandleClick() {
      console.log(this.paramsActiveName);
      this.getParamsData();
    },
    async getParamsData() {
      if (this.selectCateKeys.length !== 3) {
        this.selectCateKeys = [];
        return;
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.paramsActiveName },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数列表失败！");
      }
      console.log(res.data);
      if (this.paramsActiveName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },
  },
  computed: {
    isBtnDisabled() {
      if (this.selectCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    cateId() {
      if (this.selectCateKeys.length === 3) {
        return this.selectCateKeys[2];
      }
      return null;
    },
  },
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
</style>
