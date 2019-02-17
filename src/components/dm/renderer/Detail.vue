<template>
  <div>
    <div class="panel-title">
      {{business.title}}
    </div>
    <div class="panel-body">
      <div
        class="content-box"
        :class="{'none-content-border': !fieldSet.border}"
        v-for="(fieldSet,index) in business.view.fieldSets"
        :key="index"
      >
        <div
          class="content-box-header"
          v-if="fieldSet.border&&fieldSet.title"
        >{{fieldSet.title}}</div>
        <div class="content-box-wrapper">
          <el-row
            class="wrapper-row"
            :gutter="30"
            v-for="i in maxRowNum(fieldSet.fields)"
            :key="i"
          >
            <el-col
              :span="24/fieldSet.rowSize"
              v-for="j in fieldSet.rowSize"
              :key="j"
            >
              <div v-if="field=getFieldFromItem(fieldSet.fields,i,j)">
                <component
                  v-bind:is="field.widget.editor"
                  :label="field.displayAs"
                  :defaultValue="form[field.name]"
                  :name="field.name"
                  :allowBlank="field.widget.allowBlank"
                  :readOnly="field.widget.readOnly"
                  :ref="`dm-${field.name}`"
                ></component>
                <!-- <component
                  v-bind:is="field.widget.editor"
                  :defaultValue="form[field.name]"
                  :name="field.name"
                  :allowBlank="false"
                  :readOnly="field.widget.readOnly"
                  :ref="`dm-${field.name}`"
                ></component> -->
              </div>
              <div
                v-else
                class="bg-default"
              ></div>
            </el-col>
          </el-row>
        </div>
      </div>
      <el-button
        type="primary"
        @click="onSubmit"
      >立即创建</el-button>
      <el-button>取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "DetailRenderer",
  props: {
    business: Object
  },
  data() {
    return {
      form: {}
    };
  },
  computed: {},
  methods: {
    maxRowNum(fields) {
      var maxNum = 0;
      fields.forEach(field => {
        maxNum = Math.max(field.rowNum, maxNum);
      });
      return maxNum;
    },
    getFieldFromItem(fields, rowNum, columnNum) {
      return fields.find(
        element => element.rowNum === rowNum && element.columnNum === columnNum
      );
    },
    getFieldComponents() {
      let dms = [];
      for (const key in this.$refs) {
        if (key.startsWith("dm-")) {
          dms.push(this.$refs[key][0]);
        }
      }
      return dms;
    },
    onSubmit() {
      let dms = this.getFieldComponents();
      let data = {};
      var verify = true;
      dms.forEach(dm => {
        verify &= dm.validate();
        data[dm.name] = dm.getValue();
      });
      console.log(data);
    }
  },
  created() {},
  mounted() {}
};
</script>

<style lang="less" scoped>
</style>


