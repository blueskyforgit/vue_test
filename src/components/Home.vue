<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened = "true"
          :collapse = "isCollapse"
          :collapse-transition = "false"
          :router = "true"
          :default-active="activePath"
        >
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item @click="saveNavState('/' + subItem.path)" :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" >
              <i class="el-icon-menu"></i>
              <span>{{subItem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {

  data(){
      return{
          menulist:[],
          iconsObj:{
              125:'iconfont icon-user',
              103:'iconfont icon-3702mima',
              101:'iconfont icon-shangpin',
              102:'iconfont icon-danju',
              145:'iconfont icon-tijikongjian'
          },
          isCollapse:false,
          activePath:''
      }
  },

  created(){
      this.getMenuList();
      this.activePath = window.sessionStorage.getItem('activePath');
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList(){
        // 给data命名为res
        const {data:res} = await this.$http.get('menus');
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.menulist = res.data
     },
     toggleCollapse(){
         this.isCollapse = !this.isCollapse
     },
     saveNavState(activePath){
        window.sessionStorage.setItem('activePath',activePath);
        this.activePath = activePath
     }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu{
      border-right:0;
  }
}

.el-main {
  background-color: #eaedf1;
}

.toggle-button{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>
