<template>
  <div>
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
      <div class="row" v-for="(card, index) in cardsInHands" v-bind:key="index">
        <div class="column justify-center items-center">
          <div @click="selectCard(card)">
            <card
              backgroundColor="bg-white"
              textColor="text-black"
              :text="card.text"
              :style="
                  blockCardHands
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
        size="sm"
        glossy
      />
    </div>
  </div>
</template>

<script>
import Card from "components/Card";
export default {
  name: "CardsInHands",

  components: {
    Card
  },

  data() {
    return {
      disablePrevious: true,
      blockCardHands: false,
      selectedCardInHandsId: null,
    }
  },

  props: {
    cardsInHands: {
      type: Array,
      default: null,
    },
  },
};
</script>
