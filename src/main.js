import Plugin from './Plugin.vue'
import SpacingField from './SpacingField.vue'
import BreakpointSelect from './BreakpointSelect.vue'

if (process.env.NODE_ENV == 'development') {

  window.Fieldtype = Plugin
  let customComp = window.Storyblok.vue.extend(window.Fieldtype);
  window.Storyblok.vue.component('custom-plugin', customComp);
  window.Storyblok.vue.component('spacing-field', SpacingField);
  window.Storyblok.vue.component('breakpoint-select', BreakpointSelect);
  window.StoryblokPluginRegistered = true;

} else {
  
  let init = Plugin.methods.initWith() 
  window.storyblok.field_types[init.plugin] = Plugin

}

