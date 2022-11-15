<template>
  <div>
    <div
      class="row col justify-center items-center q-gutter-x-md"
      v-if="!isBossCurrentPlayer"
    >
      <div class="row" v-for="(card, index) in cardsInHands" v-bind:key="index">
        <div class="column justify-center items-center">
          <div @dblclick="playCard(card)">
            <card
              backgroundColor="bg-white"
              textColor="text-black"
              :text="card.text"
              :style="
                blockCardHands || !isBlackCardSelected ? 'opacity: 0.7' : ''
              "
              :canHover="!blockCardHands"
            />
          </div>
        </div>
      </div>
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

      disableForward: false,
      disablePrevious: true,

      startGameChannel: "CartasContraHumanidadeGameRuleChannel",
    };
  },

  channels: {
    CartasContraHumanidadeGameRuleChannel: {
      received(response) {
        switch (response.action) {
          case "update_cards_in_table":
            this.setCardsInTable(response.data);
            break;
          default:
            break;
        }
      },
    },
  },

  props: {
    isBossCurrentPlayer: {
      type: Boolean,
    },

    isBlackCardSelected: {
      type: Boolean,
    },
  },

  computed: {
    ...mapGetters([
      "bossRound",
      "currentPlayer",
      "cardsInTable",
      "room",
      "cardsInHands",
    ]),
  },

  methods: {
    ...mapActions(["setCardsInTable", "updateCardsInHands"]),

    playCard(card) {
      if (this.isBlackCardSelected) {
        this.selectedCardInHandsId = null;

        if (this.blockCardHands) {
          return;
        }

        this.updateCardsInHands(card);

        this.broadcastTo(
          "update_cards_in_table",
          this.startGameChannel,
          this.room.id,
          card
        );

        var data = {};

        data = {
          players: this.room["players"],
          currentPlayer: this.currentPlayer,
          card: card,
        };

        this.broadcastTo(
          "update_room",
          this.startGameChannel,
          this.room.id,
          data
        );

        this.blockCardHands = true;
      }
    },
  },
};
</script>
