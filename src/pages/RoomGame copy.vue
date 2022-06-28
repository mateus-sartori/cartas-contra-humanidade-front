<template>
  <div>
    <div class="container">
      <div class="row q-py-md">
        <div class="column">
          <div
            v-for="(player, index) in playersInSession.slice(0, 3)"
            v-bind:key="index"
          >
            <card
              backgroundColor="bg-white"
              textColor="text-black"
              :text="''"
              :player="player"
              :currentLeader="currentLeader"
            />
          </div>
        </div>

        <!-- Cartas da Mesa -->
        <div class="col">
          <div class="row q-pa-md q-mt-xs">
            <div class="row col">
              <div @click="nextBlackCard()" v-show="blackCards.length > 1">
                <card
                  backgroundColor="bg-black"
                  textColor="text-white"
                  :canHover="
                    currentLeader == player && !blockNewBlackCard ? true : false
                  "
                  :text="`Restantes ${blackCards.length - 1}`"
                />
              </div>
              <div v-if="blackCardSelected && !isPendingLeaderStart">
                <card
                  backgroundColor="bg-black"
                  textColor="text-white"
                  :text="blackCardSelected.text"
                />
              </div>
            </div>
            <div class="row col justify-center">
              <card />
            </div>
            <div class="row col justify-end">
              <div
                @click="buyCard(cardsToBuy[0])"
                v-show="cardsToBuy.length >= 1"
              >
                <card
                  :canHover="true"
                  :text="`Restantes ${cardsToBuy.length}`"
                />
              </div>
              <card />
            </div>
          </div>
          <div class="row q-mt-md">
            <div class="row col justify-center">
              <div v-for="(card, index) in cardsInTable" v-bind:key="index">
                <card
                  backgroundColor="bg-white"
                  textColor="text-black"
                  :text="card.text"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="column">
          <div
            v-for="(player, index) in playersInSession.slice(3, 6)"
            v-bind:key="index"
          >
            <card
              backgroundColor="bg-white"
              textColor="text-black"
              :text="''"
              :player="player"
              :currentLeader="currentLeader"
            />
          </div>
        </div>
      </div>

      <!-- Cartas da mão  -->
      <div class="row col justify-center items-center q-gutter-x-md">
        <q-btn
          icon="chevron_left"
          @click="previousCards()"
          color="red"
          round
          :disabled="disablePrevious"
          size="sm"
          glossy
        />
        <div
          class="row"
          v-for="(card, index) in cardsInHands"
          v-bind:key="index"
        >
          <div class="column justify-center items-center">
            <div @click="selectCard(card)">
              <card
                backgroundColor="bg-white"
                textColor="text-black"
                :text="card.text"
                :style="
                  blockCardHands || currentLeader.id == player.id
                    ? 'opacity: 0.7'
                    : ''
                "
                :canHover="true"
              />
            </div>
            <div
              class="q-pa-xs row q-gutter-x-md"
              v-if="selectedCardInHandsId == card.id && !blockCardHands"
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
          color="green"
          round
          :disabled="disableForward"
          size="sm"
          glossy
        />
      </div>
    </div>
  </div>
</template>

<script>
import Card from "components/Card";
import { Cookies } from "quasar";
import { Game } from "../game/game";

export default {
  name: "RoomGame",
  components: {
    Card,
  },
  data() {
    return {
      showTotalCardsInHands: 5,
      blackCardSelectedPosition: 0,
      currentPage: 1,

      blackCards: [
        {
          id: 14,
          text: "Durante o sexo, gosto de pensar em _______",
        },
        {
          id: 250,
          text: "Em seus momentos finais Michael Jackson pensou em _______",
        },
        {
          id: 187,
          text: "Idosos tem cheiro de que?",
        },
        {
          id: 149,
          text: "Guerra! Para que serve?",
        },
        {
          id: 149,
          text: "O que me causa gases incontroláveis?",
        },
        {
          id: 149,
          text: "Bebo para esquecer____",
        },
        {
          id: 149,
          text: "Buscando aumentar sua audiência, o museu de História Natural abriu uma exposição interativa sobre ____",
        },
      ],

      blackCardSelected: null,

      cardsToBuy: [
        {
          id: 11,
          text: "Flanelinhas",
        },
        {
          id: 12,
          text: "Células tronco",
        },
        {
          id: 13,
          text: "Tom Cruise",
        },
        {
          id: 14,
          text: "Lobotomia",
        },
        {
          id: 15,
          text: "Sexo entre pandas",
        },
        {
          id: 16,
          text: "Lamber coisas para estabelecer que são propriedade sua",
        },
        {
          id: 17,
          text: "Amizade Colorida",
        },
      ],

      cards: [
        {
          id: 1,
          text: "O Doce Veneno do Escorpião",
        },
        {
          id: 2,
          text: "Os pobres",
        },
        {
          id: 3,
          text: "Catapultas",
        },
        {
          id: 4,
          text: "Design Inteligente",
        },
        {
          id: 5,
          text: "Limpar a bunda dela",
        },
        {
          id: 6,
          text: "A força",
        },
        {
          id: 7,
          text: "Lingua solta",
        },
        {
          id: 8,
          text: "Imagens de seios",
        },
        {
          id: 9,
          text: "Servidão",
        },
        {
          id: 10,
          text: "Ejaculação precoce",
        },
      ],

      cardsInHands: "",

      disableForward: false,
      disablePrevious: true,

      selectedCardInHandsId: null,
      isSelectingCardInHands: false,
      blockCardHands: false,
      blockNewBlackCard: false,
      isPendingLeaderStart: true,

      cardsInTable: [],

      currentLeader: null,

      players: [],
      player: null,

      playersInSession: [],

      cartasContraHumanidadeConnection: false,
    };
  },

  channels: {
    CartasContraHumanidadeChannel: {
      received(data) {
        this.players = data;

        if (this.players.length >= 1) {
          for (let i = 0; i < this.players.length; i++) {
            const playersInSession = this.players.filter((element) => {
              return this.players[i].session === Cookies.get("session");
            });

            this.playersInSession = playersInSession;

            

    
            const player = this.playersInSession.find((player) => {
              return player.id == Cookies.get("id");
            });

            this.player = player;
            this.currentLeader = this.players[0];
          }
        }
      },
    },
  },

  created() {
    this.defaultCards();
    this.checkHandCards();

    const game = new Game();

    game.getAllPlayers();

    this.isPendingLeaderStart = false;
  },

  methods: {
    defaultCards() {
      this.cardsInHands = this.cards.slice(0, this.showTotalCardsInHands);
    },

    resetRound() {
      this.blockCardHands = false;
      this.selectedCardInHandsId = null;
      this.cardsInTable = [];
    },

    nextBlackCard() {
      if (
        this.blackCards.length > 1 &&
        this.player.id == this.currentLeader.id &&
        !this.blockNewBlackCard
      ) {
        this.blackCards.shift();
        this.blackCardSelected = this.blackCards[0];
        this.blockNewBlackCard = true;
        this.resetRound();
      }
    },

    nextCards() {
      if (this.player.id != this.currentLeader.id) {
        this.cardsInHands = this.cards.slice(
          this.showTotalCardsInHands * this.currentPage,
          this.showTotalCardsInHands * this.currentPage +
            this.showTotalCardsInHands
        );
        this.currentPage++;
        this.checkHandCards();
      }
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

    checkHandCards() {
      if (this.currentPage == 2) {
        this.disableForward = true;
        this.disablePrevious = false;
      } else {
        this.disableForward = false;
        this.disablePrevious = true;
      }
    },

    buyCard(card) {
      if (this.cards.length <= 9) {
        this.cards.push(card);
        this.cardsToBuy.shift();
        this.cardsInHands = this.cards.slice(5, 10);
        this.currentPage = 2;
        this.checkHandCards();
      }
    },

    selectCard(card) {
      if (this.currentLeader.id == this.player.id) {
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

      this.cardsInTable.push(card);

      this.updateCardsInHand();
      this.checkHandCards();

      this.blockCardHands = true;
    },

    cancelCard() {
      this.selectedCardInHandsId = null;
    },

    updateCardsInHand() {
      if (this.currentPage == 1) {
        this.cardsInHands = this.cards.slice(0, 5);
      } else {
        this.cardsInHands = this.cards.slice(5, 10);
      }
    },

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

<style>
.blink-card {
  animation: selected-carde 1.5s infinite;
}

@keyframes selected-carde {
  0%,
  49% {
    border: 1px solid white;
  }
  50%,
  100% {
    border: 1px solid #1976d2;
  }
}
</style>
