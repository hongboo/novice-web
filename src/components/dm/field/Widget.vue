<template>
  <el-form :model="widget" status-icon label-width="80px" size="small">
    <el-form-item label="输入控件" prop="editor">
      <el-select
        v-model="widget.editor"
        filterable
        clearable
        allow-create
        default-first-option
        placeholder="选择控件"
      >
        <el-option
          v-for="item in componentList"
          :key="item.value"
          :label="item.display"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="显示控件" prop="displayer">
      <el-select
        v-model="widget.displayer"
        filterable
        clearable
        allow-create
        default-first-option
        placeholder="选择控件"
      >
        <el-option
          v-for="item in componentList"
          :key="item.value"
          :label="item.display"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="查询控件" prop="searcher" v-if="!hiddenSearch">
      <el-select
        v-model="widget.searcher"
        filterable
        clearable
        allow-create
        default-first-option
        placeholder="选择控件"
      >
        <el-option
          v-for="item in componentList"
          :key="item.value"
          :label="item.display"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="只读" prop="readOnly">
      <el-switch v-model="widget.readOnly"></el-switch>
    </el-form-item>
    <el-form-item label="允许为空" prop="allowBlank">
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
  methods: {},
  mounted() {}
};
</script>
<style lang="less" scoped>
div.el-form-item {
  margin-bottom: 13px;
}
</style>


