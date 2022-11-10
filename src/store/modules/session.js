const state = {
  session: null,
  room: null,
  status: null,
};

const getters = {
  session: (state) => state.session,
  room: (state) => state.room,
  status: (state) => state.status
};

const actions = {
  setSession({ commit }, payload) {
    commit("SET_SESSION", payload);
  },

  setRoom({ commit }, payload) {
    commit("SET_ROOM", payload);
  },

  setSessionStatus({ commit }, payload) {
    commit("SET_SESSION_STATUS", payload);
  },
};

const mutations = {
  SET_SESSION: (state, payload) => (state.session = payload),
  SET_ROOM: (state, payload) => (state.room = payload),
  SET_SESSION_STATUS: (state, payload) => (state.status = payload)
};

export default {
  state,
  getters,
  actions,
  mutations,
};
