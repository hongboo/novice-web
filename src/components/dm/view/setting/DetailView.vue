<template>

  <div>
        <el-row
      v-for="(item,index) in data"
      :key="index"
    >
      {{item}}
    </el-row>
    <el-button
      type="primary"
      size="small"
      @click="createFieldSet"
    >新建区域</el-button>
    
    <el-dialog
      :title="'Update'===action?'新建区域':'修改区域'"
      :visible.sync="showDialog"
      append-to-body
      width="50%"
      center
    >
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
import api from "@/api/view";
export default {
  name: "DetailViewSetting",
  props: {
    typeId: String,
    view: Object
  },
  data() {
    return {
      data: [1, 2, 3],
      list: [
        {
          name: "2321d331111111sad",
          title: "基本信息",
          border: true,
          rowSize: 2,
          fields: [
            {
              name: "name",
              displayAs: "名称",
              rowNum: 1,
              columnNum: 1
            }
          ]
        },
        {
          name: "32dadas",
          title: "详细信息",
          border: true,
          rowSize: 3,
          fields: [
            {
              name: "address",
              displayAs: "住址",
              rowNum: 1,
              columnNum: 3
            }
          ]
        }
      ],
      form: {},
      showDialog: false,
      action: "",
      rules: {
        rowSize: [{ required: true, message: "列数不能为空", trigger: "blur" }]
      }
    };
  },
  watch: {
    list() {
      console.log(this.list);
    }
  },
  methods: {
    createFieldSet() {
      let formRef = this.$refs["form"];
      if (formRef) formRef.resetFields();
      this.form = {};
      this.action = "Create";
      this.showDialog = true;
    },
    updateFieldSet(item) {
      this.form = { ...item };
      this.action = "Update";
      this.showDialog = true;
    },
    removeFieldSet(item) {
      let index = this.list.indexOf(item);
      if (index > -1) {
        this.list.splice(index, 1);
      }
    },
    createOrUpdateAction() {
      this.data.push(Math.random());
      this.showDialog = false;
    },
    getFieldFromItem(item, rowNum, columnNum) {
      for (const key in item.fields) {
        const element = item.fields[key];
        if (element.rowNum === rowNum && element.columnNum === columnNum) {
          return element;
        }
      }
      return null;
    },
    getMaxRowNum(item) {
      if (item.fields) {
        var max = 0;
        item.fields.forEach(field => {
          max = Math.max(max, field.rowNum);
        });
        return max;
      }
    }
  },
  created() {}
};
</script>
<style lang="less" scoped>
.bg-purple {
  background: #d3dce6;
}
.field-set {
  margin-top: 10px;
  .field-set-header {
    height: 32px;
    background-color: #eee;
    .field-set-title {
      height: 32px;
      line-height: 32px;
      padding-left: 10px;
    }
    .field-set-header-button {
      text-align: right;
    }
  }
  .field-set-content {
    padding: 10px 0;
  }
}
</style>


