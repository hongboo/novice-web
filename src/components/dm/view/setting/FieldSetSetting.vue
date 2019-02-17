<template>
  <div>
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
              <el-dropdown-item
                @click.native="addFiled()"
                :disabled="waitFields.length===0"
              >添加字段</el-dropdown-item>
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
            v-for="(field,index) in waitFields"
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
    waitFields: Array
  },
  data() {
    return {
      showAddFieldDialog: false,
      checkList: []
    };
  },
  computed: {
    selectedFields() {
      return this.fieldSet.fields;
    },
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
    rowSize(value) {
      var change = false;
      let selectedFields = [];
      let tmpSelectFields = [...this.selectedFields];
      tmpSelectFields.sort((a, b) =>
        a.columnNum === b.columnNum
          ? a.rowNum - b.rowNum
          : a.columnNum - b.columnNum
      );
      var column = 0;
      tmpSelectFields.forEach(field => {
        let tmpField = { ...field };
        column++;
        if (field.columnNum > value) {
          change = true;
          tmpField.columnNum = column % value || value;
          tmpField.rowNum +=
            (column % value ? column / value : (column - 1) / value) + 1;
        }
        selectedFields.push(tmpField);
      });
      if (change) {
        this.fieldSet.fields = selectedFields;
      }
    },
    selectedFields(value) {
      let arr = ["01", "02", "03"];
      var change = false;
      let selectedFields = [];
      let tmpSelectFields = [...value];
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
        this.fieldSet.fields = selectedFields;
      }
    }
  },
  methods: {
    saveField() {
      let newSelected = [];
      this.checkList.forEach(name => {
        let element = this.waitFields.find(field => field.name === name);
        if (element) {
          this.waitFields.splice(this.waitFields.indexOf(element), 1);
          newSelected.push({ ...element });
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
        that.fieldSet.fields.push({
          name: field.name,
          displayAs: field.displayAs,
          rowNum: rowNum,
          columnNum: columnNum,
          widget: field.widget
        });
      });
      this.showAddFieldDialog = false;
    },
    addFiled() {
      this.checkList = [];
      this.showAddFieldDialog = true;
    },
    removeField(i, j) {
      let element = this.fieldSet.fields.find(
        field => field.rowNum === i && field.columnNum === j
      );
      if (element) {
        this.fieldSet.fields.splice(this.fieldSet.fields.indexOf(element), 1);
        let field = this.waitFields.find(field => field.name === element.name);
        if (!field) this.waitFields.push(element);
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
  padding: 10px;
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

