<template>
  <el-form
    :model="widget"
    status-icon
    label-width="80px"
    size="small"
  >
    <el-form-item
      label="输入控件"
      prop="editor"
    >
      <el-autocomplete
        v-model="widget.editor"
        clearable
        :fetch-suggestions="queryCom"
      ></el-autocomplete>
    </el-form-item>
    <el-form-item
      label="显示控件"
      prop="displayer"
    >
      <el-autocomplete
        v-model="widget.displayer"
        clearable
        :fetch-suggestions="queryCom"
      ></el-autocomplete>
    </el-form-item>
    <el-form-item
      label="查询控件"
      prop="searcher"
      v-if="!hiddenSearch"
    >
      <el-autocomplete
        v-model="widget.searcher"
        clearable
        :fetch-suggestions="queryCom"
      ></el-autocomplete>
    </el-form-item>
    <el-form-item
      label="只读"
      prop="readOnly"
    >
      <el-switch v-model="widget.readOnly"></el-switch>
    </el-form-item>
    <el-form-item
      label="允许为空"
      prop="allowBlank"
    >
      <el-switch v-model="widget.allowBlank"></el-switch>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Widget",
  props: {
    widget: Object,
    hiddenSearch: Boolean
  },
  computed: {
    ...mapGetters(["loadEnum"]),
    componentList() {
      return this.loadEnum("com.novice.framework.datamodel.enums.Component");
    }
  },
  data() {
    return {};
  },
  methods: {
    queryCom(queryString, cb) {
      var results = queryString
        ? this.componentList.filter(
            com =>
              com.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
          )
        : this.componentList;
      cb(results);
    }
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
div.el-form-item {
  margin-bottom: 13px;
}
</style>


