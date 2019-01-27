<template>
  <div>
    hohoho,{{view}}!
  </div>
</template>

<script>
import api from "@/api/view";
export default {
  name: "DetailView",
  props: {
    typeId: String,
    view: Object
  },
  data() {
    return {};
  },
  methods: {},
  created() {}
};
</script>

