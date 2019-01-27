<template>

  <div>
    <el-row class="tab-title">
      <el-col align="left">
        {{type.name}} ({{type.id}})/ {{type.displayAs}}
      </el-col>
    </el-row>
    <el-tabs v-model="selectTab">
      <el-tab-pane
        label="字段设置"
        name="field"
      >
        <field-list :type="type"></field-list>
      </el-tab-pane>
      <el-tab-pane
        label="视图设置"
        name="view"
      >
        <view-list :type="type"></view-list>
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
import FieldList from "@/components/dm/field/FieldList";
import ViewList from "@/components/dm/view/ViewList";
export default {
  name: "TypeSetting",
  components: {
    FieldList,
    ViewList
  },
  props: {
    type: Object
  },
  data() {
    return {
      selectTab: "field"
    };
  },
  mounted() {},
  methods: {}
};
</script>
