import Vue from "vue";
import { Cookies } from "quasar";
import axios from "axios";

Vue.mixin({
  methods: {
    emitSocket(action, info) {
      var data = {
        method: action,
        session: Cookies.get("session"),
      };

      axios.post("emit-socket-action", data);
    },

    updatePlayersList(action, players) {
      var data = {
        info: {
          method: action,
          players: players,
        },
        session: Cookies.get("session"),
      };

      axios.put("update-player-list", data);
    },

    addNewPlayerInGame(action, player) {
      var data = {
        info: {
          method: action,
          player: player,
        },
        session: Cookies.get("session"),
      };

      axios.post("add-new-player", data);
    },
  },
});
