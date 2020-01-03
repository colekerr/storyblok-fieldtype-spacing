<template>
  <div class="uk-form-row">
    <label class="uk-form-label">{{ label }}</label>
    <select :disabled="privateState.isDisabled" v-bind:class="{ 'efub-unit-field__select--disabled': privateState.isDisabled }" v-model="privateState.selected" @change="onChange($event)" class="uk-width-1-1">
      <option disabled hidden style="display: none" value=""></option>
      <option v-for="breakpoint in breakpoints" v-bind:key="breakpoint.value" :value="breakpoint.value">{{breakpoint.ui_text}}</option>
    </select>
  </div>
</template>

<script>
import { formStore } from "./store.js";

const BREAKPOINTS_CONFIGS =  [
  { ui_text: "Base", value: "base" },
  { ui_text: "Tablets and wider", value: "tablet" },
  { ui_text: "Desktop and wider", value: "desktop" },
];

export default {
  data() {
    return {
      breakpoints: BREAKPOINTS_CONFIGS,
    };
  },
  computed: {
    label: function() {
      return "Device (Min. Width)";
    },
    privateState() {
      const isDisabled = formStore.getErrors().some(curError => curError.breakpoint === formStore.state.selectedBreakpoint);
      
      return {
        isDisabled,
        selected: formStore.state.selectedBreakpoint,
      };
    },
  },
  methods: {
    onChange(evt) {
      const isDisabled = formStore.getErrors().some(curError => curError.breakpoint === formStore.state.selectedBreakpoint);
      
      if (!isDisabled) {
        formStore.setSelectedBreakpoint(evt.target.value);
      }
    }
  }
};
</script>