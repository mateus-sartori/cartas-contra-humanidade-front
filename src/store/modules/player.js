//helpers
function removeCardInHands(array, item) {
  return array.filter((element) => {
    return element.text != item.text;
  });
}

const state = {
  currentPlayer: null,
  cardsInHands: null,
  isCurrentBoss: false,
  blockCardHands: false,
  blockSelectWinner: false,
};

const getters = {
  currentPlayer: (state) => state.currentPlayer,
  cardsInHands: (state) => state.cardsInHands,
  blockCardHands: (state) => state.blockCardHands,
  isCurrentBoss: (state) => state.isCurrentBoss,
  blockSelectWinner: (state) => state.blockSelectWinner
};

const actions = {
  setCurrentPlayer({ commit }, payload) {
    commit("SET_CURRENT_PLAYER", payload);
  },

  setIsCurrentBoss({ commit }, payload) {
    commit("SET_IS_CURRENT_BOSS", payload);
  },

  // Cards in Hands

  setCardsInHands({ commit }, payload) {
    commit("SET_CARDS_IN_HANDS", payload);
  },

  updateCardsInHands({ commit }, payload) {
    commit("UPDATE_CARDS_IN_HANDS", payload);
  },

  updateBlockCardsHands({ commit }, payload) {
    commit("UPDATE_BLOCK_CARDS_HANDS", payload);
  },

  updateBlockSelectWinner({ commit }, payload) {
    commit("UPDATE_BLOCK_SELECT_WINNER", payload);
  },
};

const mutations = {
  SET_CURRENT_PLAYER: (state, payload) => (state.currentPlayer = payload),
  SET_IS_CURRENT_BOSS: (state, payload) => (state.isCurrentBoss = payload),

  // Cards in Hands
  SET_CARDS_IN_HANDS: (state, payload) => (state.cardsInHands = payload),
  UPDATE_CARDS_IN_HANDS: (state, payload) => {
    state.cardsInHands = removeCardInHands(state.cardsInHands, payload);
  },

  UPDATE_BLOCK_CARDS_HANDS: (state, payload) => {
    state.blockCardHands = payload;
  },

  UPDATE_BLOCK_SELECT_WINNER: (state, payload) =>
    (state.blockSelectWinner = payload),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
