<template>
  <div class="uk-form">
    <div class="uk-form-row">
      <label>Meta Title</label>
      <input type="text" placeholder="Your title" v-model="model.title" class="uk-width-1-1">
    </div>

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
import { formStore } from "./store.js";
import { getBoxEdgesFromLiteral, getStyleValueFromString } from "./utils.js"
import { SUPPORTED_STYLE_UNITS } from './constants';

export default {
  data() {
    return {
      formStore
    }
  },
  mixins: [window.Storyblok.plugin],
  methods: {
    initWith() {
      // console.log('initWith this.options: ' + JSON.stringify(this.options));

      const enabledBoxEdges = getBoxEdgesFromLiteral(this.options.enabledBoxEdges)

      this.selectedBreakpoint = "base";

      this.pluginConfig = {
        enabled: {
          boxEdges: enabledBoxEdges,
          styleUnits: SUPPORTED_STYLE_UNITS,
        },
      }

      formStore.setSelectedBreakpoint(this.selectedBreakpoint);
      formStore.setConfig(this.pluginConfig);

      return {
        // needs to be equal to your storyblok plugin name
        plugin: 'spacing-responsive',
        title: '',
        description: '',
        ...formStore.state.savedValues
      }
    },
    pluginCreated() {
      // eslint-disable-next-line
      const initialValues = {
        base: this.options.defaultBaseValues && {
          bottom: this.model.base ? this.model.base.bottom : getStyleValueFromString(this.options.defaultBaseValues.split(" ")[0]),
          left: this.model.base ? this.model.base.left : getStyleValueFromString(this.options.defaultBaseValues.split(" ")[1]),
          right: this.model.base ? this.model.base.right : getStyleValueFromString(this.options.defaultBaseValues.split(" ")[1]),
          top: this.model.base ? this.model.base.top : getStyleValueFromString(this.options.defaultBaseValues.split(" ")[0]),
        },
        desktop: this.options.defaultDesktopValues && {
          bottom: this.model.desktop ? this.model.desktop.bottom : getStyleValueFromString(this.options.defaultDesktopValues.split(" ")[0]),
          left: this.model.desktop ? this.model.desktop.left : getStyleValueFromString(this.options.defaultDesktopValues.split(" ")[1]),
          right: this.model.desktop ? this.model.desktop.right : getStyleValueFromString(this.options.defaultDesktopValues.split(" ")[1]),
          top: this.model.desktop ? this.model.desktop.top : getStyleValueFromString(this.options.defaultDesktopValues.split(" ")[0]),
        },
        tablet: this.options.defaultTabletValues && {
          bottom: this.model.tablet ? this.model.tablet.bottom : getStyleValueFromString(this.options.defaultTabletValues.split(" ")[0]),
          left: this.model.tablet ? this.model.tablet.left : getStyleValueFromString(this.options.defaultTabletValues.split(" ")[1]),
          right: this.model.tablet ? this.model.tablet.right : getStyleValueFromString(this.options.defaultTabletValues.split(" ")[1]),
          top: this.model.tablet ? this.model.tablet.top : getStyleValueFromString(this.options.defaultTabletValues.split(" ")[0]),
        },
      }
      // console.log("pluginCreated initialValues: " + JSON.stringify(initialValues, null, 2))
      formStore.setValues(initialValues)
      formStore.setModel(this.model);

      // console.log('View source and customize: https://github.com/storyblok/storyblok-fieldtype');
    }
  },
  watch: {
    'model': {
      handler: function (model) {
        // const isTitleValid = model.title.length > 0;
        // const isDescriptionValid = model.description.length > 0;

        // console.log('watch.model.handler model: ', model)
        // console.log('watch.model.handler this.options: ', this.options)
        // console.log('watch.model.handler this.pluginConfig: ', this.pluginConfig)
        // console.log('watch.model.handler isTitleValid: ', isTitleValid)
        // console.log('watch.model.handler isDescriptionValid: ', isDescriptionValid)
        
        const fieldErrors = formStore.getErrors();
        const isModelValid = fieldErrors.length === 0
        
        if (!isModelValid) { 
          // console.log("watch.model.handler fieldErrors: " + JSON.stringify(fieldErrors, null, 2))
          return;
        }
        this.$emit('changed-model', model);
      },
      deep: true
    }
  }
}
</script>

<style>
.efub-unit-field {
  border: 1px solid #d5d5d5 !important;
  border-radius: 2px !important;
  box-sizing: border-box;
  margin-bottom: 15px !important;
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
}</style>
