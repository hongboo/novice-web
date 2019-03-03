<template>
  <div>
    <el-row>
      <el-col :span="6" class="table-operate" align="left">
        <el-button
          type="primary"
          icon="el-icon-circle-plus"
          size="small"
          plain
          @click="create"
          >添加</el-button
        >
        <el-button icon="el-icon-refresh" plain @click="list" size="small"
          >刷新</el-button
        >
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
      <el-table-column label="" width="50">
        <template slot-scope="scope">
          <i
            v-if="scope.row.override"
            class="big-iconfont novice-icon-dian icon-override"
          ></i>
          <i
            v-else-if="scope.row.superId"
            class="big-iconfont novice-icon-dian icon-extends"
          ></i>
          <i v-else class="big-iconfont novice-icon-dian icon-normal"></i>
        </template>
      </el-table-column>
      <el-table-column prop="name" align="left" label="名称"> </el-table-column>
      <el-table-column prop="displayAs" align="left" label="显示名">
      </el-table-column>
      <el-table-column align="left" label="渲染器">
        <template slot-scope="scope">
          {{ enumDisplay(rendererEnum, scope.row.renderer) }}
        </template>
      </el-table-column>
      <el-table-column prop="viewName" align="left" label="视图">
      </el-table-column>
      <el-table-column
        prop="description"
        align="left"
        label="描述"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column align="left" label="操作">
        <template slot-scope="scope">
          <el-button-group>
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
            <el-button
              icon="el-icon-caret-right"
              title="执行"
              size="small"
              circle
              plain
              :disabled="scope.row.model === 'Entity'"
              @click="execute(scope.row)"
            ></el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="actionName === 'Create' ? '创建业务' : '修改业务'"
      :visible.sync="showDialog"
      width="50%"
      center
    >
      <el-form
        :model="form"
        ref="form"
        size="small"
        :rules="rules"
        status-icon
        label-width="80px"
      >
        <el-form-item label="字段名" prop="name">
          <el-input v-model="form.name" :disabled="!!form.id"></el-input>
        </el-form-item>
        <el-form-item label="显示名" prop="displayAs">
          <el-input v-model="form.displayAs"></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="模式" prop="model" align="left">
          <el-select v-model="form.model">
            <el-option
              v-for="item in modelList"
              :key="item.value"
              :label="item.display"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="视图" prop="viewName" align="left">
          <el-select v-model="form.viewName" filterable clearable>
            <el-option
              v-for="item in viewList"
              :key="item.name"
              :value="item.name"
              :title="item.displayAs"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渲染器" prop="renderer" align="left">
          <el-select
            v-model="form.renderer"
            filterable
            clearable
            allow-create
            default-first-option
            placeholder="选择渲染器"
          >
            <el-option
              v-for="item in rendererList"
              :key="item.value"
              :label="item.display"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作" prop="operations" align="left">
          <el-tag
            v-for="(operation, index) in form.operations"
            :key="index"
            :type="operation.level"
            closable
            @click.native="
              currentOperation = { ...operation };
              showOperationDialog = true;
            "
            @close="form.operations.splice(index, 1)"
            class="operation-tag"
            :class="{
              defaultOpe: operation.defaultOpe,
              defaultLevel: operation.level === 'default'
            }"
            v-dragging="{
              item: operation,
              list: form.operations,
              group: 'item'
            }"
            >{{ operation.name }}</el-tag
          >
          <el-button
            icon="el-icon-plus"
            circle
            @click="triggerAddOperation"
          ></el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createOrUpdateAction"
          >确 定</el-button
        >
        <el-button @click="showDialog = false">取 消</el-button>
      </div>
      <el-dialog
        :visible.sync="showOperationDialog"
        :title="
          currentOperation && currentOperation.id ? '修改操作' : '创建操作'
        "
        width="40%"
        append-to-body
        center
      >
        <operation
          :form="currentOperation"
          :typeId="type.id"
          ref="operation"
        ></operation>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="createOrUpdateOperation"
            >确 定</el-button
          >
          <el-button @click="showOperationDialog = false">取 消</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/business";
import Operation from "./Operation";
import { mapGetters } from "vuex";

export default {
  name: "BusinessList",
  components: {
    Operation
  },
  props: {
    type: Object
  },
  data() {
    return {
      rendererEnum: "com.novice.framework.datamodel.enums.Renderer",
      modeEnum: "com.novice.framework.datamodel.enums.Mode",
      data: [],
      loading: false,
      showDialog: false,
      actionName: "",
      showOperationDialog: false,
      form: {},
      rules: {
        name: [{ required: true, message: "字段名不能为空", trigger: "blur" }],
        displayAs: [
          { required: true, message: "显示名不能为空", trigger: "blur" }
        ]
      },
      currentOperation: null
    };
  },
  computed: {
    ...mapGetters(["loadEnum", "loadViews", "enumDisplay"]),
    rendererList() {
      return this.loadEnum(this.rendererEnum);
    },
    viewList() {
      return this.loadViews(this.type.id);
    },
    modelList() {
      return this.loadEnum(this.modeEnum);
    }
  },
  methods: {
    list() {
      this.loading = true;
      api.list(this.type.id).then(result => {
        if (result.code === 1) {
          this.data = result.body;
        }
        this.loading = false;
      });
    },
    triggerAddOperation() {
      this.currentOperation = {
        type: "Action",
        callbackMode: "Close",
        level: "primary",
        name: "",
        target: "",
        defaultOpe: false,
        plain: false,
        round: false
      };
      this.showOperationDialog = true;
    },
    createOrUpdateOperation() {
      let operateRef = this.$refs.operation;
      operateRef.validate().then(result => {
        if (result) {
          let operations = this.form.operations;
          this.currentOperation.id =
            this.currentOperation.id || Math.random().toString(36);
          let opt = operations.find(tmp => tmp.id === this.currentOperation.id);
          if (opt) {
            operations.splice(
              operations.indexOf(opt),
              1,
              this.currentOperation
            );
          } else {
            operations.push(this.currentOperation);
          }
          if (this.currentOperation.defaultOpe) {
            operations.forEach(
              o => o.id !== this.currentOperation.id && (o.defaultOpe = false)
            );
          }
          this.showOperationDialog = false;
        }
      });
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
    create() {
      if (this.$refs["form"]) {
        this.$refs["form"].resetFields();
      }
      this.form = { operations: [] };
      this.actionName = "Create";
      this.showDialog = true;
    },
    update(row) {
      if (this.$refs["form"]) {
        this.$refs["form"].resetFields();
      }
      this.actionName = "Update";
      this.form = Object.assign(
        { ...row },
        { operations: row.operations ? [...row.operations] : [] }
      );
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
    execute(row) {
      let businessName = this.type.name + "@" + row.name;
      window.open("#/?business=" + businessName);
    }
  },
  mounted() {
    this.list();
  }
};
</script>
<style lang="less" scoped>
.operation-tag {
  margin-right: 4px;
  cursor: move;
}
.defaultOpe {
  font-weight: bolder;
  font-size: 14px;
}
.defaultLevel {
  background-color: white;
}
</style>

