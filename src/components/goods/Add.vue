<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 消息提示 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 步骤条组件 -->
      <!-- align-center(居中效果) -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 选择商品分类的级联选择框 -->
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              :key="item.attr_id"
              v-for="item in manyTableData"
            >
              <!-- 使用数组渲染复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="val"
                  v-for="(val, i) in item.attr_vals"
                  :key="i"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <!-- 循环生成静态属性 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 商品图片上传
  action:指定图片上传api接口
  :on-preview ： 当点击图片时会触发该事件进行预览操作,处理图片预览
  :on-remove : 当用户点击图片右上角的X号时触发执行
  :on-success：当用户点击上传图片并成功上传时触发
  list-type ：设置预览图片的方式为缩略图
  :headers ：设置上传图片的请求头,主要是token -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="btnAdd" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="20%">
      <img :src="previewPath" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
//官方推荐将lodash导入为_
import _ from "lodash";

export default {
  data() {
    return {
      activeIndex: "0",
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: "",
        pics: [],
        goods_introduce: "",
        attrs: [],
      },
      cateList: [],
      addFormRules: {
        goods_name: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur",
          },
        ],
      },
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      manyTableData: [],
      onlyTableData: [],
      uploadURL: "http://127.0.0.1:8888/api/private/v1/upload",
      headerObj: { Authorization: window.sessionStorage.getItem("token") },
      previewPath: "",
      previewVisible: false,
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");

      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类数据失败");
      }
      console.log(res.data);
      this.cateList = res.data;
    },
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
        return;
      }
      console.log(this.addForm.goods_cat);
    },
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === "0") {
        //在第一个标签页的时候
        if (this.addForm.goods_cat.length !== 3) {
          this.$message.error("请选择商品的分类");
          return false;
        }
      }
    },
    async tabClicked() {
      //当用户点击切换tab栏时触发
      if (this.activeIndex === "1") {
        //发送请求获取动态参数
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "many" },
          }
        );

        if (res.meta.status !== 200) {
          return this.$message.error("获取动态参数列表失败");
        }
        //将attr_vals字符串转换为数组,这样 manyTableData里面的attr_vals也是数组
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        console.log(res.data);
        this.manyTableData = res.data;
      } else if (this.activeIndex === "2") {
        //发送请求获取静态属性
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "only" },
          }
        );

        if (res.meta.status !== 200) {
          return this.$message.error("获取静态属性列表失败");
        }

        console.log(res.data);
        this.onlyTableData = res.data;
      }
    },
    handlePreview(file) {
      console.log(file);
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
    },
    handleRemove(file) {
      // console.log(file)
      // 获取用户点击删除的那个图片的临时路径
      const filePath = file.response.data.tmp_path;
      // 使用findIndex来查找符合条件的索引  item就是pics
      const index = this.addForm.pics.findIndex(
        (item) => item.pic === filePath
      );
      // 移除索引对应的图片
      this.addForm.pics.splice(index, 1);
      console.log(this.addForm);
    },
    handleSuccess(response) {
      // console.log(response)
      // 当上传成功时触发执行
      // 形参response就是上传成功之后服务器返回的结果
      // 将服务器返回的临时路径保存到addForm表单的pics数组中
      this.addForm.pics.push({ pic: response.data.tmp_path });
      console.log(this.addForm);
    },
    add() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error("请填写必要的表单项!");

        //将addForm进行深拷贝，避免goods_cat数组转换字符串之后导致级联选择器报错
        const form = _.cloneDeep(this.addForm);
        //将goods_cat从数组转换为"1,2,3"字符串形式
        form.goods_cat = form.goods_cat.join(",");
        //处理attrs数组，数组中需要包含商品的动态参数和静态属性
        //将manyTableData（动态参数）处理添加到attrs
        this.manyTableData.forEach((item) => {
          form.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          });
        });
        //将onlyTableData（静态属性）处理添加到attrs
        this.onlyTableData.forEach((item) => {
          form.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          });
        });
        const { data: res } = await this.$http.post("goods", form);
        if (res.meta.status !== 201) {
          return this.$message.error("添加商品失败");
        }
        this.$message.success("添加商品成功");
        //编程式导航跳转到商品列表
        this.$router.push("/goods");
        console.log(form);
      });
    },
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
};
</script>


<style lang="less" scoped>
.el-steps {
  margin: 15px 0;
}
.el-step__title {
  font-size: 13px;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}

.previewImg {
  width: 100%;
}

.btnAdd {
  margin-top: 15px;
}
</style>
