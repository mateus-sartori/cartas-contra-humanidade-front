const state = {
  session: null,
  room: {
    players: [],
    isAllPlayersPlayed: null,
    winnerPlayer: {
      id: null,
      name: null,
      card: null,
      reveal: false,
    },
  },
  status: null,
};

const getters = {
  session: (state) => state.session,
  room: (state) => state.room,
  status: (state) => state.status,
};

const actions = {
  // Session
  setSession({ commit }, payload) {
    commit("SET_SESSION", payload);
  },

  setSessionStatus({ commit }, payload) {
    commit("SET_SESSION_STATUS", payload);
  },

  // ROOM 
  setRoom({ commit }, payload) {
    commit("SET_ROOM", payload);
  },

  updateRoom({ commit }, payload) {
    commit("UPDATE_ROOM", payload);
  },

  resetRoom({ commit }, payload) {
    commit("RESET_ROOM", payload);
  },

  setWinnerPlayer({ commit }, payload) {
    commit("SET_WINNER_PLAYER", payload);
  },
};

const mutations = {
  SET_SESSION: (state, payload) => (state.session = payload),
  SET_ROOM: (state, payload) => (state.room = payload),
  SET_SESSION_STATUS: (state, payload) => (state.status = payload),

  UPDATE_ROOM: (state, payload) => {
    state.room.players = payload;
    state.room.isAllPlayersPlayed = state.room.players.every((player) => {
      let { pending } = player;

      return pending == false;
    });
  },

  RESET_ROOM: (state, payload) => {
    state.room.players = state.room.players.map((player) => {
      player.pending = true
      player.score += 1 
      return player;
    });
    state.room.isAllPlayersPlayed = false;
  },

  SET_WINNER_PLAYER: (state, payload) => {
    state.room.players.map((player) => {
      if (player.id == payload.id) {
        player.score += 1
      }
    })
    state.room.winnerPlayer = payload;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
