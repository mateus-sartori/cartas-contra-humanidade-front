<template>
  <div>
    <div class="q-my-xl">
      <div class="row col-12">
        <div class="col-12 row justify-center" v-if="blackCards">
          <div
            @click="playBlackCard()"
            v-show="blackCards.length > 1 && isBossCurrentPlayer"
          >
            <card
              backgroundColor="bg-black"
              textColor="text-white"
              :canHover="
                isBossCurrentPlayer && !blackCard.selected ? true : false
              "
              :text="`Restantes ${blackCards.length - 1}`"
            />
          </div>

          <div v-if="blackCard.selected">
            <card
              backgroundColor="bg-black"
              textColor="text-white"
              :text="blackCard.card.text"
            />
          </div>
          <div class="row" v-if="cardsInTable">
            <div v-for="(card, index) in cardsInTable" v-bind:key="index">
              <div @click="handleCardInTable(card)">
                <card
                  backgroundColor="bg-white"
                  textColor="text-black"
                  :canHover="isBossCurrentPlayer"
                  :text="card.revealed ? card.text : ''"
                />
              </div>
            </div>
            <div
              class="self-center text-caption"
              v-if="!isBossCurrentPlayer && !blackCard.card"
            >
              Aguardando carta do patrão...
            </div>
            <div class="col row justify-end" v-if="!isBossCurrentPlayer">
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

        <div
          class="col-12 row justify-center"
          v-if="
            this.cardsInTable.length == 0 &&
            blackCard.card &&
            isBossCurrentPlayer
          "
        >
          <div class="q-my-md text-caption">
            Esperando jogadores enviarem as cartas...
          </div>
        </div>
      </div>
    </div>

    <div>
      <q-separator v-show="!isBossCurrentPlayer" />
      <div class="q-my-lg">
        <cards-in-hands :is-boss-current-player="isBossCurrentPlayer" />
      </div>

      <q-separator v-show="!isBossCurrentPlayer" />
    </div>

    <q-dialog v-model="showWinnerPlayer">
      <q-card v-if="room.winnerPlayer">
        <q-card-section>
          <div class="text-h6">Vencedor: {{ room.winnerPlayer.name }}</div>
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

  data() {
    return {
      showWinnerPlayer: false,

      startGameChannel: "CartasContraHumanidadeGameRuleChannel",
    };
  },

  channels: {
    CartasContraHumanidadeGameRuleChannel: {
      received(response) {
        switch (response.action) {
          case "load_black_cards":
            this.setBlackCards(response.data);
            break;
          case "play_black_card":
            this.nextBlackCard(response.data);
            break;
          case "set_boss_round":
            this.setBossRound(response.data);
            break;
          case "load_white_cards":
            this.setWhiteCards(response.data);
            break;
          case "load_cards_in_hands":
            response.data.info_players.forEach((element) => {
              if (element["player"]["id"] == this.currentPlayer.id) {
                this.setCardsInHands(element["cards_in_hands"]);
              }
            });
            this.setWhiteCards(response.data.white_cards);
            break;
          case "reveal_card_in_table":
            this.updateCardsInTable(response.data);
            break;
          case "buy_white_card":
            this.shiftCardsToBuy(response.data);
            break;
          case "shuffle_cards_in_table":
            this.updateCardsInTable(response.data);
            break;
          case "update_room":
            this.updateRoom(response.data);
            if (this.room.isAllPlayersPlayed && !this.isBossCurrentPlayer) {
              setTimeout(() => {
                Notify.create({
                  progress: true,
                  message: "Patrão revelando cartas...",
                  icon: "fa-solid fa-hand-pointer",
                  color: "black",
                  textColor: "white",
                });
              }, 1500);
            }

            if (this.room.isAllPlayersPlayed) {
              Notify.create({
                progress: true,
                message: "Embaralhando cartas...",
                icon: "fa-solid fa-hand-pointer",
                color: "black",
                textColor: "white",
              });

              const data = {
                cardsInTable: this.cardsInTable,
              };
              this.broadcastTo(
                "shuffle_cards_in_table",
                this.startGameChannel,
                this.room.id,
                data
              );
            }
            break;
          case "winner_player":
            this.setWinnerPlayer(response.data);
            if (response.data.reveal) {
              this.showWinnerPlayer = true;
              setTimeout(() => {
                this.showWinnerPlayer = false;
                this.updateCurrentBossIndex({
                  players: this.players,
                  currentBoss: this.bossRound,
                });
                this.updateBossRound({
                  isBossCurrentPlayer: this.isBossCurrentPlayer,
                  players: this.players,
                });
                this.setWinnerPlayer(null);
                this.updateCardsInTable([]);
                this.resetRoom();
                this.resetRound();
                this.updateBlockCardsHands(false);
                this.setblackCard({ card: null, selected: false });
                this.updateBlockSelectWinner(false);
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
      "whiteCards",
      "cardsInTable",
      "room",
      "cardsInHands",
      "blackCards",
      "blackCard",
      "blockSelectWinner",
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

    players() {
      if (this.room) {
        return this.room["players"];
      }
      return null;
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
      "updateBossRound",
      "setCardsInTable",
      "setCardsInHands",
      "setWhiteCards",
      "updateCardsInTable",
      "setCurrentPlayer",
      "updateRoom",
      "resetRoom",
      "setWinnerPlayer",
      "updateBlockCardsHands",
      "setBlackCards",
      "setblackCard",
      "removeSelectedCardFromBlackCards",
      "updateCurrentBossIndex",
      "updateBlockSelectWinner",
      "updateCardsInHands",
      "shiftCardsToBuy",
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
            blackCard: this.randomElement(this.blackCards),
          }
        );

        var data = {
          players: this.players,
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

    nextBlackCard(blackCard) {
      if (this.blackCards.length > 1 && !this.blackCard.card) {
        this.removeSelectedCardFromBlackCards(blackCard);

        this.setblackCard({ card: blackCard, selected: true });
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

    buyCard(card) {
      if (this.cardsInHands.length >= 5) return;

      this.broadcastTo(
        "buy_white_card",
        this.startGameChannel,
        this.room.id,
        card
      );

      var data = {
        card: card,
        action: "add",
      };

      this.updateCardsInHands(data);
    },

    selectWinnerWhiteCard(card) {
      if (!this.blockSelectWinner && this.isBossCurrentPlayer) {
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
        this.updateBlockSelectWinner(true);
      }
    },

    resetRound() {
      this.setCardsInTable([]);
    },
  },
};
</script>
