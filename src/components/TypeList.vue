<template>

  <div>
    <el-row>
      <el-col align="left">
        <h1>{{module.name}} / {{module.displayAs}}</h1>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="table-operate" align="left">
        <el-button type="primary" icon="el-icon-circle-plus" plain @click="showDialog=true;dialogTitle='创建模块'">添加</el-button>
        <el-button icon="el-icon-refresh" plain @click="list">刷新</el-button>
        <el-button icon="iconfont novice-icon-deploymentunit" type="info" :plain="!subordinate" @click="subordinate=true"> 主从</el-button>
        <el-button icon="iconfont novice-icon-apartment" type="info" :plain="subordinate" @click="subordinate=false"> 继承</el-button>
        <el-button v-if="!expandAll" icon="iconfont novice-icon-colum-height" plain @click="expandAll=true"> 展开</el-button>
        <el-button v-else icon="iconfont novice-icon-vertical-align-middl" plain @click="expandAll=false"> 收起</el-button>
      </el-col>
    </el-row>
    <tree-grid :columns="columns" :data-source="subordinate?dataBySubordinate:dataByExtends" :operate="true" :expand-all="expandAll" @remove="remove" @update="update"></tree-grid>

    <el-dialog :title="dialogTitle" :visible.sync="showDialog" @close="dialogClose">
      <el-form :model="form" ref="form" :rules="rules" status-icon label-width="80px">
        <el-form-item label="从属类型" prop="selectParentIds">
          <el-cascader :options="dataBySubordinate" :props="typeSelectProps" v-model="form.selectParentIds" :show-all-levels="false" change-on-select clearable filterable expand-trigger="hover"></el-cascader>
        </el-form-item>
        <el-form-item label="继承类型" prop="selectSuperIds">
          <el-cascader :options="dataByExtends" :props="typeSelectProps" v-model="form.selectSuperIds" :show-all-levels="false" change-on-select clearable filterable expand-trigger="hover"></el-cascader>
        </el-form-item>
        <el-form-item label="内部名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="显示名称" prop="displayAs">
          <el-input v-model="form.displayAs"></el-input>
        </el-form-item>
        <el-form-item label="服务类" prop="service">
          <el-input v-model="form.server"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入描述"></el-input>
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
import api from "@/api/type";
import Vue from "vue";
import TreeGrid from "./treeTable/TreeGrid.vue";
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
      columns: [
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
      ]
    };
  },
  mounted() {
    this.list();
  },
  methods: {
    list() {
      this.listBySubordinate();
      this.listByExtends();
    },
    listBySubordinate() {
      api.listBySubordinate(this.module.id).then(response => {
        this.dataBySubordinate = response.data.body;
      });
    },
    listByExtends() {
      api.listByExtends(this.module.id).then(response => {
        this.dataByExtends = response.data.body;
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
      if (row.superId) {
        this.form.selectSuperIds = [row.superId];
      }
      if (row.parentId) {
        this.form.selectParentIds = [row.parentId];
      }
      console.log(this.form);
      this.showDialog = true;
    },
    createOrUpdateAction() {
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return;
        }
        let form = this.form;
        form.parentId =
          !form.selectParentIds || form.selectParentIds.length == 0
            ? undefined
            : form.selectParentIds[form.selectParentIds.length - 1];
        form.superId =
          !form.selectSuperIds || form.selectSuperIds.length == 0
            ? undefined
            : form.selectSuperIds[form.selectSuperIds.length - 1];
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
