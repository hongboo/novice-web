<template>
  <div
    class="dm-component"
    :class="{'required':!allowBlank,'error':!verify}"
  >
    <el-row :gutter="15">
      <el-col
        :span="6"
        v-if="label"
        class="dm-label"
      >
        {{label}}
      </el-col>
      <el-col :span="label?18:24">
        <el-input
          v-model="value"
          :label="name"
          :disabled="readOnly"
          :class="{'error':!validate}"
          @blur="validate"
        ></el-input>
        <div
          class="dm-error"
          v-if="!verify"
        >
          {{error}}
        </div>
      </el-col>
    </el-row>

  </div>

</template>
<script>
export default {
  name: "DmInput",
  props: {
    name: String,
    label: String,
    defaultValue: String,
    change: Function,
    allowBlank: {
      type: Boolean,
      default: true
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      value: this.defaultValue,
      verify: true,
      error: ""
    };
  },
  watch: {
    value() {
      if (this.change) {
        this.change(this.value);
      }
    }
  },
  methods: {
    getValue() {
      return this.value;
    },
    validate() {
      this.verify = this.allowBlank || this.value;
      if (!this.verify) this.error = `请输入${this.label || "..."}`;
      return this.verify;
    }
  },
  created() {}
};
</script>
<style>
.dm-component.error .el-input__inner {
  border-color: #f56c6c;
}
</style>
