<template>
  <el-container v-loading.fullscreen.lock="metaLoading">
    <el-aside width="200px">
      <el-menu
        :default-active="menuActive"
        class="el-menu-vertical-demo"
        @select="handleSelect"
      >
        <el-menu-item
          v-for="menu in menus"
          :index="menu.name"
          :key="menu.name"
        >
          <i :class="menu.icon"></i>
          <span slot="title">{{menu.title}}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <!-- <el-header>

      </el-header> -->
      <el-main>
        <el-tabs
          v-if="selectTab"
          v-model="selectTab"
          type="card"
          closable
          @tab-remove="removeAdminTab"
        >
          <el-tab-pane
            :key="item.key"
            v-for="(item) in adminTabs"
            :label="item.name"
            :name="item.key"
          >
            <ModuleList v-if="item.type==='module'" />
            <TypeList
              v-else-if="item.type==='typeList'"
              :module="item.module"
            />
            <TypeSetting
              v-else-if="item.type==='typeSetting'"
              :type="item.selectType"
            />
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </el-container>

</template>
<script>
import ModuleList from "@/components/dm/module/ModuleList";
import TypeList from "@/components/dm/type/TypeList";
import TypeSetting from "@/components/dm/type/TypeSetting";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "Admin",
  components: {
    ModuleList,
    TypeList,
    TypeSetting
  },
  data() {
    return {
      menuActive: "",
      selectTab: "",
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
  computed: {
    ...mapGetters(["adminTabs", "adminSelectTab", "metaLoading"])
  },
  watch: {
    selectTab(value) {
      if (value !== this.adminSelectTab) {
        this.changeAdminSelectTab(value);
      }
    },
    adminSelectTab(value) {
      this.selectTab = value;
      this.menuActive = value.split("-")[0];
    }
  },
  methods: {
    ...mapActions([
      "pushAdminTab",
      "removeAdminTab",
      "changeAdminSelectTab",
      "loadMeta"
    ]),
    handleSelect(key) {
      let tab = this.adminTabs.find(tab => tab.key === key);
      if (tab) {
        this.changeAdminSelectTab(tab.key);
      } else {
        this.pushAdminTab({
          key: key,
          name: this.findMenuTitleByName(key),
          type: key
        });
      }
    },
    findMenuTitleByName(name) {
      let menu = this.menus.find(menu => name === menu.name);
      return menu ? menu.title : name;
    }
  },
  created: function() {
    this.loadMeta(true);
  },
  mounted: function() {
    this.selectTab = this.adminSelectTab;
    this.menuActive = this.selectTab.split("-")[0];
  }
};
</script>

