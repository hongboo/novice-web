<template>
  <el-container>
    <el-aside width="200px">
      <el-menu default-active="2" class="el-menu-vertical-demo" @select="handleSelect">
        <el-submenu index="develop">
          <template slot="title">
            <!-- <i class="iconfont novice-icon-zhinengyouhua"></i> -->
            <i class="el-icon-menu"></i>
            <span>智能开发</span>
          </template>
          <el-menu-item index="module">模块管理</el-menu-item>
          <el-menu-item index="schdule">计划任务</el-menu-item>
        </el-submenu>
        <el-submenu index="userManager">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>用户管理</span>
          </template>
          <el-menu-item index="user">用户</el-menu-item>
          <el-menu-item index="role">角色</el-menu-item>
        </el-submenu>
        <el-submenu index="system">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span>系统管理</span>
          </template>
          <el-menu-item index="menu">菜单管理</el-menu-item>
          <el-menu-item index="config">系统配置</el-menu-item>
          <el-menu-item index="category">数据字典</el-menu-item>
        </el-submenu>
        <el-menu-item index="four">
          <i class="el-icon-view"></i>
          <span slot="title">导航四</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <!-- <el-header>

      </el-header> -->
      <el-main>
        <el-tabs v-model="tabValue" type="card" closable @tab-remove="removeTab">
          <el-tab-pane :key="item.key" v-for="(item) in tabs" :label="item.name" :name="item.key">
            <Module v-if="item.type=='module'" @addTab="addTab" />
            <TypeList v-if="item.type=='typeList'" @watchChild="addTab" :module="item.module" />
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </el-container>

</template>
<script>
import Module from "@/components/Module.vue";
import TypeList from "@/components/TypeList.vue";
export default {
  name: "work",
  components: {
    Module,
    TypeList
  },
  data() {
    return {
      tabValue: "module",
      tabs: [
        {
          key: "module",
          name: "模块管理",
          type: "module"
        }
      ]
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      for (const i in this.tabs) {
        const element = this.tabs[i];
        if (key == element.key) {
          this.tabValue = key;
          return;
        }
      }
      this.addTab({
        key: key,
        name: key,
        type: key
      });
    },
    addTab(tab) {
      for (const i in this.tabs) {
        const element = this.tabs[i];
        if (tab.key == element.key) {
          this.tabValue = tab.key;
          return;
        }
      }
      this.tabs.push(tab);
      this.tabValue = tab.key;
    },
    removeTab(targetIndex) {
      let tabs = this.tabs;
      let tabValue = this.tabValue;
      if (tabValue === targetIndex) {
        tabs.forEach((tab, index) => {
          if (tab.key === targetIndex) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              tabValue = nextTab.key;
            }
          }
        });
      }
      this.tabValue = tabValue;
      this.tabs = tabs.filter(tab => tab.key !== targetIndex);
    }
  }
};
</script>
