<template>

  <div>
    <el-row class="tab-title">
      <el-col align="left">
        {{module.name}} / {{module.displayAs}}
      </el-col>
    </el-row>
    <el-row>
      <el-col
        class="table-operate"
        align="left"
      >
        <el-button
          type="primary"
          size="small"
          icon="el-icon-circle-plus"
          plain
          @click="showDialog=true;dialogTitle='创建类型'"
        >添加</el-button>
        <el-button
          icon="el-icon-refresh"
          size="small"
          plain
          @click="list"
        >刷新</el-button>
        <el-button
          icon="iconfont novice-icon-deploymentunit"
          size="small"
          type="info"
          :plain="!subordinate"
          @click="subordinate=true"
        >主从</el-button>
        <el-button
          icon="iconfont novice-icon-apartment"
          size="small"
          type="info"
          :plain="subordinate"
          @click="subordinate=false"
        >继承</el-button>
        <el-button
          v-if="!expandAll"
          icon="iconfont novice-icon-colum-height"
          size="small"
          plain
          @click="expandAll=true"
        >展开</el-button>
        <el-button
          v-else
          icon="iconfont novice-icon-vertical-align-middl"
          size="small"
          plain
          @click="expandAll=false"
        >收起</el-button>
      </el-col>
    </el-row>
    <tree-grid
      v-loading="loading"
      double-click-name="addTab"
      :columns="treeColumns"
      :data-source="subordinate?dataBySubordinate:dataByExtends"
      :operateData="operateData"
      :expand-all="expandAll"
      @remove="remove"
      @update="update"
      @addTab="addTab"
    ></tree-grid>

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
          label="从属"
          prop="selectParentIds"
          align="left"
        >
          <el-cascader
            :options="dataBySubordinate"
            :props="typeSelectProps"
            v-model="form.selectParentIds"
            :show-all-levels="false"
            change-on-select
            clearable
            filterable
            expand-trigger="hover"
          ></el-cascader>
        </el-form-item>
        <el-form-item
          label="继承"
          prop="selectSuperIds"
          align="left"
        >
          <el-cascader
            :options="dataByExtends"
            :props="typeSelectProps"
            v-model="form.selectSuperIds"
            :show-all-levels="false"
            change-on-select
            clearable
            filterable
            expand-trigger="hover"
          ></el-cascader>
        </el-form-item>
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
          label="服务类"
          prop="service"
        >
          <el-input v-model="form.server"></el-input>
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
import api from "@/api/type";
import utils from "@/util/TreeDataUtils";
import Vue from "vue";
import TreeGrid from "@/components/common/TreeGrid";
export default {
  name: "TypeList",
  props: {
    module: Object
  },
  components: { TreeGrid },
  data() {
    return {
      dataBySubordinate: [],
      dataByExtends: [],
      subordinate: true,
      expandAll: false,
      loading: false,
      showDialog: false,
      dialogTitle: "",
      form: {
        id: undefined,
        superId: undefined,
        selectSuperIds: [],
        parentId: undefined,
        selectParentIds: [],
        name: "",
        displayAs: "",
        service: "",
        description: ""
      },
      rules: {
        name: [
          { required: true, message: "内部名称不能为空", trigger: "blur" }
        ],
        displayAs: [
          { required: true, message: "显示名称不能为空", trigger: "blur" }
        ]
      },
      typeSelectProps: {
        value: "id",
        label: "displayAs"
      },
      treeColumns: [
        {
          text: "显示名",
          dataIndex: "displayAs"
        },
        {
          text: "内部名称",
          dataIndex: "name"
        },
        {
          text: "服务类",
          dataIndex: "service"
        },
        {
          text: "描述",
          dataIndex: "description"
        }
      ],
      operateData: [
        {
          type: "primary",
          icon: "el-icon-setting",
          title: "设置",
          methodName: "addTab"
        },
        {
          type: "info",
          icon: "el-icon-edit",
          title: "编辑",
          methodName: "update"
        },
        {
          type: "danger",
          icon: "el-icon-delete",
          title: "删除",
          methodName: "remove"
        }
      ]
    };
  },
  mounted() {
    this.list();
  },
  methods: {
    list() {
      this.loading = true;
      let promise = [
        api.listBySubordinate(this.module.id),
        api.listByExtends(this.module.id)
      ];
      Promise.all(promise).then(responseArray => {
        this.dataBySubordinate = responseArray[0].data.body;
        this.dataByExtends = responseArray[1].data.body;
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
      this.dialogTitle = "修改类型";
      this.form = { ...row };
      delete this.form.children;
      delete this.form._parent;
      if (row.superId) {
        this.form.selectSuperIds = utils.findTreePathByArray(
          row.superId,
          this.dataByExtends
        );
      }
      if (row.parentId) {
        this.form.selectParentIds = utils.findTreePathByArray(
          row.parentId,
          this.dataBySubordinate
        );
      }
      this.showDialog = true;
    },
    createOrUpdateAction() {
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return;
        }
        let form = this.form;
        form.parentId = utils.findLastByArray(form.selectParentIds);
        form.superId = utils.findLastByArray(form.selectSuperIds);
        form.moduleId = this.module.id;
        api.createOrUpdate(form).then(response => {
          this.showDialog = false;
          this.list();
        });
      });
    },
    dialogClose() {
      this.$refs["form"].resetFields();
      this.form = {};
    },
    addTab(row) {
      let type = { ...row };
      delete type.children;
      delete type._parent;
      this.$emit("addTab", {
        key: "module-type-" + type.id,
        name: type.displayAs,
        type: "typeSetting",
        selectType: type
      });
    }
  }
};
</script>

<style>
.table-operate {
  margin-bottom: 10px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
