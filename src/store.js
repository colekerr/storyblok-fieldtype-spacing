import { INITIAL_PLUGIN_CONFIG } from "./constants.js";

export const formStore = {
  debug: true,
  state: {
    config: INITIAL_PLUGIN_CONFIG,
    selectedBreakpoint: "base",
    errors: {
      base: {},
      desktop: {},
      tablet: {},
    },
    savedValues: {
      base: undefined,
      desktop: undefined,
      tablet: undefined,
    },
    values: {
      base: undefined,
      desktop: undefined,
      tablet: undefined,
    }
  },
  getErrors() {
    const flatErrors = [];

    if (!this.state.errors) throw Error("Invalid structure of formStore.state: errors === " + this.state.errors);
    Object.keys(this.state.errors).forEach(
      curBreakpoint =>
        this.state.errors[curBreakpoint] &&
        Object.keys(this.state.errors[curBreakpoint]).forEach(
          curBoxEdge =>
            this.state.errors[curBreakpoint][curBoxEdge] &&
            flatErrors.push({ breakpoint: curBreakpoint, boxEdge: curBoxEdge, message: this.state.errors[curBreakpoint][curBoxEdge]})
        )
    );
    return flatErrors;
  },
  setModel(model) {
    if (this.debug) console.log("formStore.setModel triggered with: " + JSON.stringify(model, null, 2));
    this.setValues({ base: model.base, desktop: model.desktop, tablet: model.tablet })

    if (!this.state.model) {
      this.state.model = model;
      this.state.model.base = this.state.savedValues.base
      this.state.model.tablet = this.state.savedValues.tablet
      this.state.model.desktop = this.state.savedValues.desktop
      console.log("formStore.setModel final model: "+ JSON.stringify(model, null, 2));
      console.log("formStore.setModel final this.state.model: "+ JSON.stringify(this.state.model, null, 2));
    }

  },
  setValues(values) {
    const newValues = {...this.state.savedValues}
    const newSavedValues = {...this.state.savedValues}
    const newErrors = { 
      base: {},
      desktop: {},
      tablet: {}
    }
    if (this.debug) console.log('formStore.setSavedValues triggered with: ' + JSON.stringify(values, null, 2))

    console.log("Object.keys(values): " + Object.keys(values));
    Object.keys(values).forEach((curBreakpoint) => values[curBreakpoint] && Object.keys(values[curBreakpoint]).forEach(curBoxEdge => {
      newErrors[curBreakpoint][curBoxEdge] = undefined;

      if (!newValues[curBreakpoint]) {
        newValues[curBreakpoint] = {};
      }
      if (!newSavedValues[curBreakpoint]) {
        newSavedValues[curBreakpoint] = {};
      }
      const curFieldValue = values[curBreakpoint][curBoxEdge];
      
      console.log("formStore setValues curFieldValue: " + curFieldValue)
      if (curFieldValue === undefined) {
        newValues[curBreakpoint][curBoxEdge] = undefined;
        newSavedValues[curBreakpoint][curBoxEdge] = undefined
        return;
      }

      if (!this.state.config.enabled.boxEdges.includes(curBoxEdge)) throw Error("Unexpected boxEdge detected: " + curBoxEdge);
      if (!this.state.config.enabled.styleUnits.includes(curFieldValue.unit)) throw Error("Unexpected style unit detected: " + curFieldValue.unit);
      
      if (curFieldValue.amount === "") {
        newValues[curBreakpoint][curBoxEdge] = undefined;
        newSavedValues[curBreakpoint][curBoxEdge] = undefined
        return;
      }
      
      const cleanedAmount = typeof curFieldValue.amount === "string" ? (curFieldValue.amount
        .trim()
        .match(/^-?[0-9]+(.[0-9]+)?$/g))[0] : curFieldValue.amount;
      
      const newErrorNaNAmount = curFieldValue !== "" && cleanedAmount === null
      if (newErrorNaNAmount) {
        newErrors[curBreakpoint][curBoxEdge] = "invalid_amount_nan";
      }
      
      const amountAsNumber = typeof cleanedAmount  === "string" ? parseFloat(cleanedAmount) : cleanedAmount;
      
      const newErrorNegativeAmount = !newErrorNaNAmount && amountAsNumber < 0;
      if (newErrorNegativeAmount) {
        newErrors[curBreakpoint][curBoxEdge] = "invalid_amount_negative";
      }
      
      const isFieldValueValid = !newErrors[curBreakpoint][curBoxEdge];
      
      newValues[curBreakpoint][curBoxEdge] = { amount: amountAsNumber, unit: curFieldValue.unit }
      
      if (isFieldValueValid) {
        newSavedValues[curBreakpoint][curBoxEdge] = { amount: amountAsNumber, unit: curFieldValue.unit }
      } 
    }))
    console.log("end: newValues: " + JSON.stringify(newValues, null, 2))
    console.log("end: newSavedValues: " + JSON.stringify(newSavedValues, null, 2))
    console.log("end: newErrors: " + JSON.stringify(newErrors, null, 2))
    
    window.Storyblok.vue.set(this.state, "errors", newErrors)
    window.Storyblok.vue.set(this.state, "values", newValues)
    window.Storyblok.vue.set(this.state, "savedValues", newSavedValues)
    
    if (this.state.model && this.getErrors().length === 0) {
      window.Storyblok.vue.set(this.state.model, "base", this.state.savedValues.base)
      window.Storyblok.vue.set(this.state.model, "tablet", this.state.savedValues.tablet)
      window.Storyblok.vue.set(this.state.model, "desktop", this.state.savedValues.desktop)
    }
  },
  setConfig(pluginConfig) {
    if (this.debug) console.log('formStore.setConfig triggered with: ' + JSON.stringify(pluginConfig, null, 2))
    
    window.Storyblok.vue.set(this.state, "config", pluginConfig);
  },
  setSelectedBreakpoint(breakpoint) {
    if (this.debug) console.log("formStore.setSelectedBreakpoint triggered with: " + breakpoint);
    
    window.Storyblok.vue.set(this.state, "selectedBreakpoint", breakpoint);
  }
};
