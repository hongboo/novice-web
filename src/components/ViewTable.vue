<template>
  <div>
    <el-table
      :show-header="false"
      :data="list"
      @row-dblclick="update"
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
            icon="el-icon-edit"
            size="small"
            circle
            plain
            @click="update(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
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
          <el-input v-model="form.name"></el-input>
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
import api from "@/api/view";
export default {
  name: "ViewList",
  props: {
    list: Array,
    typeId: undefined
  },
  data() {
    return {
      showDialog: false,
      dialogTitle: "修改视图",
      form: {},
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
  methods: {
    create() {
      this.dialogTitle = "创建视图";
      this.showDialog = true;
    },
    update(row) {
      this.dialogTitle = "修改视图";
      this.form = { ...row };
      this.showDialog = true;
    },
    dialogClose() {
      this.$refs["form"].resetFields();
      this.form = {};
    },
    remove(row) {
      if (row.superId && !row.override) {
        this.$message({
          type: "error",
          message: "父类视图,无法删除"
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
            this.$emit("list");
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
    },
    createOrUpdateAction() {
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return;
        }
        let form = this.form;
        form.typeId = this.typeId;
        if (form.superId) {
          form.override = true;
        }
        api.createOrUpdate(form).then(response => {
          this.showDialog = false;
          this.$emit("list");
        });
      });
    }
  },
  created() {}
};
</script>


