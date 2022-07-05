const state = {
  session: null,
  room: null,
};

const getters = {
  session: (state) => state.session,
  room: (state) => state.room,
};

const actions = {
  setSession({ commit }, payload) {
    commit("SET_SESSION", payload);
  },

  setRoom({ commit }, payload) {
    commit("SET_ROOM", payload);
  },
};

const mutations = {
  SET_SESSION: (state, payload) => (state.session = payload),
  SET_ROOM: (state, payload) => (state.room = payload),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
