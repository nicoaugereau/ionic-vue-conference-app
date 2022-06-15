<template>
  <button
    @click="handleClick"
    class="py-2 px-6 rounded-sm self-start text-white bg-cy-blue duration-20 border-solid border-2 border-transparent hover:border-gray-700 hover:bg-cy-blue disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import Vue from "vue";
export default Vue.extend({
  methods: {
    handleClick(event: any) {
      //console.log(event.type);
      return this.$emit("click");
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
button {
  /* remove default behavior */
  appearance: none;
  -webkit-appearance: none;
  /* usual styles */
  margin-top: 40px;
  padding: 10px 50px;
  border: none;
  background-color: #3f51b5;
  color: #fff;
  font-weight: 600;
  border-radius: 5px;
  width: 100%;
}
</style>
