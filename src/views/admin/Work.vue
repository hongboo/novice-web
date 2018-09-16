<template>
  <el-container>
    <el-aside width="200px">
      <el-menu :default-active="active" class="el-menu-vertical-demo" @select="handleSelect">
        <el-menu-item v-for="menu in menus" :index="menu.name" :key="menu.name">
          <i :class="menu.icon"></i>
          <span slot="title">{{menu.title}}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <!-- <el-header>

      </el-header> -->
      <el-main>
        <el-tabs v-if="selectTab" v-model="selectTab" type="card" closable @tab-remove="removeTab">
          <el-tab-pane :key="item.key" v-for="(item) in tabs" :label="item.name" :name="item.key">
            <Module v-if="item.type=='module'" @addTab="addTab" />
            <Table v-if="item.type=='table'" @addTab="addTab" :module="item.module" />
            <TableSetting v-if="item.type=='tableSetting'" :table="item.selectTable" />
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </el-container>

</template>
<script>
import Module from "@/components/Module.vue";
import Table from "@/components/Table.vue";
import TableSetting  from "@/components/TableSetting.vue";
export default {
  name: "work",
  components: {
    Module,
    Table,
    TableSetting
  },
  data() {
    return {
      selectTab: "",
      tabs: [],
      active: "",
      menus: [
        {
          name: "module",
          title: "动态建模",
          icon: "big-iconfont novice-icon-zhinengyouhua"
        },
        {
          name: "schdule",
          title: "计划任务",
          icon: "big-iconfont novice-icon-shijian"
        },
        {
          name: "user",
          title: "用户管理",
          icon: "big-iconfont novice-icon-geren"
        },
        {
          name: "menu",
          title: "菜单管理",
          icon: "big-iconfont novice-icon-listview"
        },
        {
          name: "config",
          title: "系统配置",
          icon: "big-iconfont novice-icon-xitongcaidan"
        },
        {
          name: "category",
          title: "数据字典",
          icon: "big-iconfont novice-icon-database"
        }
      ]
    };
  },
  methods: {
    handleSelect(key) {
      for (const i in this.tabs) {
        const element = this.tabs[i];
        if (key == element.key) {
          this.selectTab = key;
          return;
        }
      }
      this.addTab({
        key: key,
        name: this.findMenuTitleByName(key),
        type: key
      });
    },
    findMenuTitleByName(name) {
      for (const key in this.menus) {
        let menu = this.menus[key];
        if (name == menu.name) {
          return menu.title;
        }
      }
      return name;
    },
    addTab(tab) {
      for (const i in this.tabs) {
        const element = this.tabs[i];
        if (tab.key == element.key) {
          this.selectTab = tab.key;
          return;
        }
      }
      this.tabs.push(tab);
      this.selectTab = tab.key;
    },
    removeTab(targetIndex) {
      let tabs = this.tabs;
      let selectTab = this.selectTab;
      if (selectTab === targetIndex) {
        tabs.forEach((tab, index) => {
          if (tab.key === targetIndex) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              selectTab = nextTab.key;
            }
          }
        });
      }
      this.selectTab = selectTab;
      this.tabs = tabs.filter(tab => tab.key !== targetIndex);
    }
  },
  watch: {
    selectTab: function() {
      this.active = this.selectTab.split("-")[0];
      sessionStorage.setItem("selectTab", this.selectTab);
    },
    tabs: value => {
      sessionStorage.setItem("tabs", JSON.stringify(value));
    }
  },
  mounted: function() {
    let tabsStr = sessionStorage.getItem("tabs");
    if (tabsStr) {
      this.tabs = JSON.parse(tabsStr);
    }
    let selectTab = sessionStorage.getItem("selectTab");
    if (selectTab) {
      this.selectTab = selectTab;
    }
  }
};
</script>

