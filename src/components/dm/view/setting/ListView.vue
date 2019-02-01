<template>
  <div style="margin-right:15px">
    <el-row class="item-title">设置列字段</el-row>
    <el-row class="item-content border">
      <el-checkbox-group v-model="rowFieldNames">
        <el-checkbox
          :label="item.name"
          v-for="(item,index) in fields"
          :key="index"
        >{{item.displayAs}}</el-checkbox>
      </el-checkbox-group>
    </el-row>
    <el-row class="item-content">
      <el-tag
        :style="`width:${item.width}%`"
        v-for="(item,index) in view.rowFields"
        :key="index"
        @click.native="updateRowField(item)"
      >{{item.displayAs}}</el-tag>
    </el-row>
    <el-row class="item-title">设置查询字段</el-row>
    <el-row class="item-content">
      <el-transfer
        size="small"
        :titles="transferTitles"
        v-model="conditionFieldNames"
        :data="transferFieldsData"
      >
      </el-transfer>
    </el-row>
    <el-row class="item-title">数据设置</el-row>
    <el-row class="item-content">
      <el-form
        label-width="80px"
        label-position="left"
      >
        <el-form-item
          label="排序字段"
          prop="sortBy"
        >
          <el-select
            v-model="view.sortBy"
            filterable
            size="small"
          >
            <el-option
              v-for="item in fields"
              :key="item.name"
              :label="item.displayAs"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="排序方式"
          prop="asc"
        >
          <el-switch
            v-model="view.asc"
            active-text="正序"
            inactive-text="倒序"
          >
          </el-switch>
        </el-form-item>
        <el-form-item
          label="页面大小"
          prop="pageSize"
        >
          <el-input-number
            label="页面大小"
            size="small"
            v-model="view.pageSize"
            controls-position="right"
            :min="-1"
            :max="30"
          ></el-input-number>
        </el-form-item>
      </el-form>
    </el-row>
    <el-dialog
      width="30%"
      title="编辑列字段"
      :visible.sync="rowFieldDialogVisible"
      append-to-body
      class="inner-dialog-field"
      center
    >
      <el-form
        :model="formRowField"
        ref="formRowField"
        status-icon
        :rules="formRowFieldRules"
        label-width="80px"
      >
        <el-form-item
          label="字段名"
          prop="name"
        >
          <el-input
            v-model="formRowField.name"
            disabled
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="显示名"
          prop="displayAs"
        >
          <el-input
            v-model="formRowField.displayAs"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="动态宽度"
          prop="dynamicWidth"
        >
          <el-switch
            v-model="formRowField.dynamicWidth"
            active-color="#13ce66"
          >
          </el-switch>
        </el-form-item>
        <el-form-item
          label="宽度"
          prop="width"
        >
          <el-input-number
            size="small"
            v-model="formRowField.width"
            controls-position="right"
            :min="1"
            :max="100"
            :disabled="formRowField.dynamicWidth"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          label="支持排序"
          prop="sort"
        >
          <el-switch
            v-model="formRowField.sort"
            active-color="#13ce66"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="saveRowField"
        >确 定</el-button>
        <el-button @click="rowFieldDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import viewApi from "@/api/view";
import fieldApi from "@/api/field";
export default {
  name: "ListViewSetting",
  props: {
    typeId: String,
    view: Object
  },
  data() {
    return {
      transferTitles: ["字段", "已选字段"],
      transferFieldsData: [],
      fields: [],
      conditionFieldNames: [],
      rowFieldNames: [],
      rowFieldDialogVisible: false,
      formRowField: {},
      formRowFieldRules: {
        displayAs: [
          { required: true, message: "显示名不能为空", trigger: "blur" }
        ],
        width: [{ required: true, message: "宽度不能为空", trigger: "blur" }]
      }
    };
  },
  watch: {
    view() {
      this.init();
    },
    rowFieldNames() {
      this.syncRowFields();
    },
    conditionFieldNames() {
      this.syncConditionFields();
    },
    fields(value) {
      let that = this;
      that.transferFieldsData = [];
      value.forEach(field => {
        that.transferFieldsData.push({
          key: field.name,
          label: field.displayAs
        });
      });
      this.checkFieldNames("rowFieldNames");
      this.checkFieldNames("conditionFieldNames");
    }
  },
  methods: {
    checkFieldNames(name) {
      if (!this[name] || this[name].length === 0) return;
      let tmpFieldNames = [...this[name]];
      for (var i = 0; i < tmpFieldNames.length; i++) {
        if (!this.getField(tmpFieldNames[i])) {
          this.$message({
            type: "error",
            message: tmpFieldNames[i] + " 未找到"
          });
          tmpFieldNames.splice(i, 1);
          i--;
        }
      }
      if (tmpFieldNames.length !== this[name].length) {
        this[name] = tmpFieldNames;
      }
    },
    getField(name) {
      for (const key in this.fields) {
        const element = this.fields[key];
        if (name === element.name) return element;
      }
      return null;
    },
    getFields() {
      fieldApi.list(this.typeId).then(res => {
        this.fields = res.data.body;
      });
    },
    init() {
      this.view.conditionFields = this.view.conditionFields || [];
      this.view.rowFields = this.view.rowFields || [];
      let that = this;
      that.conditionFieldNames = [];
      that.rowFieldNames = [];
      that.view.conditionFields.forEach(field => {
        that.conditionFieldNames.push(field.name);
      });
      that.view.rowFields.forEach(field => {
        that.rowFieldNames.push(field.name);
      });
    },
    syncConditionFields() {
      let newAdd = [...this.conditionFieldNames];
      let conditionFields = [...this.view.conditionFields];
      for (var i = 0; i < conditionFields.length; i++) {
        let index = newAdd.indexOf(conditionFields[i].name);
        if (index === -1) {
          conditionFields.splice(i, 1);
          i--;
        } else {
          newAdd.splice(index, 1);
        }
      }
      let that = this;
      newAdd.forEach(fieldName => {
        let field = that.getField(fieldName);
        conditionFields.push({
          name: fieldName,
          displayAs: field.displayAs
        });
      });
      this.view.conditionFields = conditionFields;
    },
    syncRowFields() {
      let newAdd = [...this.rowFieldNames];
      let rowFields = [...this.view.rowFields];
      let width = 0;
      let dynamicCellSize = 0;
      for (var i = 0; i < rowFields.length; i++) {
        let index = newAdd.indexOf(rowFields[i].name);
        if (index === -1) {
          rowFields.splice(i, 1);
          i--;
        } else {
          newAdd.splice(index, 1);
          if (!rowFields[i].dynamicWidth) {
            width += rowFields[i].width;
          } else {
            dynamicCellSize++;
          }
        }
      }
      dynamicCellSize += newAdd.length;
      let dynamicCellWidth = parseInt((100 - width) / dynamicCellSize);
      rowFields.forEach(field => {
        if (field.dynamicWidth) field.width = dynamicCellWidth;
      });
      let that = this;
      newAdd.forEach(fieldName => {
        let field = that.getField(fieldName);
        rowFields.push({
          name: fieldName,
          displayAs: field.displayAs,
          dynamicWidth: true,
          width: dynamicCellWidth,
          sort: false
        });
      });
      this.view.rowFields = rowFields;
    },
    updateRowField(rowField) {
      this.formRowField = { ...rowField };
      this.rowFieldDialogVisible = true;
    },
    saveRowField() {
      this.$refs["formRowField"].validate(valid => {
        if (!valid) {
          return;
        }
        let rowFields = this.view.rowFields;
        for (const key in rowFields) {
          if (rowFields[key].name === this.formRowField.name) {
            rowFields[key] = this.formRowField;
            break;
          }
        }
        this.syncRowFields();
        this.rowFieldDialogVisible = false;
      });
    }
  },
  created() {
    this.getFields();
    this.init();
  }
};
</script>

<style lang="less" scoped>
.item-title {
  margin-bottom: 8px;
  font-size: 16px;
  border-bottom: 1px solid #edf1f9;
}
.item-content {
  margin-bottom: 13px;
  margin-left: 13px;
  .el-tag {
    text-align: center;
    cursor: pointer;
  }
  .el-form-item {
    margin-bottom: 9px;
  }
}

.inner-dialog-field {
  .el-form-item {
    margin-bottom: 9px;
  }
}
</style>


