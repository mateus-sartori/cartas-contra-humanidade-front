import Vue from "vue";
import Vuex from "vuex";
import session from "./modules/session";
import boardGame from './modules/board_game';
import player from './modules/player'

// import example from './module-example'

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

const store = new Vuex.Store({
  modules: {
    session,
    boardGame,
    player
  },

  strict: process.env.DEBUGGING,
});

Vue.prototype.$store = store;

export default store;
