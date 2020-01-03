import { INITIAL_PLUGIN_CONFIG } from "./constants.js";

export const formStore = {
  isDebugMode: false,
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
    },
  },
  debug(...args) {
    if (this.isDebugMode) console.log(...args);
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
    this.debug("formStore.setModel triggered with: " + JSON.stringify(model, null, 2));
    this.setValues({ base: model.base, desktop: model.desktop, tablet: model.tablet });

    if (!this.state.model) {
      this.state.model = model;
      this.state.model.base = this.state.savedValues.base;
      this.state.model.tablet = this.state.savedValues.tablet;
      this.state.model.desktop = this.state.savedValues.desktop;
    }
  },
  setValues(values) {
    const newValues = { ...this.state.savedValues };
    const newSavedValues = { ...this.state.savedValues };
    const newErrors = { 
      base: {},
      desktop: {},
      tablet: {},
    };
    this.debug("formStore.setSavedValues triggered with: " + JSON.stringify(values, null, 2));

    Object.keys(values).forEach((curBreakpoint) => values[curBreakpoint] && Object.keys(values[curBreakpoint]).forEach(curBoxEdge => {
      newErrors[curBreakpoint][curBoxEdge] = undefined;

      if (!newValues[curBreakpoint]) {
        newValues[curBreakpoint] = {};
      }
      if (!newSavedValues[curBreakpoint]) {
        newSavedValues[curBreakpoint] = {};
      }
      const curFieldValue = values[curBreakpoint][curBoxEdge];
      
      if (curFieldValue === undefined) {
        newValues[curBreakpoint][curBoxEdge] = undefined;
        newSavedValues[curBreakpoint][curBoxEdge] = undefined;
        return;
      }

      if (!this.state.config.enabled.boxEdges.includes(curBoxEdge)) {
        throw Error("Unexpected boxEdge detected: " + curBoxEdge);
      }
      if (!this.state.config.enabled.styleUnits.includes(curFieldValue.unit)) {
        throw Error("Unexpected style unit detected: " + curFieldValue.unit);
      }
      
      if (curFieldValue.amount === "") {
        newValues[curBreakpoint][curBoxEdge] = undefined;
        newSavedValues[curBreakpoint][curBoxEdge] = undefined;
        return;
      }
      
      const cleanedAmount = typeof curFieldValue.amount === "string" 
        ? (curFieldValue.amount
          .trim()
          .match(/^-?[0-9]+(.[0-9]+)?$/g))[0] 
        : curFieldValue.amount;
      
      const newErrorNaNAmount = curFieldValue !== "" && cleanedAmount === null;
      
      if (newErrorNaNAmount) {
        newErrors[curBreakpoint][curBoxEdge] = "invalid_amount_nan";
      }
      
      const amountAsNumber = typeof cleanedAmount  === "string" 
        ? parseFloat(cleanedAmount) 
        : cleanedAmount;
      
      const newErrorNegativeAmount = !newErrorNaNAmount && amountAsNumber < 0;
      
      if (newErrorNegativeAmount) {
        newErrors[curBreakpoint][curBoxEdge] = "invalid_amount_negative";
      }
      
      const isFieldValueValid = !newErrors[curBreakpoint][curBoxEdge];
      
      newValues[curBreakpoint][curBoxEdge] = { amount: amountAsNumber, unit: curFieldValue.unit };
      
      if (isFieldValueValid) {
        newSavedValues[curBreakpoint][curBoxEdge] = { amount: amountAsNumber, unit: curFieldValue.unit };
      }
    }));
    
    window.Storyblok.vue.set(this.state, "errors", newErrors);
    window.Storyblok.vue.set(this.state, "values", newValues);
    window.Storyblok.vue.set(this.state, "savedValues", newSavedValues);
    
    if (this.state.model && this.getErrors().length === 0) {
      window.Storyblok.vue.set(this.state.model, "base", this.state.savedValues.base);
      window.Storyblok.vue.set(this.state.model, "tablet", this.state.savedValues.tablet);
      window.Storyblok.vue.set(this.state.model, "desktop", this.state.savedValues.desktop);
    }
  },
  setConfig(pluginConfig) {
    this.debug('formStore.setConfig triggered with: ' + JSON.stringify(pluginConfig, null, 2));
    
    window.Storyblok.vue.set(this.state, "config", pluginConfig);
  },
  setSelectedBreakpoint(breakpoint) {
    this.debug("formStore.setSelectedBreakpoint triggered with: " + breakpoint);
    
    window.Storyblok.vue.set(this.state, "selectedBreakpoint", breakpoint);
  },
};
