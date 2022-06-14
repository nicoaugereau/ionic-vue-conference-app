<template>
  <div class="max-w-screen-sm p-12 mx-auto bg-gray-50 rounded-md shadow-lg">
    <h1 class="text-2xl">Welcome {{ username }}!</h1>
    <Button class="mt-2" @click="handleLogout" @logout="$emit('logout')"
      >Log Out</Button
    >
  </div>
</template>

<script>
import Button from "./Button.vue";
import Vue from "vue";
export default Vue.extend({
  components: {
    Button,
  },
  props: {
    username: String,
  },
  methods: {
    handleLogout() {
      this.$emit("logout");
    },
  },
});
</script>

<style></style>
