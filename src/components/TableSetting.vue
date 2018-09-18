<template>

  <div>
    <el-row>
      <el-col align="left">
        <h1>{{table.name}} ({{table.id}})/ {{table.displayAs}}</h1>
      </el-col>
    </el-row>
    <el-tabs v-model="selectTab">
      <el-tab-pane label="字段设置" name="column">
        <el-row>
          <el-col :span="6" class="table-operate" align="left">
            <el-button type="primary" icon="el-icon-circle-plus" size="small" plain @click="showDialog=true;dialogTitle='创建字段'">添加</el-button>
            <el-button icon="el-icon-refresh" plain @click="list" size="small">刷新</el-button>
          </el-col>
        </el-row>
        <el-table size="small" :data="data" v-loading="loading" @row-dblclick="update" border stripe highlight-current-row max-height="600" style="width: 100%">
          <el-table-column prop="name" align="left" label="字段名" width="180">
          </el-table-column>
          <el-table-column prop="displayAs" align="left" label="显示名" width="180">
          </el-table-column>
          <el-table-column prop="wrapperDisplay" align="left" label="类型">
          </el-table-column>
          <el-table-column align="left" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="small" circle plain @click="update(scope.row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="small" circle plain @click="remove(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="视图设置" name="view">
        <el-row>
          视图设置
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="业务设置" name="business">
        <el-row>
          业务设置
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="动作设置" name="action">
        <el-row>
          动作设置
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <el-dialog :title="dialogTitle" :visible.sync="showDialog" @close="dialogClose" width="40%">
      <el-form :model="form" ref="form" :rules="rules" status-icon label-width="80px">
        <el-form-item label="字段名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="显示名" prop="displayAs">
          <el-input v-model="form.displayAs"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="wrapper" align="left">
          <el-select v-model="form.wrapper" filterable>
            <el-option v-for="item in wrappers" :key="item.key" :label="item.name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createOrUpdateAction">确 定</el-button>
        <el-button @click="showDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import api from "@/api/column";
export default {
  name: "TableSetting",
  props: {
    table: Object
  },
  data() {
    return {
      data: [],
      wrappers: [],
      loading: false,
      showDialog: false,
      selectTab: "column",
      dialogTitle: "",
      form: {
        id: undefined,
        name: "",
        displayAs: "",
        wrapper: "com.novice.framework.dm.wrapper.StringWrapper"
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
  mounted() {
    this.listWrapper();
    this.list();
  },
  methods: {
    list() {
      this.loading = true;
      api.list(this.table.id).then(response => {
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
      debugger;

      for (const key in this.wrappers) {
        const element = this.wrappers[key];
        if (element.key === wrapper) {
          return element.name;
        }
      }
      return key;
    },
    remove(row) {
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
        form.tableId = this.table.id;
        api.createOrUpdate(form).then(response => {
          this.showDialog = false;
          this.list();
        });
      });
    },
    dialogClose() {
      this.$refs["form"].resetFields();
      this.form = { wrapper: "com.novice.framework.dm.wrapper.StringWrapper" };
    }
  }
};
</script>