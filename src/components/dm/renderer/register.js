import Vue from 'vue'

// renderer
import DetailRenderer from "./Detail";
Vue.component("DetailRenderer", DetailRenderer);
import ListRenderer from "./List";
Vue.component("ListRenderer", ListRenderer);
import ViewRenderer from "./View";
Vue.component("ViewRenderer", ViewRenderer);

// component
import DmInput from "./components/DmInput";
Vue.component("DmInput", DmInput);