<template>

  <div>
    <div
      class="border field-set"
      v-for="(item,index) in list"
      :key="index"
    >
      <el-row class="field-set-header">
        <el-col
          class="field-set-title"
          :span="6"
        >{{item.title}}</el-col>
        <el-col
          class="field-set-header-button"
          :span="8"
          :offset="10"
        >
          <el-button
            plain
            type="info"
            size="small"
            @click="updateFieldSet(item)"
          >编辑</el-button>
          <el-button
            type="danger"
            plain
            size="small"
            @click="removeFieldSet(item)"
          >移除</el-button>
        </el-col>
      </el-row>
      <div class="field-set-content">
        <el-row
          :gutter="20"
          v-for="i in getMaxRowNum(item)"
          :key="i"
        >
          <el-col
            :span="24/item.rowSize"
            v-for="j in item.rowSize"
            :key="j"
          >
            <div
              v-if="field=getFieldFromItem(item,i,j)"
              class="bg-purple field-item"
            >
              <el-col
                :span="12"
                class="field-item-title"
              >{{field.displayAs}}</el-col>
              <el-button
                type="info"
                icon="el-icon-close"
                plain
                circle
                size="mini"
              ></el-button>
            </div>
            <div
              v-else
              class="bg-default"
            ></div>
          </el-col>
        </el-row>
      </div>
    </div>
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
      let that = this;
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return;
        }
        let tmpData = { ...that.form };
        tmpData.name = that.form.name || Math.random().toString(36);
        if ("Create" === that.action) {
          tmpData.fields = [];
          that.list.push(tmpData);
        } else {
          for (const key in that.list) {
            const element = that.list[key];
            if (element.name === tmpData.name) {
              that.$set(that.list, key, tmpData);
              break;
            }
          }
        }
        that.showDialog = false;
      });
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
.bg-default {
  min-height: 28px;
  background: #ffffff;
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
  .field-item {
    border-radius: 30px;
    text-align: right;
    .field-item-title {
      text-align: right;
      height: 28px;
      line-height: 28px;
    }
  }
}
.add-new {
  margin-top: 10px;
  text-align: center;
}
</style>