<template>
  <div>
    <div class="panel-title">
      {{ business.title }}
    </div>
    <div class="panel-body">
      <div
        :class="{ 'content-box': fieldSet.border }"
        v-for="(fieldSet, index) in business.view.fieldSets"
        :key="index"
      >
        <div
          class="content-box-header"
          v-if="fieldSet.border && fieldSet.title"
        >
          {{ fieldSet.title }}
        </div>
        <div :class="{ 'content-box-wrapper': fieldSet.border }">
          <grid-layout
            :layout="(layoutData = layout(fieldSet.fields))"
            :colNum="fieldSet.rowSize"
            :rowHeight="32"
            :margin="[15, 14]"
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
      <div class="operation-group">
        <el-button
          v-for="item in business.operations"
          :type="item.level"
          :plain="item.plain"
          :round="item.round"
          :key="item.id"
          @click="execute(item)"
          >{{ item.name }}</el-button
        >
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import VueGridLayout from "vue-grid-layout";
import { mapGetters, mapActions } from "vuex";
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
      form: {},
      entity: null
    };
  },
  computed: {
    ...mapGetters(["getEntity"])
  },
  methods: {
    ...mapActions(["executeBusiness", "executeAction"]),
    refresh() {
      let entityId = this.business.params.entityId;
      if (entityId) {
        this.entity = this.getEntity(entityId, this.business.typeId);
        if (this.entity) {
          this.form = { ...this.entity.properties };
        }
      }
    },
    back() {
      console.log("back");
    },
    close() {
      console.log("close");
    },
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
              i: field.name
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
    execute(operation) {
      let dms = this.getFieldComponents();
      let properties = {};
      var verify = true;
      dms.forEach(dm => {
        if (dm.validate()) {
          properties[dm.name] = dm.getValue();
        } else {
          verify = false;
        }
      });
      if (!verify) return;
      let that = this;
      if (operation.type === "Action") {
        this.executeAction({
          name: operation.target,
          typeId: this.business.typeId,
          params: {
            entityId: this.business.params.entityId,
            properties: properties
          },
          callback: function(res) {
            if (res.code === 1) {
              switch (operation.callbackMode) {
                case "Close":
                  that.close();
                  break;
                case "Back":
                  that.back();
                  break;
                case "Refresh":
                  that.refresh();
                  break;
              }
            } else {
              that.$message({
                type: "error",
                message: res.description
              });
            }
          }
        });
      } else if (operation.type === "Business") {
        this.executeBusiness({
          name: operation.target,
          typeId: this.business.typeId,
          params: {
            entityId: this.business.params.entityId,
            properties: properties
          }
        });
      }
    },
    cancel() {
      history.back();
    }
  },
  created() {},
  mounted() {
    let that = this;
    setTimeout(() => {
      that.refresh();
    }, 1);
  }
};
</script>

<style lang="less" scoped>
</style>


