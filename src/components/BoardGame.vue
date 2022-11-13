<template>
  <div>
    <div class="q-my-xl">
      <div class="row">
        <div class="col-12 row justify-center" v-if="blackCards">
          <div
            @click="playBlackCard()"
            v-show="blackCards.length > 1 && isBossCurrentPlayer"
          >
            <card
              backgroundColor="bg-black"
              textColor="text-white"
              :canHover="
                isBossCurrentPlayer && !isBlackCardSelected ? true : false
              "
              :text="`Restantes ${blackCards.length - 1}`"
            />
          </div>

          <div v-if="blackCardSelected">
            <card
              backgroundColor="bg-black"
              textColor="text-white"
              :text="blackCardSelected.text"
            />
          </div>
          <div class="row" v-if="cardsInTable">
            <div v-for="(card, index) in cardsInTable" v-bind:key="index">
              <card
                backgroundColor="bg-white"
                textColor="text-black"
                :text="card.text"
              />
            </div>
          </div>
        </div>

        <div class="row col justify-end">
          <div
            @click="buyCard(whiteCards[0])"
            v-show="whiteCards.length >= 1 && !isBossCurrentPlayer"
          >
            <card
              :canHover="!isBossCurrentPlayer"
              :text="`Restantes ${whiteCards.length}`"
            />
          </div>
        </div>
      </div>
    </div>

    <div>
      <q-separator v-show="!isBossCurrentPlayer" />
      <div class="q-my-lg">
        <cards-in-hands
          :is-boss-current-player="isBossCurrentPlayer"
          :is-black-card-selected="isBlackCardSelected"
        />
      </div>

      <q-separator v-show="!isBossCurrentPlayer" />
    </div>
  </div>
</template>

<script>
import Card from "components/Card";
import CardsInHands from "components/CardsInHands.vue";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "BoardGame",

  components: {
    Card,
    CardsInHands,
  },

  props: {
    players: {
      type: Array,
    },
  },

  data() {
    return {
      blackCardSelectedPosition: 0,

      blackCards: [],
      whiteCards: [],

      cards: {},

      blackCardSelected: null,

      selectedCardInHandsId: null,
      isSelectingCardInHands: false,
      blockCardHands: false,
      isBlackCardSelected: false,
      isPendingLeaderStart: true,

      player: null,

      playersInSession: [],

      cartasContraHumanidadeConnection: false,

      startGameChannel: "CartasContraHumanidadeGameRuleChannel",
    };
  },

  channels: {
    CartasContraHumanidadeGameRuleChannel: {
      received(response) {
        switch (response.action) {
          case "load_black_cards":
            this.blackCards = response.data;
            break;
          case "play_black_card":
            this.nextBlackCard(response.data);
            break;
          case "set_boss_round":
            this.setBossRound(response.data);
            break;
          case "load_white_cards":
            this.whiteCards = response.data;
            break;
          case "load_cards_in_hands":
            response.data.info_players.forEach((element) => {
              if (element["player"]["id"] == this.currentPlayer.id) {
                this.cards["cards"] = element["cards_in_hands"];
                this.setCardsInHands(this.cards["cards"])
              }
            });
            this.whiteCards = response.data.white_cards;
            break;
          default:
            break;
        }
      },
    },
  },

  computed: {
    ...mapGetters(["bossRound", "currentPlayer", "cardsInTable", "room", "cardsInHands"]),

    isBossCurrentPlayer() {
      if (this.currentPlayer && this.bossRound) {
        return this.currentPlayer.id === this.bossRound.id;
      }
      return false;
    },
  },

  created() {
    var data = {
      bossRound: this.bossRound,
    };

    if (data.bossRound) {
      this.$q.loading.show({
        message: "Começando jogo...",
      });

      setTimeout(() => {
        this.broadcastTo(
          "load_black_cards",
          this.startGameChannel,
          this.room.id
        );
        this.broadcastTo(
          "load_white_cards",
          this.startGameChannel,
          this.room.id
        );
        this.broadcastTo(
          "boss_round",
          this.startGameChannel,
          this.room.id,
          data
        );

        this.$q.loading.hide();
      }, 500);

      setTimeout(() => {
        this.loadCardsInHands();
      }, 1000);
    }
  },

  methods: {
    ...mapActions(["setBossRound", "setCardsInTable", "setCardsInHands"]),

    loadCardsInHands() {
      var data = {
        players: this.players,
      };
      this.broadcastTo(
        "load_cards_in_hands",
        this.startGameChannel,
        this.room.id,
        data
      );
    },

    playBlackCard() {
      if (this.isBossCurrentPlayer) {
        this.broadcastTo(
          "play_black_card",
          this.startGameChannel,
          this.room.id,
          {
            selectedBlackCard: this.randomElement(this.blackCards),
          }
        );
      }
    },

    nextBlackCard(selectedBlackCard) {
      if (this.blackCards.length > 1 && !this.isBlackCardSelected) {
        this.blackCards.shift();
        this.blackCardSelected = selectedBlackCard;
        this.isBlackCardSelected = true;
        this.resetRound();
      }
    },

    resetRound() {
      this.blockCardHands = false;
      this.selectedCardInHandsId = null;

      this.setCardsInTable([]);
    },
  },
};
</script>
