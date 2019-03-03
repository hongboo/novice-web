<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

<style lang="less">
@import url("//at.alicdn.com/t/font_831453_zrmsoqkf3ic.css");
.dragging {
  -ms-transform: scale(1.2);
  transform: scale(1.2);
  background-color: rgba(0, 153, 0, 0.1) !important;
}
.el-header {
  background-color: #f1f1f1;
}
.el-menu {
  height: 100%;
}
.border {
  border: 1px solid #e6e6e6;
  border-radius: 3px;
  box-shadow: 1px 1px 1px #f1efef;
}
.tab-title {
  margin-bottom: 7px;
  margin-left: 10px;
  font-size: larger;
}
.el-dialog__body {
  padding: 10px 20px !important;
}
.el-dialog.el-dialog--center {
  box-shadow: #8b9c90 0px 2px 100px 5px;
  border-radius: 10px;
}
div.el-table--small {
  font-size: 14px;
}
.icon-normal {
  color: rgb(16, 230, 16);
  font-size: 18px;
}
.el-form-item--small {
  margin-bottom: 15px !important;
}
.icon-override {
  color: red;
  font-size: 18px;
}
.icon-extends {
  color: yellow;
  font-size: 18px;
}
.table-operate {
  margin-bottom: 10px;
}
</style>

