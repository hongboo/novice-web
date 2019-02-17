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
          @click="create"
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
        label="名称"
      >
      </el-table-column>
      <el-table-column
        prop="displayAs"
        align="left"
        label="显示名"
      >
      </el-table-column>
      <el-table-column
        prop="renderer"
        align="left"
        label="渲染器"
      >
      </el-table-column>
      <el-table-column
        prop="viewName"
        align="left"
        label="视图"
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
            :disabled="scope.row.model==='Entity'"
            @click="execute(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="actionName==='Create'?'创建业务':'修改业务'"
      :visible.sync="showDialog"
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
          label="标题"
          prop="title"
        >
          <el-input v-model="form.title"></el-input>
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
        <el-form-item
          label="模式"
          prop="model"
          align="left"
        >
          <el-select v-model="form.model">
            <el-option
              v-for="item in modelList"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="视图"
          prop="viewName"
          align="left"
        >
          <el-select
            v-model="form.viewName"
            filterable
            clearable
          >
            <el-option
              v-for="item in viewNameList"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="渲染器"
          prop="renderer"
          align="left"
        >
          <el-autocomplete
            class="inline-input"
            clearable
            v-model="form.renderer"
            :fetch-suggestions="queryRenderer"
          ></el-autocomplete>
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
import api from "@/api/business";
import { mapGetters } from "vuex";

export default {
  name: "BusinessList",
  props: {
    type: Object
  },
  data() {
    return {
      data: [],
      viewNameList: ["select", "search", "list", "detail"],
      modelList: [
        { key: "Collection", name: "集合" },
        { key: "Entity", name: "实例" }
      ],
      loading: false,
      showDialog: false,
      actionName: "",
      form: {},
      rules: {
        name: [{ required: true, message: "字段名不能为空", trigger: "blur" }],
        displayAs: [
          { required: true, message: "显示名不能为空", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["loadEnum"]),
    rendererList() {
      return this.loadEnum("com.novice.framework.datamodel.enums.Renderer");
    }
  },
  methods: {
    queryRenderer(queryString, cb) {
      var results = queryString
        ? this.rendererList.filter(
            renderer =>
              renderer.value
                .toLowerCase()
                .indexOf(queryString.toLowerCase()) !== -1
          )
        : this.rendererList;
      cb(results);
    },
    list() {
      this.loading = true;
      api.list(this.type.id).then(result => {
        if (result.code === 1) {
          this.data = result.body;
        }
        this.loading = false;
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
      this.form = {};
      this.actionName = "Create";
      this.showDialog = true;
    },
    update(row) {
      if (this.$refs["form"]) {
        this.$refs["form"].resetFields();
      }
      this.actionName = "Update";
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

