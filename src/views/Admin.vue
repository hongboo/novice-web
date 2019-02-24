<template>
  <el-container v-loading.fullscreen.lock="loadStatus==='loading'">
    <el-header></el-header>
    <el-container>
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
    <context-menu ref="ctxMenu">
      <li @click="close()">关闭</li>
      <li @click="closeOthers()">关闭其他</li>
    </context-menu>

  </el-container>

</template>
<script>
import ModuleList from "@/components/dm/module/ModuleList";
import TypeList from "@/components/dm/type/TypeList";
import TypeSetting from "@/components/dm/type/TypeSetting";
import { mapGetters, mapActions } from "vuex";
import ContextMenu from "vue-context-menu";
export default {
  name: "Admin",
  components: {
    ModuleList,
    TypeList,
    TypeSetting,
    ContextMenu
  },
  data() {
    return {
      menuActive: "",
      selectTab: "",
      menus: [
        {
          name: "dm@module",
          title: "动态建模",
          icon: "big-iconfont novice-icon-zhinengyouhua"
        },
        {
          name: "dm@schdule",
          title: "计划任务",
          icon: "big-iconfont novice-icon-shijian"
        },
        {
          name: "dm@user",
          title: "用户管理",
          icon: "big-iconfont novice-icon-geren"
        },
        {
          name: "dm@menu",
          title: "菜单管理",
          icon: "big-iconfont novice-icon-listview"
        },
        {
          name: "dm@config",
          title: "系统配置",
          icon: "big-iconfont novice-icon-xitongcaidan"
        },
        {
          name: "dm@category",
          title: "数据字典",
          icon: "big-iconfont novice-icon-database"
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["adminTabs", "adminSelectTab", "loadStatus"])
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
    },
    adminTabs() {
      this.syncContextMenu();
    }
  },
  methods: {
    ...mapActions([
      "pushAdminTab",
      "removeAdminTab",
      "changeAdminSelectTab",
      "loadMetaAsync",
      "setAdminTabs"
    ]),
    syncContextMenu() {
      let that = this;
      setTimeout(() => {
        document.querySelectorAll('div[id^="tab-dm@"]').forEach(d => {
          d.style.userSelect = "none";
          d.oncontextmenu = () => {
            that.selectTab = d.id.replace("tab-", "");
            that.$refs.ctxMenu.open();
            return false;
          };
        });
      }, 1);
    },
    close() {
      this.removeAdminTab(this.selectTab);
    },
    closeOthers() {
      let tab = this.adminTabs.find(tab => tab.key === this.selectTab);
      this.setAdminTabs([tab]);
    },
    handleSelect(key) {
      let tab = this.adminTabs.find(tab => tab.key === key);
      if (tab) {
        this.changeAdminSelectTab(tab.key);
      } else {
        this.pushAdminTab({
          key: key,
          name: this.findMenuTitleByName(key),
          type: key.replace("dm@", "")
        });
      }
    },
    findMenuTitleByName(name) {
      let menu = this.menus.find(menu => name === menu.name);
      return menu ? menu.title : name;
    }
  },
  created() {
    this.loadMetaAsync(true);
  },
  mounted() {
    this.selectTab = this.adminSelectTab;
    this.menuActive = this.selectTab.split("-")[0];
    this.syncContextMenu();
  }
};
</script>

<style lang="less">
.ctx-menu {
  min-width: 125px !important;
  padding: unset;
  background-color: #f1f1f1;
  li {
    text-align: center;
    border-bottom: 1px solid #ccc;
    line-height: 32px;
    &:last-child {
      border-bottom: none;
    }
  }
  li:hover {
    cursor: pointer;
    background-color: #909399;
  }
}
</style>
