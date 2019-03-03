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
          <el-row :gutter="20" v-for="i in conditionFields.length / 2" :key="i">
            <el-col
              :span="12"
              v-for="j in conditionFields.length % 2 ? 1 : 2"
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
          :disabled="isDisabled(item)"
          size="small"
          @click="execute(item)"
          >{{ item.name }}</el-button
        >
        <el-button icon="el-icon-refresh" plain size="small">刷新</el-button>
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
import { mapActions } from "vuex";
export default {
  name: "ListRenderer",
  props: {
    business: Object
  },
  data() {
    return {
      data: [],
      loading: false,
      selectRow: null
    };
  },
  computed: {
    ...mapActions(["executeAction"]),
    conditionFields() {
      return this.business.view.conditionFields;
    },
    rowFields() {
      return this.business.view.rowFields;
    }
  },
  methods: {
    isDisabled(operation) {
      return !this.selectRow && false;
    },
    executeInitAction() {
      if (!this.business.initAction) return;
      //TODO this.executeAction({ name: "222" });
      let that = this;
      this.$store.dispatch("executeAction", {
        name: this.business.initAction,
        typeId: this.business.typeId,
        callback: function(res) {
          if (res.code === 1) {
            that.data = res.body;
          }
        }
      });
    },
    adaptTableWidth() {
      let tableRef = this.$refs["table"];
      let scrollWidth = tableRef.$el.scrollWidth;
      this.rowFields.forEach(field => {
        field.realWidth = (scrollWidth * field.width) / 100;
      });
    }
  },
  created() {},
  mounted() {
    this.adaptTableWidth();
    this.executeInitAction();
  }
};
</script>
<style lang="less" scoped>
.search-gourp {
  text-align: right;
  margin-top: 10px;
}
</style>


