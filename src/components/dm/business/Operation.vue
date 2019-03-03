<template>
  <el-form
    :model="form"
    ref="form"
    size="small"
    :rules="rules"
    status-icon
    label-width="80px"
  >
    <el-form-item label="名称" prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="类型" prop="type">
      <el-radio-group v-model="form.type" @change="changeOperationType">
        <el-radio
          :label="item.value"
          v-for="item in operationTypes"
          :key="item.value"
          >{{ item.display }}</el-radio
        >
      </el-radio-group>
    </el-form-item>
    <el-form-item
      :label="enumDisplay(operationTypeEnum, form.type)"
      prop="target"
    >
      <el-select v-model="form.target" filterable @change="changeTarget">
        <el-option
          v-for="item in targetSelects"
          :key="item.name"
          :value="item.name"
          :label="item.displayAs"
          :title="item.name"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="回调" prop="callbackMode">
      <el-select v-model="form.callbackMode">
        <el-option
          v-for="item in callbackModes"
          :key="item.value"
          :value="item.value"
          :label="item.display"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="默认" prop="defaultOpe"
      ><el-switch v-model="form.defaultOpe"></el-switch>
    </el-form-item>
    <el-form-item label="级别" prop="level">
      <el-select v-model="form.level">
        <el-option
          v-for="item in operationLevels"
          :key="item.value"
          :value="item.value"
          :label="item.display"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="朴素" prop="plain"
      ><el-switch v-model="form.plain"></el-switch>
    </el-form-item>
    <el-form-item label="圆角" prop="round"
      ><el-switch v-model="form.round"></el-switch>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Operation",
  props: {
    typeId: String,
    form: Object
  },
  data() {
    return {
      typeTarget: {},
      operationTypeEnum: "com.novice.framework.datamodel.enums.OperationType",
      callbackModeEnum: "com.novice.framework.datamodel.enums.CallbackMode",
      operationLevelEnum: "com.novice.framework.datamodel.enums.OperationLevel",
      rules: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        target: [
          { required: true, message: "执行内容不能为空", trigger: "change" }
        ]
      },
    };
  },
  computed: {
    ...mapGetters(["loadEnum", "enumDisplay", "loadType"]),
    operationTypes() {
      return this.loadEnum(this.operationTypeEnum);
    },
    operationLevels() {
      return this.loadEnum(this.operationLevelEnum);
    },
    callbackModes() {
      return this.loadEnum(this.callbackModeEnum);
    },
    type() {
      return this.loadType(this.typeId);
    },
    targetSelects() {
      if (this.type && this.form) {
        return this.form.type === "Action"
          ? this.type.actions
          : this.type.businesses;
      }
      return [];
    }
  },
  watch: {
    form() {
      this.fixForm();
    }
  },
  methods: {
    fixForm() {
      this.typeTarget = {};
      if (!this.form.id) {
        if (this.$refs["form"]) {
          this.$refs["form"].resetFields();
        }
      } else {
        this.typeTarget[this.form.type] = this.form.target;
      }
    },
    changeOperationType(val) {
      this.form.target = this.typeTarget[val] || "";
    },
    changeTarget(val) {
      this.typeTarget[this.form.type] = val;
    },
    validate() {
      return new Promise(reject => {
        this.$refs["form"].validate(valid => {
          reject(valid);
        });
      });
    }
  },
  created() {
    this.fixForm();
  }
};
</script>

