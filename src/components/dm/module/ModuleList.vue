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
          size="small"
          icon="el-icon-circle-plus"
          plain
          @click="showDialog=true;dialogTitle='创建模块'"
        >添加</el-button>
        <el-button
          icon="el-icon-refresh"
          size="small"
          plain
          @click="list"
        >刷新</el-button>
      </el-col>
    </el-row>
    <el-table
      size="small"
      :data="data"
      v-loading="loading"
      @row-dblclick="editModule"
      border
      stripe
      highlight-current-row
      max-height="600"
      style="width: 100%"
    >
      <el-table-column
        prop="displayAs"
        align="left"
        label="模块显示名"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        align="left"
        label="模块名称"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="description"
        align="left"
        label="描述"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        align="left"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            title="设置"
            icon="el-icon-setting"
            circle
            plain
            @click="editModule(scope.row)"
          ></el-button>
          <el-button
            type="info"
            size="small"
            title="编辑"
            icon="el-icon-edit"
            circle
            plain
            @click="update(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            size="small"
            title="删除"
            icon="el-icon-delete"
            circle
            plain
            @click="remove(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="showDialog"
      @close="dialogClose"
      width="40%"
      center
    >
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        status-icon
        label-width="80px"
      >
        <el-form-item
          label="内部名称"
          prop="name"
        >
          <el-input
            v-model="form.name"
            :disabled="!!form.id"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="显示名称"
          prop="displayAs"
        >
          <el-input v-model="form.displayAs"></el-input>
        </el-form-item>
        <el-form-item
          label="描述"
          prop="description"
        >
          <el-input
            v-model="form.description"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入描述"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="createOrUpdateAction"
        >确 定</el-button>
        <el-button @click="showDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import api from "@/api/module";
import { mapActions } from "vuex";
export default {
  name: "ModuleList",
  data() {
    return {
      data: [],
      loading: false,
      showDialog: false,
      dialogTitle: "",
      form: {
        id: undefined,
        name: "",
        displayAs: "",
        description: ""
      },
      rules: {
        name: [
          { required: true, message: "内部名称不能为空", trigger: "blur" }
        ],
        displayAs: [
          { required: true, message: "显示名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.list();
  },
  methods: {
    ...mapActions(["pushAdminTab"]),
    list() {
      this.loading = true;
      api.list().then(result => {
        if (result.code === 1) {
          this.data = result.body;
        }
        this.loading = false;
      });
    },
    remove(row) {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api.delete(row.id).then(result => {
            if (result.code === 1) {
              this.list();
              var index = this.data.indexOf(row);
              if (index > -1) this.data.splice(index, 1);
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    update(row) {
      this.dialogTitle = "修改模块";
      this.form = { ...row };
      this.showDialog = true;
    },
    editModule(row) {
      this.pushAdminTab({
        key: "module-" + row.id,
        name: row.displayAs,
        type: "typeList",
        module: { ...row }
      });
    },
    createOrUpdateAction() {
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return;
        }
        let form = this.form;
        api.createOrUpdate(form).then(result => {
          if (result.code === 1) {
            this.showDialog = false;
            this.list();
          }
        });
      });
    },
    dialogClose() {
      this.$refs["form"].resetFields();
      this.form = {};
    }
  }
};
</script>

<style>
.table-operate {
  margin-bottom: 10px;
}
</style>
