<template>
  <div>

    <el-table
      size="small"
      :show-header="false"
      :data="list"
      @row-dblclick="settingUpdate"
      stripe
      style="width: 100%"
    >
      <el-table-column
        label=""
        width="50"
      >
        <template slot-scope="scope">
          <i
            v-if="scope.row.override"
            class="iconfont novice-icon-dian icon-override"
          ></i>
          <i
            v-else-if="scope.row.superId"
            class="iconfont novice-icon-dian icon-extends"
          ></i>
          <i
            v-else
            class="iconfont novice-icon-dian icon-normal"
          ></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="displayAs"
        label="姓名"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="description"
        label="描述"
      >
      </el-table-column>
      <el-table-column
        align="left"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-setting"
            size="small"
            title="设置视图"
            circle
            plain
            @click="settingUpdate(scope.row)"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-edit"
            size="small"
            title="编辑"
            circle
            plain
            @click="update(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            title="删除"
            size="small"
            circle
            plain
            @click="remove(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import api from "@/api/view";
export default {
  name: "ViewTable",
  props: {
    list: Array
  },
  data() {
    return {};
  },
  methods: {
    update(row) {
      this.$emit("update", row);
    },
    settingUpdate(row) {
      this.$emit("settingUpdate", row);
    },
    remove(row) {
      let error = "";
      if (row.system && !row.superId) {
        error = "系统视图，无法删除";
      } else if (row.superId && !row.override) {
        error = "父类视图";
      }
      if (error) {
        this.$message({
          type: "error",
          message: error
        });
        return;
      }
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api.delete(row.id).then(response => {
            var index = this.list.indexOf(row);
            if (index > -1) this.list.splice(index, 1);
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    }
  },
  created() {}
};
</script>

