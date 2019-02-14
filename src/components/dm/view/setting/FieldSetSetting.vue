<template>
  <div class="border field-set">
    <div>
      <el-row class="field-set-header">
        <el-col
          class="field-set-title"
          :span="6"
        >{{fieldSet.title}}</el-col>
        <el-col
          class="field-set-header-button"
          :span="8"
          :offset="10"
        >
          <el-dropdown>
            <el-button
              type="primary"
              size="small"
              plain
            >
              设置<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="addFiled()">添加字段</el-dropdown-item>
              <el-dropdown-item @click.native="$emit('updateFieldSet',fieldSet)">编辑</el-dropdown-item>
              <el-dropdown-item @click.native="$emit('removeFieldSet',fieldSet)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </div>
    <div class="field-set-content">
      <el-row
        :gutter="20"
        v-for="i in maxRowNum"
        :key="i"
        class="field-row"
      >
        <el-col
          :span="24/fieldSet.rowSize"
          v-for="j in fieldSet.rowSize"
          :key="j"
        >
          <div
            v-if="field=getFieldFromItem(i,j)"
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
              @click="removeField(i,j)"
            ></el-button>
          </div>
          <div
            v-else
            class="bg-default"
          ></div>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      title="选择字段"
      :visible.sync="showAddFieldDialog"
      append-to-body
      width="30%"
      center
    >
      <div class="dialog-div">
        <el-checkbox-group v-model="checkList">
          <div
            class="select-checkbox"
            v-for="(field,index) in waitAddFields"
            :key="index"
          >
            <el-checkbox
              :label="field.name"
              border
            >{{field.displayAs}}</el-checkbox>
          </div>
        </el-checkbox-group>

      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="saveField"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "FieldSetSetting",
  props: {
    fieldSet: Object,
    fields: Array
  },
  data() {
    return {
      selectedFields: [],
      showAddFieldDialog: false,
      waitAddFields: [],
      checkList: []
    };
  },
  computed: {
    maxRowNum() {
      var maxNum = 0;
      this.selectedFields.forEach(field => {
        maxNum = Math.max(field.rowNum, maxNum);
      });
      return maxNum;
    },
    rowSize() {
      return this.fieldSet.rowSize;
    }
  },
  watch: {
    fieldSet() {
      this.fieldSet.fields = this.fieldSet.fields || [];
      this.selectedFields = this.fieldSet.fields;
    },
    rowSize(value) {
      var change = false;
      let selectedFields = [];
      var column = 0;
      this.selectedFields.forEach(field => {
        let tmpField = { ...field };
        if (field.columnNum > value) {
          change = true;
          column++;
          tmpField.columnNum = column % value || value;
          tmpField.rowNum +=
            (column % value ? column / value : (column - 1) / value) + 1;
        }
        selectedFields.push(tmpField);
      });
      if (change) {
        this.selectedFields = selectedFields;
      }
    },
    selectedFields() {
      let arr = ["01", "02", "03"];
      var change = false;
      let selectedFields = [];
      let tmpSelectFields = [...this.selectedFields];
      tmpSelectFields.sort((a, b) =>
        a.columnNum === b.columnNum
          ? a.rowNum - b.rowNum
          : a.columnNum - b.columnNum
      );
      tmpSelectFields.forEach(field => {
        let beforeNumStr = field.rowNum - 1 + "" + field.columnNum;
        if (arr.indexOf(beforeNumStr) > -1) {
          selectedFields.push({ ...field });
          arr.push(field.rowNum + "" + field.columnNum);
        } else {
          change = true;
          let tmpField = { ...field };
          tmpField.rowNum = field.rowNum - 1;
          selectedFields.push(tmpField);
          arr.push(tmpField.rowNum + "" + tmpField.columnNum);
        }
      });
      if (change) {
        this.selectedFields = selectedFields;
      }
    }
  },
  methods: {
    saveField() {
      let newSelected = [];
      this.checkList.forEach(name => {
        for (const key in this.waitAddFields) {
          const element = this.waitAddFields[key];
          if (element.name === name) {
            newSelected.push({ ...element });
            break;
          }
        }
      });
      let maxField = this.getMaxField();
      let rowSize = this.fieldSet.rowSize;
      var rowNum = maxField ? maxField.rowNum : 1;
      var columnNum = maxField ? maxField.columnNum : 0;
      let that = this;
      newSelected.forEach(field => {
        let next = columnNum >= rowSize;
        columnNum = next ? 1 : columnNum + 1;
        rowNum = next ? rowNum + 1 : rowNum;
        that.selectedFields.push({
          name: field.name,
          displayAs: field.displayAs,
          rowNum: rowNum,
          columnNum: columnNum
        });
      });
      this.showAddFieldDialog = false;
    },
    addFiled() {
      let addedNames = [];
      let waitAddFields = [...this.fields];
      this.fields.forEach(field => {
        addedNames.push(field.name);
      });
      this.selectedFields.forEach(field => {
        let index = addedNames.indexOf(field.name);
        if (index > -1) {
          addedNames.splice(index, 1);
          waitAddFields.splice(index, 1);
        }
      });
      this.waitAddFields = waitAddFields;
      this.checkList = [];
      this.showAddFieldDialog = true;
    },
    removeField(i, j) {
      for (const key in this.selectedFields) {
        const element = this.selectedFields[key];
        if (element.rowNum === i && element.columnNum === j) {
          this.selectedFields.splice(key, 1);
          return;
        }
      }
    },
    getFieldFromItem(rowNum, columnNum) {
      return this.selectedFields.find(
        element => element.rowNum === rowNum && element.columnNum === columnNum
      );
    },
    getMaxField() {
      var maxField;
      this.selectedFields.forEach(field => {
        if (maxField) {
          if (
            field.rowNum >= maxField.rowNum &&
            field.columnNum >= maxField.columnNum
          ) {
            maxField = field;
          }
        } else {
          maxField = field;
        }
      });
      return maxField;
    }
  },
  created() {
    this.fieldSet.fields = this.fieldSet.fields || [];
    this.selectedFields = this.fieldSet.fields;
  }
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
.dialog-div {
  height: 260px;
  overflow-y: auto;
  .select-checkbox {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
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
  .field-row {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
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
</style>

