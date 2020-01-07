<template>
  <div class="uk-form">
    <!-- choose breakpoint -->
    <breakpoint-select />
    <!-- field 1 -->
    <spacing-field
      v-if="pluginConfig.enabled.boxEdges.includes('bottom')"
      :boxEdge="'bottom'"
    />
    <!-- field 2 -->
    <spacing-field
      v-if="pluginConfig.enabled.boxEdges.includes('top')"
      :boxEdge="'top'"
    />
    <!-- field 3 -->
    <spacing-field
      v-if="pluginConfig.enabled.boxEdges.includes('right')"
      :boxEdge="'right'"
    />
    <!-- field 4 -->
    <spacing-field
      v-if="pluginConfig.enabled.boxEdges.includes('left')"
      :boxEdge="'left'"
    />

  </div>
</template>

<script>
import BreakpointSelect from "./BreakpointSelect.vue";
import { formStore } from "./store.js";
import { getBoxEdgesFromLiteral, getDefaultValuesFromLiteral, getEnabledDefaultValues, getStyleValueFromString } from "./utils.js";
import SpacingField from "./SpacingField.vue";
import { SUPPORTED_STYLE_UNITS } from "./constants";

export default {
  components: {
    "spacing-field": SpacingField,
    "breakpoint-select": BreakpointSelect,
  },
  data() {
    return {
      formStore
    };
  },
  mixins: [window.Storyblok.plugin],
  methods: {
    initWith() {
      return {
        // needs to be equal to your storyblok plugin name
        plugin: "spacing-responsive",
        base: undefined,
        tablet: undefined,
        desktop: undefined,
      };
    },
    pluginCreated() {
      formStore.setModel(this.model);
      
      const enabledBoxEdges = getBoxEdgesFromLiteral(this.options.enabledBoxEdges);

      const defaultValues = {
        base: getEnabledDefaultValues(enabledBoxEdges, getDefaultValuesFromLiteral("defaultBaseValues", this.options.defaultBaseValues)),
        desktop: getEnabledDefaultValues(enabledBoxEdges, getDefaultValuesFromLiteral("defaultDesktopValues", this.options.defaultDesktopValues)),
        tablet: getEnabledDefaultValues(enabledBoxEdges, getDefaultValuesFromLiteral("defaultTabletValues", this.options.defaultTabletValues)),
      };

      this.selectedBreakpoint = "base";

      this.pluginConfig = {
        defaults: defaultValues,
        enabled: {
          boxEdges: enabledBoxEdges,
          styleUnits: SUPPORTED_STYLE_UNITS,
        },
      };

      formStore.setSelectedBreakpoint(this.selectedBreakpoint);
      formStore.setConfig(this.pluginConfig);

      const initialValues = {
        base: this.options.defaultBaseValues && {
          bottom: this.model.base 
            ? this.model.base.bottom 
            : this.pluginConfig.defaults.base.bottom,
          left: this.model.base 
            ? this.model.base.left 
            : this.pluginConfig.defaults.base.left,
          right: this.model.base 
            ? this.model.base.right 
            : this.pluginConfig.defaults.base.right,
          top: this.model.base 
            ? this.model.base.top 
            : this.pluginConfig.defaults.base.top,
        },
        desktop: this.options.defaultDesktopValues && {
          bottom: this.model.desktop 
            ? this.model.desktop.bottom 
            : this.pluginConfig.defaults.desktop.bottom,
          left: this.model.desktop 
            ? this.model.desktop.left 
            : this.pluginConfig.defaults.desktop.left,
          right: this.model.desktop 
            ? this.model.desktop.right 
            : this.pluginConfig.defaults.desktop.right,
          top: this.model.desktop 
            ? this.model.desktop.top 
            : this.pluginConfig.defaults.desktop.top,
        },
        tablet: this.options.defaultTabletValues && {
          bottom: this.model.tablet 
            ? this.model.tablet.bottom 
            : this.pluginConfig.defaults.tablet.bottom,
          left: this.model.tablet 
            ? this.model.tablet.left 
            : this.pluginConfig.defaults.tablet.left,
          right: this.model.tablet 
            ? this.model.tablet.right 
            : this.pluginConfig.defaults.tablet.right,
          top: this.model.tablet 
            ? this.model.tablet.top 
            : this.pluginConfig.defaults.tablet.top,
        },
      };
      Object.keys(initialValues).forEach(curBreakpoint => {
        if (!initialValues[curBreakpoint]) {
          return;
        }
        if (!Object.values(initialValues[curBreakpoint]).some(curBoxEdgeValue => curBoxEdgeValue !== undefined)) {
          initialValues[curBreakpoint] = undefined;
        }
      })
      formStore.setValues(initialValues);
    }
  },
  watch: {
    'formStore': {
      handler: function (formStore) {       
        const fieldErrors = formStore.getErrors();
        const isModelValid = fieldErrors.length === 0;
        
        if (!isModelValid) { 
          return;
        }
        this.$emit('changed-model', formStore.state.model);

      },
      deep: true,
    },
    'model': {
      handler: function (model) {
        const fieldErrors = formStore.getErrors();
        const isModelValid = fieldErrors.length === 0;
        
        if (!isModelValid) { 
          return;
        }
        this.$emit('changed-model', model);
      },
      deep: true,
    },
  },
};
</script>

<style>
.efub-unit-field {
  border: 1px solid #d5d5d5 !important;
  border-radius: 2px !important;
  box-sizing: border-box;
  width: 100% !important;
}
.efub-unit-field--error, 
.efub-unit-field--error:not(:focus-within) .efub-unit-field__select {
  border-color: red !important;
}

.efub-unit-field__input {
  border-right: 0 !important;
  border-bottom-right-radius: 0 !important;
  border-top-right-radius: 0 !important;
}

.efub-unit-field__error-message {
  color: red !important;
}

.efub-unit-field__input--disabled,
.efub-unit-field__select--disabled {
  background-color: #ddd !important;
}

.efub-unit-field__input,
.efub-unit-field__select {
  border: 0 !important;
}

.efub-unit-field:focus-within {
  border-color: #09b3af !important;
}

.efub-unit-field:focus-within .efub-unit-field__select,
.efub-unit-field:focus-within .efub-unit-field__input {
  background-color: #f2f9f8 !important;
}

.efub-unit-field:focus-within .efub-unit-field__select option {
  background-color: #fff !important;
}

.efub-unit-field__select,
.efub-unit-field__select option {
  cursor: pointer !important;
}

.efub-unit-field__select {
  border-left: 1px solid #d5d5d5 !important;
  padding-right: 15px !important;
}
</style>
