<template>

  <div>
    <el-row>
      <el-col align="left">
        <h1>{{module.name}} / {{module.displayAs}}</h1>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6" class="table-operate" align="left">
        <el-button type="primary" icon="el-icon-circle-plus" plain @click="showDialog=true;dialogTitle='创建模块'">添加</el-button>
        <el-button icon="el-icon-refresh" plain @click="list">刷新</el-button>
      </el-col>
    </el-row>
    <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick">
       <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => append(data)">
            Append
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            Delete
          </el-button>
        </span>
      </span>
    </el-tree>

    <el-dialog :title="dialogTitle" :visible.sync="showDialog" @close="dialogClose">
      <el-form :model="form" ref="form" :rules="rules" status-icon label-width="80px">
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
export default {
  name: "TypeList",
  props: {
    module: Object
  },
  data() {
    return {
        data: [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1'
            }]
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1'
            }]
          }]
        }],
      loading: true,
      showDialog: false,
      dialogTitle: "",
      form: {
        id: undefined,
        name: "",
        displayAs: "",
        service:"",
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
    list() {
      api.list().then(response => {
        this.data = response.data.body;
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
      this.dialogTitle = "修改模块";
      this.form = { ...row };
      this.showDialog = true;
    },
    createOrUpdateAction() {
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return;
        }
        let form = this.form;
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
