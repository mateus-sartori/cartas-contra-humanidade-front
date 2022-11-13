const state = {
    currentPlayer: null,
  };
  
  const getters = {
    currentPlayer: (state) => state.currentPlayer,
  };
  
  const actions = {
    setCurrentPlayer({ commit }, payload) {
      commit("SET_CURRENT_PLAYER", payload);
    },
  };
  
  const mutations = {
    SET_CURRENT_PLAYER: (state, payload) => (state.currentPlayer = payload),
  };
  
  export default {
    state,
    getters,
    actions,
    mutations,
  };
  