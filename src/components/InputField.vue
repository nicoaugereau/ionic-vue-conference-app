<template>
  <label class="flex flex-col text-lg text-gray-800 mb-2">
    {{ label }}:
    <input
      v-bind="$attrs"
      class="inputFields"
      :value="value"
      @input="handleChange"
    />
    <span class="text-red-500 mt-2" v-if="submitted && !value">{{
      requiredMessage
    }}</span>
  </label>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  inheritAttrs: false,
  props: {
    label: String,
    submitted: Boolean,
    requiredMessage: String,
    value: String,
  },
  methods: {
    handleChange(event: any) {
      this.$emit("input", event.target.value);
    },
  },
});
// import { Component, Emit, Prop, Vue } from "vue-property-decorator";

// @Component
// export default class InputField extends Vue {
//   @Prop() label!: String;
//   @Prop() submitted!: Boolean;
//   @Prop() requiredMessage: String | undefined;
//   @Prop() value: String | undefined;

//   @Emit()
//   handleChange(event: any) {
//     this.$emit("input", event.target.value);
//   }
// }
</script>

<style scoped>
.inputFields {
  margin: 15px 0;
  font-size: 16px;
  padding: 10px;
  width: 250px;
  border: 1px solid #3f51b5;
  border-top: none;
  border-left: none;
  border-right: none;
  color: black;
  outline: none;
}
span {
  display: block;
}
</style>
