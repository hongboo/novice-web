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
          @click="showDialog=true;dialogTitle='创建字段'"
        >添加</el-button>
        <el-button
          icon="el-icon-refresh"
          plain
          @click="list"
          size="small"
        >刷新</el-button>
      </el-col>
    </el-row>
    <el-table
      size="small"
      :data="data"
      v-loading="loading"
      @row-dblclick="update"
      border
      stripe
      highlight-current-row
      max-height="600"
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
        align="left"
        label="字段名"
      >
      </el-table-column>
      <el-table-column
        prop="displayAs"
        align="left"
        label="显示名"
      >
      </el-table-column>
      <el-table-column
        prop="wrapperDisplay"
        align="left"
        label="类型"
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
            title="编辑"
            size="small"
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
          label="字段名"
          prop="name"
        >
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item
          label="显示名"
          prop="displayAs"
        >
          <el-input v-model="form.displayAs"></el-input>
        </el-form-item>
        <el-form-item
          label="类型"
          prop="wrapper"
          align="left"
        >
          <el-select
            v-model="form.wrapper"
            filterable
          >
            <el-option
              v-for="item in wrappers"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            >
            </el-option>
          </el-select>
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
import api from "@/api/field";
export default {
  name: "FieldList",
  props: {
    type: Object
  },
  data() {
    return {
      data: [],
      wrappers: [],
      loading: false,
      showDialog: false,
      dialogTitle: "",
      form: {
        id: undefined,
        name: "",
        displayAs: "",
        wrapper: "com.novice.framework.datamodel.wrapper.StringWrapper"
      },
      rules: {
        name: [{ required: true, message: "字段名不能为空", trigger: "blur" }],
        displayAs: [
          { required: true, message: "显示名不能为空", trigger: "blur" }
        ],
        wrapper: [{ required: true, message: "类型不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    list() {
      this.loading = true;
      api.list(this.type.id).then(response => {
        let that = this;
        let data = response.data.body;
        data.forEach(value => {
          value.wrapperDisplay = that.findWrapperDisplay(value.wrapper);
        });
        this.data = data;
        this.loading = false;
      });
    },
    listWrapper() {
      api.listWrapper().then(response => {
        this.wrappers = response.data.body;
      });
    },
    findWrapperDisplay(wrapper) {
      for (const key in this.wrappers) {
        const element = this.wrappers[key];
        if (element.key === wrapper) {
          return element.name;
        }
      }
      return wrapper;
    },
    remove(row) {
      if (row.superId && !row.override) {
        this.$message({
          type: "error",
          message: "父类字段,无法删除"
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
            this.list();
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
    update(row) {
      this.dialogTitle = "修改字段";
      this.form = { ...row };
      this.showDialog = true;
    },
    createOrUpdateAction() {
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return;
        }
        let form = this.form;
        form.typeId = this.type.id;
        if (form.superId) {
          form.override = true;
        }
        api.createOrUpdate(form).then(response => {
          this.showDialog = false;
          this.list();
        });
      });
    },
    dialogClose() {
      this.$refs["form"].resetFields();
      this.form = {
        wrapper: "com.novice.framework.datamodel.wrapper.StringWrapper"
      };
    }
  },
  mounted() {
    this.listWrapper();
    this.list();
  }
};
</script>
