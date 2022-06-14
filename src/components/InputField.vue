<template>
  <label class="flex flex-col text-lg text-gray-800 mb-2">
    {{ label }}:
    <input
      v-bind="$attrs"
      class="p-2 text-gray-500 focus:outline-none border-2"
      :value="value"
      @input="$emit('handleChange', $emit.target.value)"
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
