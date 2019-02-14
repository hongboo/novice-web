<template>

  <div>
    <field-set-setting
      class="border field-set"
      v-for="(item,index) in view.fieldSets"
      :key="index"
      :fieldSet="item"
      :fields="fields"
      @updateFieldSet="updateFieldSet"
      @removeFieldSet="removeFieldSet"
    >
    </field-set-setting>
    <el-row class="add-new">
      <el-button
        type="primary"
        size="small"
        icon="el-icon-circle-plus"
        @click.native="createFieldSet"
      >新建区域</el-button>
    </el-row>

    <el-dialog
      :title="'Update'===action?'修改区域':'新建区域'"
      :visible.sync="showDialog"
      append-to-body
      width="50%"
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
          label="标题"
          prop="title"
        >
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item
          label="边框"
          prop="border"
        >
          <el-switch
            v-model="form.border"
            active-text="有"
            inactive-text="无"
          >
          </el-switch>
        </el-form-item>
        <el-form-item
          label="列数"
          prop="rowSize"
        >
          <el-input-number
            label="列数"
            size="small"
            v-model="form.rowSize"
            controls-position="right"
            :min="1"
            :max="3"
          ></el-input-number>
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
import viewApi from "@/api/view";
import fieldApi from "@/api/field";
import FieldSetSetting from "./FieldSetSetting";
export default {
  name: "DetailViewSetting",
  components: { FieldSetSetting },
  props: {
    typeId: String,
    view: Object
  },
  data() {
    return {
      form: {
        rowSize: 1
      },
      showDialog: false,
      action: "",
      rules: {
        rowSize: [{ required: true, message: "列数不能为空", trigger: "blur" }]
      },
      fields: []
    };
  },
  watch: {},
  methods: {
    getFields() {
      fieldApi.list(this.typeId).then(res => {
        this.fields = res.data.body;
      });
    },
    createFieldSet() {
      let formRef = this.$refs["form"];
      if (formRef) formRef.resetFields();
      this.form = { rowSize: 1 };
      this.action = "Create";
      this.showDialog = true;
    },
    updateFieldSet(item) {
      this.form = { ...item };
      this.action = "Update";
      this.showDialog = true;
    },
    removeFieldSet(item) {
      let index = this.view.fieldSets.indexOf(item);
      if (index > -1) {
        this.view.fieldSets.splice(index, 1);
      }
    },
    createOrUpdateAction() {
      let that = this;
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return;
        }
        if (!that.view.fieldSets) {
          that.view.fieldSets = [];
        }
        let tmpData = { ...that.form };
        tmpData.name = that.form.name || Math.random().toString(36);
        if ("Create" === that.action) {
          tmpData.fields = [];
          that.view.fieldSets.push(tmpData);
        } else {
          for (const key in that.view.fieldSets) {
            const element = that.view.fieldSets[key];
            if (element.name === tmpData.name) {
              that.$set(that.view.fieldSets, key, tmpData);
              break;
            }
          }
        }
        that.showDialog = false;
      });
    }
  },
  created() {
    this.getFields();
  }
};
</script>
<style lang="less" scoped>
.add-new {
  margin-top: 10px;
  text-align: center;
}
</style>