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

      <grid-layout
        :layout.sync="layout"
        :colNum="rowSize"
        :rowHeight="30"
        :isResizable="false"
      >
        <grid-item
          v-for="item in layout"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :key="item.i"
          @moved="layoutItemMoved"
        >
          <div class="bg-purple field-item">
            <el-button
              type="text"
              size="mini"
              @click="updateField(item.i)"
            > {{item.displayAs}} </el-button>
            <el-button
              type="info"
              icon="el-icon-close"
              plain
              circle
              size="mini"
              @click="removeField($event,item.x,item.y)"
            ></el-button>
          </div>
        </grid-item>
      </grid-layout>

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

    <el-dialog
      title="控件属性"
      :visible.sync="widgetShow"
      width="30%"
      append-to-body
      center
    >
      <widget
        :widget="widget"
        hiddenSearch
        v-if="widgetShow"
      ></widget>
      <div
        class="dialog-footer"
        slot="footer"
      >
        <el-button
          type="primary"
          @click="currentField.widget=widget;widgetShow=false;"
        >确 定</el-button>
        <el-button @click="widgetShow = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Widget from "@/components/dm/field/Widget";
import VueGridLayout from "vue-grid-layout";
export default {
  name: "FieldSetSetting",
  props: {
    fieldSet: Object,
    waitFields: Array
  },
  components: {
    Widget,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  },
  data() {
    return {
      showAddFieldDialog: false,
      widgetShow: false,
      currentField: {},
      widget: {},
      checkList: [],
      layout: []
    };
  },
  computed: {
    selectedFields() {
      return this.fieldSet.fields;
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
        if (field.columnNum > value - 1) {
          change = true;
          tmpField.columnNum = (column % value || value) - 1;
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
      let arr = [];
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
        if (arr.indexOf(beforeNumStr) > -1 || field.rowNum === 0) {
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
      this.initLayout();
    }
  },
  methods: {
    initLayout() {
      let layout = [];
      this.selectedFields.forEach(field =>
        layout.push({
          x: field.columnNum,
          y: field.rowNum,
          w: 1,
          h: 1,
          i: field.name,
          displayAs: field.displayAs
        })
      );
      this.layout = layout;
    },
    layoutItemMoved() {
      let selectedFields = [];
      this.layout.forEach(item => {
        let field = this.selectedFields.find(tmp => tmp.name === item.i);
        if (field) {
          selectedFields.push(
            Object.assign({ ...field }, { columnNum: item.x, rowNum: item.y })
          );
        }
      });
      this.fieldSet.fields = selectedFields;
    },
    updateField(name) {
      this.currentField = this.selectedFields.find(tmp => tmp.name === name);
      this.widget = { ...this.currentField.widget };
      this.widgetShow = true;
    },
    saveField() {
      if (this.checkList.length === 0) return;
      let newSelected = [];
      this.checkList.forEach(name => {
        let element = this.waitFields.find(field => field.name === name);
        if (element) {
          this.waitFields.splice(this.waitFields.indexOf(element), 1);
          newSelected.push({ ...element });
        }
      });
      var maxField = this.getMaxField();
      let rowSize = this.fieldSet.rowSize;
      var rowNum = maxField ? maxField.rowNum : 0;
      var columnNum = maxField ? maxField.columnNum : 0;
      let that = this;
      newSelected.forEach(field => {
        let next = columnNum >= rowSize - 1;
        columnNum = next ? 0 : columnNum + 1;
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
    removeField(event, columnNum, rowNum) {
      event.stopPropagation();
      let element = this.getFieldFromItem(columnNum, rowNum);
      if (element) {
        this.fieldSet.fields.splice(this.fieldSet.fields.indexOf(element), 1);
        let field = this.waitFields.find(field => field.name === element.name);
        if (!field) this.waitFields.push(element);
      }
    },
    getFieldFromItem(columnNum, rowNum) {
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
    this.initLayout();
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
    cursor: move;
  }
}
</style>

