<template>
  <el-table :data="data" border style="width: 100%" :row-style="showTr">
    <el-table-column align="left" v-for="(column, index) in columns" :key="column.dataIndex" :label="column.text" :type="column.type">
      <template scope="scope">
        <span v-if="spaceIconShow(index)" v-for="(space, levelIndex) in scope.row._level" class="ms-tree-space" :key="levelIndex"></span>
        <button style="border:0;background:transparent;outline:none;" class="button is-outlined is-primary is-small " v-if="toggleIconShow(index,scope.row)" @click="toggle(scope.$index)">
          <i v-if="!scope.row._expanded" class="iconfont novice-icon-shuangyoujiantou-" aria-hidden="true"></i>
          <i v-else class="iconfont novice-icon-shuangxiajiantou- el-table__expand-icon--expanded" aria-hidden="true"></i>
        </button>
        <span v-else-if="index===0" class="ms-tree-space"></span>
        {{scope.row[column.dataIndex]}}
      </template>
    </el-table-column>
    <el-table-column align="left" label="操作" v-if="operate" width="260">
      <template slot-scope="scope">
        <el-button type="info" icon="el-icon-edit" circle plain @click="$emit('update',scope.row)"></el-button>
        <el-button type="danger" icon="el-icon-delete" circle plain @click="$emit('remove',scope.row)"></el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import utils from "./index";
export default {
  name: "tree-grid",
  props: {
    // 这是相应的字段展示
    columns: Array,
    // 这是数据源
    dataSource: Array,
    // 这个是是否展示操作列
    operate: Boolean,
    // 是否默认展开所有树
    expandAll: Boolean
  },
  data() {
    return {};
  },
  computed: {
    // 格式化数据源
    data: function() {
      return utils.treeToArray(this.dataSource, null, null, this.expandAll);
    }
  },
  watch: {
    expandAll: function() {
      if (this.expandAll) {
        this.data.forEach(row => (row._expanded = true));
      } else {
        this.data.forEach(row => (row._expanded = false));
      }
    }
  },
  methods: {
    // 显示行
    showTr: function(data) {
      let row = data.row;
      let show = row._parent
        ? row._parent._expanded && row._parent._show
        : true;
      row._show = show;
      return show ? "" : "display:none;";
    },
    // 展开下级
    toggle: function(trIndex) {
      let record = this.data[trIndex];
      record._expanded = !record._expanded;
    },
    // 显示层级关系的空格和图标
    spaceIconShow(index) {
      return index === 0;
    },
    // 点击展开和关闭的时候，图标的切换
    toggleIconShow(index, record) {
      return index === 0 && record.children && record.children.length > 0;
    },
    handleDelete() {}
  }
};
</script>
<style scoped>
.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-family: "Glyphicons Halflings";
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: 18px;
  height: 14px;
}
.ms-tree-space::before {
  content: "";
}
table td {
  line-height: 26px;
}
.el-table__expand-icon--expanded {
  -ms-transform: rotate(90deg);
  transform: rotate(90deg);
}
</style>
