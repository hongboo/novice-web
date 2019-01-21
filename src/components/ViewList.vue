<template>
  <div>
    <el-row>
      <el-col
        :span="6"
        class="table-operate"
        align="left"
      >
        <el-button
          type="primary"
          icon="el-icon-circle-plus"
          size="small"
          plain
        >添加</el-button>
        <el-button
          icon="el-icon-refresh"
          plain
          size="small"
        >刷新</el-button>
      </el-col>
    </el-row>
    <el-collapse
      v-model="activeNames"
      @change="handleChange"
    >
      <el-collapse-item
        title="列表视图"
        name="list"
      >
        <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
        <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
      </el-collapse-item>
      <el-collapse-item
        title="详情视图"
        name="detail"
      >
        <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
        <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import api from "@/api/view";
export default {
  name: "ViewList",
  props: {
    type: Object
  },
  data() {
    return {
      activeNames: ["list", "detail"]
    };
  },
  methods: {
    handleChange(val) {
      console.log(val);
    }
  },
  created() {
    api.listGroupByViewType({ typeId: "" }).then(res => {
      console.log(res);
    });
  }
};
</script>

<style lang="less">
.el-collapse {
  text-align: left;
}
</style>


