<template>

<div class="uk-form-row" v-if="boxEdge">
  <label class="efub-field__label">{{ label }}</label>
  <div class="efub-field" v-bind:class="{ 'efub-field--error': privateState.error }">
    <input 
      v-model="privateState.amount" 
      v-bind:class="{ 'uk-width-3-4': privateState.amount !== '', 'uk-width-4-4': privateState.amount === '' }"
      @input="onChangeAmount($event)" 
      type="number" 
      class="efub-field__input" 
    />
    <select 
      v-model="privateState.unit"  
      @change="onChangeUnit($event)" 
      class="uk-width-1-4 efub-field__select efub-field__select--secondary"
      :disabled="privateState.amount === ''"
    >
      <option disabled hidden style="display: none" value></option>
      <option v-for="styleUnit in styleUnits" v-bind:key="styleUnit.value" :value="styleUnit.value">{{styleUnit.value}}</option>
    </select>
  </div>
  <div 
    v-if="privateState.error" 
    class="efub-field__error-message"
  >
    {{privateState.error}}
  </div>
</div>

</template>
<script>

import { BOX_EDGES, SUPPORTED_STYLE_UNITS } from "./constants.js";
import { formStore } from "./store.js";

const STYLE_UNIT_CONFIGS =  SUPPORTED_STYLE_UNITS.map(curUnit => ({ value: curUnit }));

const FIELD_ERROR_CONFIGS = {
  "invalid_amount_negative": "Amount cannot be negative",
  "invalid_amount_nan": "Amount must be a number",
};

export default {
  computed: {
    label() {
      return this.boxEdge
        ? `${this.boxEdge.charAt(0).toUpperCase()}${this.boxEdge.slice(1)}`
        : "Unknown";
    },
    privateState() {
      const { errors, selectedBreakpoint, values } = formStore.state;
      const { amount = "", unit = "px"} = (values[selectedBreakpoint] || {})[this.boxEdge] || {};
      
      const fieldError = (errors[selectedBreakpoint] || {})[this.boxEdge];

      return {
        amount: amount,
        unit: unit,
        error: FIELD_ERROR_CONFIGS[fieldError],
      };
    },
  },
  data() {
    return {
      styleUnits: STYLE_UNIT_CONFIGS,
    };
  },
  methods: {
    onChangeAmount(evt) {
      const { selectedBreakpoint } = formStore.state;
      formStore.setValues(
        {
          [selectedBreakpoint]: {
            [this.boxEdge]: { amount: evt.target.value, unit: this.privateState.unit },
          },
        },
      );
    },
    onChangeUnit(evt) {
      const { selectedBreakpoint } = formStore.state;
      formStore.setValues(
        {
          [selectedBreakpoint]: {
            [this.boxEdge]: { amount: this.privateState.amount, unit: evt.target.value },
          },
        },
      );
    },
  },
  props: {
    boxEdge: {
      required: true,
      type: String,
      validator: value => {
        return BOX_EDGES.includes(value);
      },
    },
  },
};

</script>