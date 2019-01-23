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
          @click="create"
        >添加</el-button>
        <el-button
          icon="el-icon-refresh"
          plain
          size="small"
          @click="list"
        >刷新</el-button>
      </el-col>
    </el-row>
    <el-collapse v-model="activeNames">
      <el-collapse-item
        title="列表视图"
        name="list"
      >
        <view-table
          :list="listViews"
          :typeId="type.id"
          ref="listTable"
          @list="list"
        ></view-table>
      </el-collapse-item>
      <el-collapse-item
        title="详情视图"
        name="detail"
      >
        <view-table
          :list="detailViews"
          :typeId="type.id"
          ref="detailTable"
          @list="list"
        ></view-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import api from "@/api/view";
import ViewTable from "@/components/ViewTable";
export default {
  name: "ViewList",
  components: { ViewTable },
  props: {
    type: Object
  },
  data() {
    return {
      activeNames: ["list", "detail"],
      listViews: [],
      detailViews: []
    };
  },
  methods: {
    list() {
      api.listGroupByViewType(this.type.id).then(res => {
        this.listViews = res.data.body.list;
        this.detailViews = res.data.body.detail;
      });
    },
    create() {
      this.$refs["listTable"].create();
    }
  },
  created() {
    this.list();
  }
};
</script>

<style lang="less">
.el-collapse-item__content {
  padding-bottom: 0;
}
.el-collapse {
  text-align: left;
}
</style>


