<template>
  <div>
    <div class="col">
      <div class="row">
        <div class="row col" v-if="blackCards">
          <div @click="playBlackCard()" v-show="blackCards.length > 1">
            <card
              backgroundColor="bg-black"
              textColor="text-white"
              :canHover="
                isBossCurrentPlayer && !blockNewBlackCard ? true : false
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
        </div>
        <div class="row col justify-center">
          <card />
        </div>
        <div class="row col justify-end">
          <div @click="buyCard(cardsToBuy[0])" v-show="cardsToBuy.length >= 1">
            <card :canHover="!isBossCurrentPlayer" :text="`Restantes ${cardsToBuy.length}`" />
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
  </div>
</template>

<script>
import Card from "components/Card";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "BoardGame",

  components: {
    Card,
  },

  props: {
    players: {
      type: Array
    },
    currentPlayer: {
      type: Object,
      default: null,
    },
    session: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      showTotalCardsInHands: 5,
      blackCardSelectedPosition: 0,
      currentPage: 1,

      blackCards: null,

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

      cardsInHands: [],

      disableForward: false,
      disablePrevious: true,

      selectedCardInHandsId: null,
      isSelectingCardInHands: false,
      blockCardHands: false,
      blockNewBlackCard: false,
      isPendingLeaderStart: true,

      cardsInTable: [],

      currentLeader: null,

      player: null,

      playersInSession: [],

      cartasContraHumanidadeConnection: false,

      startGameChannel: "CartasContraHumanidadeGameRuleChannel",
    };
  },

  channels: {
    CartasContraHumanidadeGameRuleChannel: {
      connected() {
        console.log("Board Game connect on:  " + this.session);
      },

      received(response) {
        switch (response.action) {
          case "load_black_cards":
            this.blackCards = response.data;
            break;
          case "play_black_card":
            this.nextBlackCard(response.data);
            break;
          case 'set_boss_round':
            this.setBossRound(response.data)
            break;
          default:
            break;
        }
      },
    },
  },

  computed: {
    ...mapGetters(["bossRound"]),

    isBossCurrentPlayer() {
      if (this.currentPlayer && this.bossRound) {
        return this.currentPlayer.id === this.bossRound.id
      }
      return false;
    }
  },

  created() {
    this.$q.loading.show({
      message: "Começando jogo...",
    });

    setTimeout(() => {
      this.broadcastTo("load_black_cards");

      var data = {
        bossRound: this.bossRound
      }
      this.broadcastTo("boss_round", data);

      this.$q.loading.hide();
    }, 500);
  },

  methods: {
    ...mapActions(["setBossRound"]),

    broadcastTo(action, data) {
      this.$cable.perform({
        channel: this.startGameChannel,
        action: action,
        data: {
          ...data,
          session: this.session,
        },
      });
    },

    loadCards() {
      this.broadcastTo("load_black_cards");
    },

    playBlackCard() {
      if (this.isBossCurrentPlayer) {
        this.broadcastTo("play_black_card", {
          selectedBlackCard:
            this.blackCards[Math.floor(Math.random() * this.blackCards.length)],
        });
      }
    },

    resetRound() {
      this.blockCardHands = false;
      this.selectedCardInHandsId = null;
      this.cardsInTable = [];
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

    checkHandCards() {
      if (this.currentPage == 2) {
        this.disableForward = true;
        this.disablePrevious = false;
      } else {
        this.disableForward = false;
        this.disablePrevious = true;
      }
    },

    nextBlackCard(selectedBlackCard) {
      if (
        this.blackCards.length > 1 &&
        !this.blockNewBlackCard
      ) {
        this.blackCards.shift();
        this.blackCardSelected = selectedBlackCard;
        this.blockNewBlackCard = true;
        this.resetRound();
      }
    },
  },
};
</script>
