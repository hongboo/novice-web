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
          @click="create(item.key)"
          v-for="(item,index) in viewTypeList"
          :key="index"
        >添加{{item.name}}</el-button>
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
        :title="`${item.name}视图`"
        :name="item.key"
        v-for="(item,index) in viewTypeList"
        :key="index"
      >
        <view-table
          :list="data[item.key]"
          :typeId="type.id"
          :viewType="item.key"
          v-if="data[item.key]"
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
      viewTypeList: [
        { key: "List", name: "列表" },
        { key: "Detail", name: "详情" }
      ],
      activeNames: [],
      data: {}
    };
  },
  methods: {
    list() {
      api.listGroupByViewType(this.type.id).then(res => {
        for (const key in this.viewTypeList) {
          let e = this.viewTypeList[key].key;
          this.$set(this.data, e, res.data.body[e]);
        }
      });
    },
    create(viewType) {
      console.log(viewType);
    }
  },
  created() {
    this.list();
  },
  mounted() {
    let that = this;
    setTimeout(() => {
      for (const key in that.viewTypeList) {
        that.activeNames.push(that.viewTypeList[key].key);
      }
    }, 1);
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


