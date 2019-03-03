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
            class="big-iconfont novice-icon-dian icon-override"
          ></i>
          <i
            v-else-if="scope.row.superId"
            class="big-iconfont novice-icon-dian icon-extends"
          ></i>
          <i
            v-else
            class="big-iconfont novice-icon-dian icon-normal"
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
        prop="dataTypeDisplay"
        align="left"
        label="类型"
      >
      </el-table-column>
      <el-table-column
        align="left"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              type="primary"
              icon="el-icon-edit"
              title="编辑"
              size="small"
              plain
              @click="update(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              title="删除"
              size="small"
              plain
              @click="remove(scope.row)"
            ></el-button>
          </el-button-group>
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
          <el-input
            v-model="form.name"
            :disabled="!!form.id"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="显示名"
          prop="displayAs"
        >
          <el-input v-model="form.displayAs"></el-input>
        </el-form-item>
        <el-form-item
          label="类型"
          prop="dataType"
          align="left"
        >
          <el-select
            v-model="form.dataType"
            filterable
            @change="changeDataType"
          >
            <el-option
              v-for="item in dataTypes"
              :key="item.id"
              :label="item.displayAs"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="控件"
          prop="widget"
        >
          <el-button
            icon="el-icon-setting"
            type="primary"
            circle
            plain
            @click="widget={...form.widget};widgetShow = true;"
            size="small"
          ></el-button>
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
        <el-dialog
          title="控件属性"
          :visible.sync="widgetShow"
          width="30%"
          append-to-body
          center
        >
          <widget
            :widget="widget"
            v-if="widgetShow"
          ></widget>
          <div
            class="dialog-footer"
            slot="footer"
          >
            <el-button
              type="primary"
              @click="form.widget=widget;widgetShow=false;"
            >确 定</el-button>
            <el-button @click="widgetShow = false">取 消</el-button>
          </div>
        </el-dialog>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import api from "@/api/field";
import { mapGetters } from "vuex";
import Widget from "./Widget";

export default {
  name: "FieldList",
  components: {
    Widget
  },
  props: {
    type: Object
  },
  data() {
    return {
      data: [],
      loading: false,
      showDialog: false,
      widgetShow: false,
      widget: {},
      dialogTitle: "",
      form: {},
      rules: {
        name: [{ required: true, message: "字段名不能为空", trigger: "blur" }],
        displayAs: [
          { required: true, message: "显示名不能为空", trigger: "blur" }
        ],
        dataType: [{ required: true, message: "类型不能为空", trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapGetters(["dataTypes", "loadDataType"])
  },
  methods: {
    list() {
      this.loading = true;
      api.list(this.type.id).then(result => {
        if (result.code === 1) {
          let that = this;
          let data = result.body;
          data.forEach(value => {
            value.dataTypeDisplay = that.findDataTypeDisplay(value.dataType);
          });
          this.data = data;
        }
        this.loading = false;
      });
    },
    findDataTypeDisplay(dataTypeId) {
      let dataType = this.loadDataType(dataTypeId);
      return dataType ? dataType.displayAs : "";
    },
    changeDataType(dataTypeId) {
      let dataType = this.loadDataType(dataTypeId);
      this.form.widget = { ...dataType.widget };
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
          api.delete(row.id).then(result => {
            if (result.code === 1) {
              this.list();
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
  },
  mounted() {
    this.list();
  }
};
</script>
