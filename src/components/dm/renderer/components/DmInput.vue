<template>
  <div class="dm-component" :class="{ required: !allowBlank, error: !verify }">
    <el-row :gutter="15">
      <el-col :span="6" v-if="label" class="dm-label">{{ label }}</el-col>
      <el-col :span="label ? 18 : 24">
        <el-input
          v-model="value"
          :label="name"
          :disabled="readOnly"
          :class="{ error: !validate }"
          size="small"
          @blur="validate"
        ></el-input>
        <div class="dm-error" v-if="!verify">{{ error }}</div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import DmComponent from "./DmComponent";
export default {
  extends: DmComponent,
  name: "DmInput",
};
</script>
<style>
.dm-component.error .el-input__inner {
  border-color: #f56c6c;
}
</style>
