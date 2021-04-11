import Vue from "vue";
import App from "./App.vue";

import { initContract } from "./utils";
import vuetify from "./plugins/vuetify";
import store from "./store";

Vue.config.productionTip = false;

Object.defineProperty(window, "nearInitPromise", {
  value: initContract().then(() => {
    new Vue({
      vuetify,
      store,
      render: (h) => h(App),
    }).$mount("#app");
  }),
  configurable: true,
  enumerable: true,
  writable: true,
});
