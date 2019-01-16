<template>

  <div>
    <el-row>
      <el-col align="left">
        <h1>{{type.name}} ({{type.id}})/ {{type.displayAs}}</h1>
      </el-col>
    </el-row>
    <el-tabs v-model="selectTab">
      <el-tab-pane
        label="字段设置"
        name="column"
      >
        <column-list :type="type"></column-list>
      </el-tab-pane>
      <el-tab-pane
        label="视图设置"
        name="view"
      >
        <el-row>
          视图设置
        </el-row>
      </el-tab-pane>
      <el-tab-pane
        label="业务设置"
        name="business"
      >
        <el-row>
          业务设置
        </el-row>
      </el-tab-pane>
      <el-tab-pane
        label="动作设置"
        name="action"
      >
        <el-row>
          动作设置
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ColumnList from "@/components/ColumnList.vue";
export default {
  name: "TypeSetting",
  components: {
    ColumnList
  },
  props: {
    type: Object
  },
  data() {
    return {
      selectTab: "column"
    };
  },
  mounted() {},
  methods: {}
};
</script>
<style>
.icon-normal {
  color: rgb(16, 230, 16);
  font-size: 18px;
}

.icon-override {
  color: red;
  font-size: 18px;
}

.icon-extends {
  color: yellow;
  font-size: 18px;
}
</style>
