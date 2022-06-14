<template>
  <button
    @click="$emit('handleClick')"
    class="py-2 px-6 rounded-sm self-start text-white bg-cy-blue duration-20 border-solid border-2 border-transparent hover:border-gray-700 hover:bg-cy-blue disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import Vue from "vue";
export default Vue.extend({
  methods: {
    handleClick() {
      this.$emit("click");
    },
  },
});
// import { Component, Emit, Prop, Vue } from "vue-property-decorator";
// @Component
// export default class Button extends Vue {
//   @Prop() onClick: any;
//   @Emit()
//   handleClick() {
//     this.$emit("clicka");
//   }
// }
</script>

<style scoped>
body {
  margin: 0;
  font-family: "Montserrat", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
