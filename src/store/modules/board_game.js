const state = {
    bossRound: null,
    cardsInTable: [],
  };
  
  const getters = {
    bossRound: (state) => state.bossRound,
    cardsInTable: (state) => state.cardsInTable
  };
  
  const actions = {
    setBossRound({ commit }, payload) {
      commit("SET_BOSS_ROUND", payload);
    },

    setCardsInTable({commit}, payload) {
      commit("SET_CARDS_IN_TABLE", payload)
    }
  };
  
  const mutations = {
    SET_BOSS_ROUND: (state, payload) => (state.bossRound = payload),
    SET_CARDS_IN_TABLE: (state, payload) => {
      if (payload.length == 0) return state.cardsInTable = []
      if (payload) state.cardsInTable.push(payload)
    }
  };
  
  export default {
    state,
    getters,
    actions,
    mutations,
  };
  