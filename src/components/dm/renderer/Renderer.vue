<template>
  <div>Renderer</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "Renderer",
  props: {
    business: Object
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["loadBusiness", "loadAction"]),
    isPannel() {
      return !(this.business.view && this.business.view.windows);
    }
  },
  watch: {
    business() {
      this.refresh();
    }
  },
  methods: {
    ...mapActions([
      "executeBusiness",
      "executeAction",
      "reOpenUrlExecute",
      "completeBackHashing",
      "backBusinessHash"
    ]),
    getOperationParams() {},
    refresh() {
      console.log("refresh");
    },
    close() {
      if (this.isPannel) {
        this.backBusinessHash();
      } else {
        console.log("close window");
      }
    },
    executeInitAction(params = {}, callback) {
      if (!this.business.initAction) return;
      this.executeAction({
        name: this.business.initAction,
        typeId: this.business.typeId,
        params: params,
        callback: callback
      });
    },
    executeDefaultOperation() {
      let defaultOpe = this.business.operations.find(ope => ope.defaultOpe);
      if (defaultOpe) this.executeOperation(defaultOpe);
    },
    executeOperation(operation) {
      let that = this;
      let data = {
        name: operation.target,
        typeId: this.business.typeId,
        callback: data => {
          switch (operation.callbackMode) {
            case "Close":
              that.close();
              break;
            case "Refresh":
              that.refresh();
              break;
          }
        }
      };
      if (!this.targetModeIsCollection(operation)) {
        try {
          data.params = this.getOperationParams();
        } catch (error) {
          that.$message({
            type: "error",
            message: error
          });
          return;
        }
      }
      if (operation.type === "Business") {
        this.executeBusiness(data);
      } else {
        this.executeAction(data);
      }
    },
    operationAvailable(operation, entity) {
      return entity || this.targetModeIsCollection(operation);
    },
    targetModeIsCollection(operation) {
      let target =
        operation.type === "Action"
          ? this.loadAction(this.business.typeId, operation.target)
          : this.loadBusiness(this.business.typeId, operation.target);
      return target && target.mode === "Collection";
    }
  },
  created() {
    this.refresh();
  },
  mounted() {
    this.reOpenUrlExecute();
    this.completeBackHashing();
  }
};
</script>

