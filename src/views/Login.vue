<template>
  <el-container>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="8" :offset="8">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="用户名">
              <el-input v-model="form.username" placeholder="用户名" clearable="true"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="form.password" type="password" placeholder="密码" clearable="true"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="login">登陆</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-main>
  </el-container>

</template>
<script>
export default {
  name: "login",
  data() {
    return {
      form: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    login() {}
  }
};
</script>
