const state = {
  bossRound: null,
  currentBossIndex: null,
  whiteCards: [],
  cardsInTable: [],

  blackCards: [],
  blackCard: {
    card: null,
    selected: false,
  },
};

const getters = {
  bossRound: (state) => state.bossRound,
  whiteCards: (state) => state.whiteCards,
  cardsInTable: (state) => state.cardsInTable,

  blackCards: (state) => state.blackCards,
  blackCard: (state) => state.blackCard,
};

const actions = {
  setBossRound({ commit }, payload) {
    commit("SET_BOSS_ROUND", payload);
  },

  updateCurrentBossIndex({ commit }, payload) {
    commit("UPDATE_CURRENT_BOSS_INDEX", payload);
  },

  updateBossRound({ commit }, payload) {
    commit("UPDATE_BOSS_ROUND", payload);
  },

  setWhiteCards({ commit }, payload) {
    commit("SET_WHITE_CARDS", payload);
  },
  setCardsInTable({ commit }, payload) {
    commit("SET_CARDS_IN_TABLE", payload);
  },

  updateCardsInTable({ commit }, payload) {
    commit("UPDATE_CARDS_IN_TABLE", payload);
  },

  setBlackCards({ commit }, payload) {
    commit("SET_BLACK_CARDS", payload);
  },

  removeSelectedCardFromBlackCards({ commit }, payload) {
    commit("REMOVE_SELECTED_CARD_FROM_BLACK_CARDS", payload);
  },

  setblackCard({ commit }, payload) {
    commit("SET_BLACK_CARD", payload);
  },
};

const mutations = {
  SET_BOSS_ROUND: (state, payload) => (state.bossRound = payload),
  UPDATE_BOSS_ROUND: (state, payload) => {
    if (payload) {
      if (state.currentBossIndex >= payload.players.length - 1) {
        state.currentBossIndex = 0;
        state.bossRound = payload.players[state.currentBossIndex];
      } else {
        state.currentBossIndex += 1;
        state.bossRound = payload.players[state.currentBossIndex];
      }
    }
  },

  UPDATE_CURRENT_BOSS_INDEX: (state, payload) => {
    state.currentBossIndex = payload.players.findIndex(
      (player) => player.id === payload.currentBoss.id
    );
  },

  SET_WHITE_CARDS: (state, payload) => (state.whiteCards = payload),

  SET_CARDS_IN_TABLE: (state, payload) => {
    if (payload.length == 0) return (state.cardsInTable = []);
    if (payload) state.cardsInTable.push(payload);
  },
  UPDATE_CARDS_IN_TABLE: (state, payload) => {
    if (payload) state.cardsInTable = payload;
  },

  SET_BLACK_CARDS: (state, payload) => (state.blackCards = payload),

  SET_BLACK_CARD: (state, payload) => {
    state.blackCard.card = payload["card"];
    state.blackCard.selected = payload["selected"];
  },

  REMOVE_SELECTED_CARD_FROM_BLACK_CARDS: (state, payload) => {
    state.blackCards = state.blackCards.filter(
      (blackCard) => blackCard.text != payload.text
    );
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
