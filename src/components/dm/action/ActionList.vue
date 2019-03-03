<template>
  <div>
    <el-table
      size="small"
      :data="actions"
      border
      stripe
      highlight-current-row
      max-height="600"
      style="width: 100%"
    >
      <el-table-column prop="name" align="left" label="名称"> </el-table-column>
      <el-table-column prop="displayAs" align="left" label="显示名">
      </el-table-column>
      <el-table-column align="left" label="模式">
        <template slot-scope="scope">
          {{ enumDisplay(modeEnum, scope.row.mode) }}
        </template>
      </el-table-column>
      <el-table-column align="left" label="服务类">
        <template slot-scope="scope">
          {{
            scope.row.serviceName.substr(
              scope.row.serviceName.lastIndexOf(".") + 1
            )
          }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "ActionList",
  props: {
    type: Object
  },
  data() {
    return {
      modeEnum: "com.novice.framework.datamodel.enums.Mode"
    };
  },
  computed: {
    ...mapGetters(["loadType", "enumDisplay"]),
    actions() {
      let type = this.loadType(this.type.id);
      return type ? type.actions : [];
    }
  },
  methods: {},
  mounted() {}
};
</script>

