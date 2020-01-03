import Plugin from './Plugin.vue'
import SpacingField from './SpacingField.vue'
import BreakpointSelect from './BreakpointSelect.vue'

if (process.env.NODE_ENV == 'development') {

  window.Fieldtype = Plugin
  window.Storyblok.vue.component('spacing-field', SpacingField);
  window.Storyblok.vue.component('breakpoint-select', BreakpointSelect);
  let customComp = window.Storyblok.vue.extend(window.Fieldtype);
  window.Storyblok.vue.component('custom-plugin', customComp);
  window.StoryblokPluginRegistered = true;

} else {
  
  let init = Plugin.methods.initWith() 
  window.storyblok.field_types[init.plugin] = Plugin

}

