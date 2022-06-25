import Vue from "vue";
import ActionCableVue from "actioncable-vue";
import { Cookies } from "quasar";

function initActionCable() {
  var connectionURL = "ws://localhost:3000";
  Vue.use(ActionCableVue, {
    debug: true,
    debugLevel: "error",
    connectionUrl: connectionURL + "/cable",
    connectImmediately: true,
    store: {seila: 'aaa'}
  });
}

initActionCable();
