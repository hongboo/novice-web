<template>
  <div>
    <div class="panel-title">
      {{ business.title }}
    </div>
    <div class="panel-body">
      <div class="content-box" v-if="conditionFields.length > 0">
        <div class="content-box-header">
          查询条件
        </div>
        <div class="content-box-wrapper">
          <el-row
            class="condition-row"
            :gutter="20"
            v-for="i in parseInt((conditionFields.length + 1) / 2)"
            :key="i"
          >
            <el-col
              :span="12"
              v-for="j in conditionFields.length / 2 > i ? 2 : 1"
              :key="j"
              :tmp="(field = conditionFields[2 * i + j - 3])"
            >
              <component
                v-bind:is="field.searcher"
                :label="field.displayAs"
                :name="field.name"
                :ref="`dm-${field.name}`"
              ></component>
            </el-col>
          </el-row>
          <div class="search-gourp">
            <el-button size="small" type="primary">查询</el-button>
            <el-button size="small">重置</el-button>
          </div>
        </div>
      </div>
      <el-row class="table-operate">
        <el-button
          v-for="item in business.operations"
          :type="item.level.toLowerCase()"
          :plain="item.plain"
          :round="item.round"
          :key="item.id"
          :disabled="!operationAvailable(item, selectRow)"
          size="small"
          @click="executeOperation(item)"
          >{{ item.name }}</el-button
        >
        <el-button icon="el-icon-refresh" plain size="small" @click="refresh"
          >刷新</el-button
        >
      </el-row>
      <el-table
        size="small"
        :data="data"
        v-loading="loading"
        border
        stripe
        highlight-current-row
        max-height="600"
        style="width: 100%"
        ref="table"
        @current-change="handleCurrentChange"
        @row-dblclick="dblclick"
      >
        <el-table-column
          :label="field.displayAs"
          :width="field.realWidth"
          v-for="field in rowFields"
          :key="field.name"
        >
          <template slot-scope="scope">
            {{ scope.row.properties[field.name] }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import Renderer from "./Renderer";
export default {
  extends: Renderer,
  name: "ListRenderer",
  data() {
    return {
      data: [],
      loading: false,
      selectRow: null
    };
  },
  computed: {
    conditionFields() {
      return this.business.view.conditionFields;
    },
    rowFields() {
      return this.business.view.rowFields;
    }
  },
  methods: {
    refresh() {
      let that = this;
      this.executeInitAction({}, data => {
        that.data = data;
        that.selectRow = null;
      });
    },
    getOperationParams() {
      return this.selectRow ? { entityId: this.selectRow.id } : null;
    },
    handleCurrentChange(val) {
      this.selectRow = val;
    },
    dblclick(row) {
      this.selectRow = row;
      this.executeDefaultOperation();
    },
    adaptTableWidth() {
      let that = this;
      let tableRef = this.$refs["table"];
      let scrollWidth = tableRef.$el.scrollWidth;
      this.rowFields.forEach(field => {
        that.$set(field, "realWidth", (scrollWidth * field.width) / 100);
      });
    }
  },
  created() {
    let that = this;
    window.onresize = () => that.adaptTableWidth();
  },
  mounted() {
    this.adaptTableWidth();
  }
};
</script>
<style lang="less" scoped>
.search-gourp {
  text-align: right;
  margin-top: 10px;
}
.condition-row {
  margin-top: 10px;
}
</style>


