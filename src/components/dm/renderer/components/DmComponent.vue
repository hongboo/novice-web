<template>
 <div>DmComponent</div>
</template>
<script>
export default {
  name: "DmComponent",
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
    },
    defaultValue(val) {
      this.value = val;
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
