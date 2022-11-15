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
              <div @click="handleCardInTable(card)">
                <card
                  backgroundColor="bg-white"
                  textColor="text-black"
                  :canHover="isBossCurrentPlayer && !card.revealed"
                  :text="card.revealed ? card.text : ''"
                />
              </div>
            </div>
            <div
              class="self-center"
              v-if="!isBossCurrentPlayer && !blackCardSelected"
            >
              Aguardando carta do patrão...
            </div>
          </div>
          <div
            class="column justify-center"
            v-if="
              this.cardsInTable.length == 0 &&
              blackCardSelected &&
              isBossCurrentPlayer
            "
          >
            Esperando jogadores enviarem suas cartas...
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

    <q-dialog v-model="showWinnerPlayer">
      <q-card v-if="room.winnerPlayer">
        <q-card-section>
          <div class="text-h6">Vencedor: {{room.winnerPlayer.name}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ room.winnerPlayer.card.text }}
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import Card from "components/Card";
import CardsInHands from "components/CardsInHands.vue";
import { Notify } from "quasar";

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

      showWinnerPlayer: false,

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
                this.setCardsInHands(this.cards["cards"]);
              }
            });
            this.whiteCards = response.data.white_cards;
            break;
          case "reveal_card_in_table":
            this.updateCardsInTable(response.data);
            break;
          case "update_room":
            this.updateRoom(response.data);
            break;
          case "winner_player":
            this.setWinnerPlayer(response.data);
            if (response.data.reveal) {
              this.showWinnerPlayer = true;
              setTimeout(() => {
                this.showWinnerPlayer = false;
                this.setWinnerPlayer(null);
                this.resetRoom();
                this.resetRound();
              }, 5000);
            }
            break;
          default:
            break;
        }
      },
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

    isBossCurrentPlayer() {
      if (this.currentPlayer && this.bossRound) {
        return this.currentPlayer.id === this.bossRound.id;
      }
      return false;
    },

    isAllCardsInTableRevealed() {
      return this.cardsInTable.every((card) => {
        return card.revealed;
      });
    },
  },

  watch: {
    room() {
      if (this.room.isAllPlayersPlayed && !this.isBossCurrentPlayer) {
        setTimeout(() => {
          Notify.create({
            progress: true,
            message: "Patrão revelando cartas...",
            icon: "fa-solid fa-hand-pointer",
            color: "black",
            textColor: "white",
          });
        }, 2000);
      }
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
    ...mapActions([
      "setBossRound",
      "setCardsInTable",
      "setCardsInHands",
      "updateCardsInTable",
      "setCurrentPlayer",
      "updateRoom",
      "resetRoom",
      "setWinnerPlayer",
    ]),

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

        var data = {
          players: this.room["players"],
          currentPlayer: this.currentPlayer,
        };

        this.broadcastTo(
          "update_room",
          this.startGameChannel,
          this.room.id,
          data
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

    handleCardInTable(card) {
      if (this.room.isAllPlayersPlayed && !this.isAllCardsInTableRevealed)
        return this.revealCard(card);
      if (this.isAllCardsInTableRevealed)
        return this.selectWinnerWhiteCard(card);
    },

    revealCard(card) {
      if (this.isBossCurrentPlayer) {
        const data = {
          cardsInTable: this.cardsInTable,
          card: card,
        };

        this.broadcastTo(
          "reveal_card_in_table",
          this.startGameChannel,
          this.room.id,
          data
        );
      }
    },

    selectWinnerWhiteCard(card) {
      if (this.isBossCurrentPlayer) {
        const player = this.room.players.find((player) => {
          if (player.referralCard) {
            return player.referralCard.text == card.text;
          }
          return false;
        });

        this.broadcastTo(
          "winner_player",
          this.startGameChannel,
          this.room.id,
          player
        );
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
