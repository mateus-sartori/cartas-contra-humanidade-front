<template>
  <div>
    <div class="container">
      <div class="row q-py-md">
        <div class="column">
          <div
            v-for="(player, index) in players.slice(0, 3)"
            v-bind:key="index"
          >
            <card
              backgroundColor="bg-white"
              textColor="text-black"
              :text="''"
              :player="player"
            />
          </div>
        </div>

        <!-- Cartas da Mesa -->
        <div class="col">
          <div class="row q-pa-md q-mt-xs">
            <div class="row col">
              <card
                backgroundColor="bg-black"
                textColor="text-white"
                :canHover="true"
              />
              <card
                backgroundColor="bg-black"
                textColor="text-white"
                text="Durante o sexo, gosto de pensar em ________."
              />
            </div>
            <div class="row col justify-center">
              <card />
            </div>
            <div class="row col justify-end">
              <card />
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
            v-for="(player, index) in players.slice(3, 6)"
            v-bind:key="index"
          >
            <card
              backgroundColor="bg-white"
              textColor="text-black"
              :text="''"
              :player="player"
              :canHover="false"
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
        <div class="row" v-for="(card, index) in content" v-bind:key="index">
          <div class="column justify-center items-center">
            <div @click="selectCard(card)">
              <card
                backgroundColor="bg-white"
                textColor="text-black"
                :text="card.text"
                :style="blockCardHands ? 'opacity: 0.7' : ''"
                :disabled="blockCardHands"
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
export default {
  name: "Home",
  components: {
    Card,
  },
  data() {
    return {
      showTotalCards: 5,
      currentPage: 1,

      content: "",

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
      ],

      players: [
        {
          name: "Vitória",
          selectedCardText: "Rinha de Galo",
          pts: 1,
        },
        {
          name: "Pietra",
          selectedCardText: "Crianças",
          pts: 4,
        },
        {
          name: "Luna",
          selectedCardText: "Estupro",
          pts: 8,
        },
        {
          name: "Débora",
          selectedCardText: "Pedofilia",
          pts: 2,
        },
        {
          name: "Ryan",
          selectedCardText: "Membrana",
          pts: 5,
        },
        {
          name: "Elias",
          selectedCardText: "Billie Jean",
          pts: 0,
        },
      ],

      disableForward: false,
      disablePrevious: true,

      selectedCardInHandsId: null,
      isSelectingCardInHands: false,
      blockCardHands: false,

      cardsInTable: [],
    };
  },

  mounted() {
    this.defaultCards();
    this.checkHandCards();
  },

  methods: {
    defaultCards() {
      this.content = this.cards.slice(0, this.showTotalCards);
    },

    nextCards() {
      this.content = this.cards.slice(
        this.showTotalCards * this.currentPage - 1,
        this.showTotalCards * this.currentPage + this.showTotalCards
      );
      this.currentPage++;
      this.checkHandCards();
    },

    previousCards() {
      this.currentPage--;
      this.content = this.cards.slice(
        this.showTotalCards * this.currentPage - this.showTotalCards,
        this.showTotalCards * this.currentPage
      );
      this.checkHandCards();
    },

    checkHandCards() {
      if (this.showTotalCards * this.currentPage >= this.cards.length) {
        this.disableForward = true;
        this.disablePrevious = false;
      } else if (this.showTotalCards * this.currentPage <= this.cards.length) {
        this.disableForward = false;
        this.disablePrevious = true;
      }
    },

    selectCard(card) {
      if (!this.isSelectingCardInHands && !this.aa) {
        this.selectedCardInHandsId = card.id;
        this.isSelectingCardInHands = true;
      }
    },

    playCard(card) {
      this.selectedCardInHandsId = null;
      this.isSelectingCardInHands = false;

      if (this.blockCardHands) {
        return;
      }

      this.content = this.listRemoveByIndex(this.cards, card);
      this.defaultCards();

      this.cardsInTable.push(card);

      this.blockCardHands = true;
    },

    cancelCard() {
      this.selectedCardInHandsId = null;
      this.isSelectingCardInHands = false;
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
