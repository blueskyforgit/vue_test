<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-tex="#"
        border
        class="treeTable"
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-circle-check"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-circle-close" v-else style="color: red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" v-if="scope.row.cat_level === 1" type="danger"
            >二级</el-tag
          >
          <el-tag size="mini" v-if="scope.row.cat_level === 2" type="warning"
            >三级</el-tag
          >
        </template>
        <template slot="opt">
          <el-button type="primary" size="mini" icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button type="danger" size="mini" icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 7, 9]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <el-form
        ref="addCateDialogFormRef"
        :model="addCateDialogForm"
        :rules="addCateDialogFormRules"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateDialogForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentsCateList"
            :props="cascaderParents"
            @change="parentsCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有限",
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
      addCateDialogVisible: false,
      addCateDialogForm: {
        cat_pid: 0,
        cat_name: "",
        cat_level: 0,
      },
      addCateDialogFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      parentsCateList: [],
      cascaderParents: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover", // 展开的方式
        checkStrictly: "true", // 可以选中任意一级
      },
      selectedKeys: [],
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类数据失败");
      console.log(res.data.result);
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    handleCurrentChange(newPageNum) {
      this.queryInfo.pagenum = newPageNum;
      this.getCateList();
    },
    showAddCateDialog() {
      this.getParentsCateList();
      this.addCateDialogVisible = true;
    },
    async getParentsCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取商品父类分类列表数据失败");
      console.log(res.data);
      this.parentsCateList = res.data;
    },
    parentsCateChange() {
      console.log(this.selectedKeys);
      if (this.selectedKeys.length > 0) {
        this.addCateDialogForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        this.addCateDialogForm.cat_level = this.selectedKeys.length;
      } else {
        this.addCateDialogForm.cat_pid = 0;
        this.addCateDialogForm.cat_level = 0;
      }
    },
    addCate() {
      this.$refs.addCateDialogFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error("验证失败！");
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateDialogForm
        );
        if (res.meta.status !== 201) return this.$message.error("添加分类失败");
        this.$message.success("添加分类成功！");
        this.getCateList();
      });
      this.addCateDialogVisible = false;
    },
    addCateDialogClosed() {
      this.$refs.addCateDialogFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateDialogForm.cat_level = 0;
      this.addCateDialogForm.cat_pid = 0;
    },
  },
};
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
