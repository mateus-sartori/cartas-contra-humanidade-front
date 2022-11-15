//helpers
function removeCardInHands(array, item) {
  return array.filter((element) => {
    return element.text != item.text;
  });
}

const state = {
  currentPlayer: null,
  cardsInHands: null,
};

const getters = {
  currentPlayer: (state) => state.currentPlayer,
  cardsInHands: (state) => state.cardsInHands,
};

const actions = {
  setCurrentPlayer({ commit }, payload) {
    commit("SET_CURRENT_PLAYER", payload);
  },

  // Cards in Hands

  setCardsInHands({ commit }, payload) {
    commit("SET_CARDS_IN_HANDS", payload);
  },

  updateCardsInHands({ commit }, payload) {
    commit("UPDATE_CARDS_IN_HANDS", payload);
  },
};

const mutations = {
  SET_CURRENT_PLAYER: (state, payload) => (state.currentPlayer = payload),

  // Cards in Hands
  SET_CARDS_IN_HANDS: (state, payload) => (state.cardsInHands = payload),
  UPDATE_CARDS_IN_HANDS: (state, payload) => {
    state.cardsInHands = removeCardInHands(state.cardsInHands, payload);
  }
};

export default {
  state,
  getters,
  actions,
  mutations,
};
