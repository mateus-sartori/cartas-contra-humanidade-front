<template>
  <div>
    {{isBlackCardSelected}}
    <!-- Cartas da mão  -->
    <div class="row col justify-center items-center q-gutter-x-md" v-if="!isBossCurrentPlayer">
      <q-btn
        icon="chevron_left"
        @click="previousCards()"
        color="red"
        round
        :disabled="disablePrevious"
        size="sm"
        glossy
      />
      <div class="row" v-for="(card, index) in cardsInHands" v-bind:key="index">
        <div class="column justify-center items-center">
          <div @click="selectCard(card)">
            <card
              backgroundColor="bg-white"
              textColor="text-black"
              :text="card.text"
              :style="blockCardHands || !isBlackCardSelected ? 'opacity: 0.7' : ''"
              :canHover="true"
            />
          </div>
          <div
            class="q-pa-xs row q-gutter-x-md"
            v-if="selectedCardInHandsId == card.id && !blockCardHands && isBlackCardSelected"
          >
            <q-btn
              label="X"
              size="xs"
              color="red-8"
              @click="cancelCard()"
              glossy
            />
            <q-btn
              label="Jogar"
              size="sm"
              glossy
              color="green"
              @click="playCard(card)"
            />
          </div>
        </div>
      </div>
      <q-btn
        icon="chevron_right"
        @click="nextCards()"
        :disabled="disableForward"
        color="green"
        round
        size="sm"
        glossy
      />
    </div>
  </div>
</template>

<script>
import Card from "components/Card";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "CardsInHands",

  components: {
    Card,
  },

  data() {
    return {
      blockCardHands: false,
      selectedCardInHandsId: null,

      showTotalCardsInHands: 5,
      currentPage: 1,

      disableForward: false,
      disablePrevious: true,

      cardsInHands: [],

      startGameChannel: "CartasContraHumanidadeGameRuleChannel",
    };
  },

  channels: {
    CartasContraHumanidadeGameRuleChannel: {
      received(response) {
        switch (response.action) {
          case "update_cards_in_table":
            this.setCardsInTable(response.data)
            break;
          default:
            break;
        }
      },
    },
  },

  props: {
    cards: {
      type: Array,
      default: null,
    },

    isBossCurrentPlayer: {
      type: Boolean
    },

    isBlackCardSelected: {
      type: Boolean
    }
  },

  computed: {
    ...mapGetters(["bossRound", "currentPlayer", "cardsInTable", "room"]),
  },

  watch: {
    cards() {
      this.cardsInHands = this.cards;
      this.defaultCards();
    }
  },

  methods: {
    ...mapActions(["setCardsInTable"]),

    defaultCards() {
      this.cardsInHands = this.cards.slice(0, this.showTotalCardsInHands);
    },

    nextCards() {
      this.cardsInHands = this.cards.slice(
        this.showTotalCardsInHands * this.currentPage,
        this.showTotalCardsInHands * this.currentPage +
          this.showTotalCardsInHands
      );
      this.currentPage++;
      this.checkHandCards();
    },

    previousCards() {
      this.currentPage--;
      this.cardsInHands = this.cards.slice(
        this.showTotalCardsInHands * this.currentPage -
          this.showTotalCardsInHands,
        this.showTotalCardsInHands * this.currentPage
      );
      this.checkHandCards();
    },

    selectCard(card) {
      if (this.bossRound.id == this.currentPlayer.id) {
        return;
      }
      this.selectedCardInHandsId = card.id;
    },

    playCard(card) {
      this.selectedCardInHandsId = null;

      if (this.blockCardHands) {
        return;
      }

      this.cardsInHands = this.listRemoveByIndex(this.cards, card);

      this.broadcastTo(
        "update_cards_in_table",
        this.startGameChannel,
        this.room.id,
        card
      );

      this.updateCardsInHand();
      this.checkHandCards();

      this.blockCardHands = true;
    },

    checkHandCards() {
      if (this.currentPage == 2) {
        this.disableForward = true;
        this.disablePrevious = false;
      } else {
        this.disableForward = false;
        this.disablePrevious = true;
      }
    },

    updateCardsInHand() {
      if (this.currentPage == 1) {
        this.cardsInHands = this.cards.slice(0, 5);
      } else {
        this.cardsInHands = this.cards.slice(5, 10);
      }
    },

    //helpers
    listRemoveByIndex(array, item) {
      const index = this.listfindIndex(array, item);
      if (index > -1) {
        array.splice(index, 1);
        return array;
      }
    },

    listfindIndex(array, item) {
      return array.findIndex((_item) => _item.id === item.id);
    },
  },
};
</script>
