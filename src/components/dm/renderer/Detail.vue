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
          <grid-layout
            :layout="layoutData=layout(fieldSet.fields)"
            :colNum="fieldSet.rowSize"
            :rowHeight="30"
            :isResizable="false"
            :isDraggable="false"
          >
            <grid-item
              v-for="item in layoutData"
              :x="item.x"
              :y="item.y"
              :w="item.w"
              :h="item.h"
              :i="item.i"
              :key="item.i"
            >
              <component
                v-bind:is="item.widget.editor"
                :label="item.displayAs"
                :defaultValue="form[item.name]"
                :name="item.name"
                :allowBlank="item.widget.allowBlank"
                :readOnly="item.widget.readOnly"
                :ref="`dm-${item.name}`"
              ></component>
            </grid-item>
          </grid-layout>
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
import VueGridLayout from "vue-grid-layout";
export default {
  name: "DetailRenderer",
  props: {
    business: Object
  },
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  },
  data() {
    return {
      form: {}
    };
  },
  computed: {},
  methods: {
    layout(fields) {
      let layout = [];
      fields.forEach(field =>
        layout.push(
          Object.assign(
            {
              x: field.columnNum,
              y: field.rowNum,
              w: 1,
              h: 1,
              i: field.name,
              field: field
            },
            { ...field }
          )
        )
      );
      return layout;
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
      console.log(verify);
    }
  },
  created() {},
  mounted() {}
};
</script>

<style lang="less" scoped>
</style>


