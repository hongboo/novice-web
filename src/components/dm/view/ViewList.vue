<template>
  <div class="view-warp">
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
          size="small"
          @click="list"
        >刷新</el-button>
      </el-col>
    </el-row>
    <el-collapse v-model="activeNames">
      <el-collapse-item
        :title="`${item.name}视图`"
        :name="item.key"
        v-for="(item,index) in viewTypeList"
        :key="index"
      >
        <view-table
          :list="data[item.key]"
          :typeId="type.id"
          :viewType="item.key"
          v-if="data[item.key]"
          @update="update"
          @settingUpdate="settingUpdate"
          @list="list"
        ></view-table>
      </el-collapse-item>
    </el-collapse>

    <el-dialog
      :title="'Update'===action?'编辑视图':'创建视图'"
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
          label="类型"
          prop="viewType"
          align="left"
        >
          <el-select
            v-model="form.viewType"
            filterable
            :disabled="'Update'===action"
          >
            <el-option
              v-for="item in viewTypeList"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="名称"
          prop="name"
        >
          <el-input
            v-model="form.name"
            :disabled="'Update'===action"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="显示名"
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

    <el-dialog
      :title="`视图设置 ${form.name}`"
      :visible.sync="showSettingDialog"
      :close-on-click-modal="false"
      width="60%"
      top="9vh"
      center
    >
      <div class="dialog-div">
        <detail-view
          :typeId="type.id"
          :view="form"
          v-if="form.viewType==='Detail'"
        ></detail-view>
        <list-view
          :typeId="type.id"
          :view="form"
          v-else-if="form.viewType==='List'"
        ></list-view>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="saveViewSetting"
        >确 定</el-button>
        <el-button @click="showSettingDialog = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import api from "@/api/view";
import ViewTable from "./ViewTable";
import DetailView from "./setting/DetailView";
import ListView from "./setting/ListView";
export default {
  name: "ViewList",
  components: { ViewTable, DetailView, ListView },
  props: {
    type: Object
  },
  data() {
    return {
      viewTypeList: [
        { key: "List", name: "列表" },
        { key: "Detail", name: "详情" }
      ],
      activeNames: [],
      data: {},
      showDialog: false,
      showSettingDialog: false,
      action: "",
      form: {},
      rules: {
        name: [{ required: true, message: "字段名不能为空", trigger: "blur" }],
        displayAs: [
          { required: true, message: "显示名不能为空", trigger: "blur" }
        ],
        viewType: [{ required: true, message: "类型不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    list() {
      api.listGroupByViewType(this.type.id).then(res => {
        for (const i in this.viewTypeList) {
          let key = this.viewTypeList[i].key;
          this.$set(this.data, key, res.data.body[key]);
        }
      });
    },
    create() {
      this.action = "Create";
      let formRef = this.$refs["form"];
      if (formRef) formRef.resetFields();
      this.form = {};
      this.showDialog = true;
    },
    update(row) {
      this.action = "Update";
      this.form = JSON.parse(JSON.stringify(row));
      this.showDialog = true;
    },
    settingUpdate(row) {
      this.showDialog = false;
      this.form = JSON.parse(JSON.stringify(row));
      this.showSettingDialog = true;
    },
    saveViewSetting() {
      if (this.form.superId) {
        this.form.override = true;
      }
      api.createOrUpdate(this.form).then(response => {
        this.showSettingDialog = false;
        this.list();
      });
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
    }
  },
  created() {
    this.list();
  },
  mounted() {
    let that = this;
    setTimeout(() => {
      for (const key in that.viewTypeList) {
        that.activeNames.push(that.viewTypeList[key].key);
      }
    }, 1);
  }
};
</script>

<style lang="less">
.view-warp {
  div.el-collapse-item__content {
    padding-bottom: 0;
  }
  .el-collapse-item__wrap {
    border-bottom: none;
  }
}
</style>

<style lang="less" scoped>
.el-collapse {
  text-align: left;
}
.dialog-div {
  height: 500px;
  overflow-y: auto;
}
</style>


