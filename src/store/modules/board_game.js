const state = {
    bossRound: null,
  };
  
  const getters = {
    bossRound: (state) => state.bossRound,
  };
  
  const actions = {
    setBossRound({ commit }, payload) {
      commit("SET_BOSS_ROUND", payload);
    },
  };
  
  const mutations = {
    SET_BOSS_ROUND: (state, payload) => (state.bossRound = payload),
  };
  
  export default {
    state,
    getters,
    actions,
    mutations,
  };
  