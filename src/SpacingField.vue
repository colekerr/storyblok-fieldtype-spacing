<template>
  <!-- div 1 -->
  <div class="uk-form-row" v-if="boxEdge">
    <label class="uk-form-label">{{ label }}</label>
    <div class="efub-unit-field" v-bind:class="{ 'efub-unit-field--error': privateState.error }">
      <input v-model="privateState.amount" @input="onChangeAmount($event)" type="number" class="efub-unit-field__input uk-width-3-4" />
      <select v-model="privateState.unit"  @change="onChangeUnit($event)" class="uk-width-1-4 efub-unit-field__select">
        <!-- <option v-on:click="" selected disabled hidden style='display: none' value=''></option> -->
        <option disabled hidden style="display: none" value></option>
        <option v-for="styleUnit in styleUnits" v-bind:key="styleUnit.value" :value="styleUnit.value">{{styleUnit.value}}</option>
      </select>
    </div>
    <div v-if="privateState.error" class="efub-unit-field__error-message">{{privateState.error}}</div>
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
            [this.boxEdge]: { amount: evt.target.value, unit: this.privateState.unit}
          },
        },
      );
    },
    onChangeUnit(evt) {
      const { selectedBreakpoint } = formStore.state;
      formStore.setValues(
        {
          [selectedBreakpoint]: {
            [this.boxEdge]: { amount: this.privateState.amount, unit: evt.target.value }
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