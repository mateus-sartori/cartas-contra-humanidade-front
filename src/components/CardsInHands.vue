<template>
  <div>
    <div
      class="row col justify-center items-center q-gutter-x-md"
      v-if="!isBossCurrentPlayer"
    >
      <div class="row" v-for="(card, index) in cardsInHands" v-bind:key="index">
        <div class="column justify-center items-center">
          <div @click="selectCard(card)">
            <card
              backgroundColor="bg-white"
              textColor="text-black"
              :text="card.text"
              :style="
                blockCardHands || !isBlackCardSelected ? 'opacity: 0.7' : ''
              "
              :canHover="true"
            />
          </div>
          <div
            class="q-pa-xs row q-gutter-x-md"
            v-if="
              selectedCardInHandsId == card.id &&
              !blockCardHands &&
              isBlackCardSelected
            "
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

      this.updateCardsInHands(card);

      this.broadcastTo(
        "update_cards_in_table",
        this.startGameChannel,
        this.room.id,
        card
      );

      this.blockCardHands = true;
    },
  },
};
</script>
