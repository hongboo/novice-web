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
        <component
          v-bind:is="currentBusiness.renderer"
          v-if="currentBusiness"
          :business="currentBusiness"
        ></component>
      </el-main>
    </el-container>
  </el-container>

</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Home",
  components: {},
  data() {
    return {
      menuActive: "",
      selectTab: "",
      menus: [
        {
          name: "test",
          title: "测试",
          icon: "big-iconfont novice-icon-zhinengyouhua"
        },
        {
          name: "test2",
          title: "测试2",
          icon: "big-iconfont novice-icon-shijian"
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["loadStatus", "currentBusiness", "childBusinesses"]),
    businessName() {
      return this.$route.query.business;
    },
    paramsStr() {
      return this.$route.query.params;
    }
  },
  watch: {
    businessName() {
      this.exceute();
    },
    paramsStr() {
      this.exceute();
    }
  },
  methods: {
    ...mapActions(["loadMetaAsync", "executeBusiness"]),
    handleSelect(key) {
      console.log(key);
    },
    exceute() {
      if (this.businessName) {
        let paramsStr = this.paramsStr;
        let params = paramsStr ? JSON.parse(paramsStr) : {};
        this.executeBusiness({ name: this.businessName, params: params });
      }
    }
  },
  created() {
    this.loadMetaAsync(true).then(() => {
      this.exceute();
    });
  },
  mounted() {}
};
</script>

<style lang="less">
.panel-title {
  font-size: 22px;
  text-transform: uppercase;
  padding: 0 0 5px;
  margin-bottom: 5px;
  color: #414c59;
}
.panel-body {
  padding: 15px 20px;
  margin-bottom: 20px;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  box-shadow: 2px 2px 3px #f1efef;
}
.content-box {
  margin-bottom: 20px;
  border: 1px solid #e6e6e6;
  border-radius: 3px;
  box-shadow: 1px 1px 1px #f1efef;
}
.content-box-header {
  font-size: 16px;
  text-transform: uppercase;
  margin: -1px -1px 0;
  padding: 10px;
  border: 1px solid #e6e6e6;
  border-radius: 3px;
}
.content-box-wrapper {
  padding: 15px;
}
.none-content-border {
  border: none;
  box-shadow: none;
}
.bg-default {
  min-height: 1px;
  background: #ffffff;
}
.wrapper-row {
  margin-bottom: 18px;
  &:last-child {
    margin-bottom: 10px;
  }
}
.dm-component {
  text-align: center;
}
.dm-label {
  line-height: 40px;
  text-align: right;
  max-width: 85px;
}
.dm-component.required .dm-label:before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}
.dm-error {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  top: 100%;
  text-align: left;
}
</style>
