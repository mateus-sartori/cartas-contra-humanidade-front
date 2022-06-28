<template>
  <div>
    <q-card
      :class="`${
        canHover ? 'hover-card' : ''
      } ${backgroundColor} text-bold q-ma-xs`"
      bordered
      flat
      style="width: 130px"
    >
      <div>
        <div v-if="currentLeader" style="position: absolute">
          {{ currentPlayer ? "Você" : "" }}
          <span v-if="currentLeader.id == player.id">Patrão</span>
        </div>
        <div
          class="q-pa-sm row items-center"
          :class="player ? 'justify-center' : 'justify-start'"
        >
          <div style="word-wrap: break-word; height: 120px" :class="textColor">
            <div v-if="text">
              <span :style="text.length >= 40 ? 'font-size: 11px' : ''">
                {{ text }}
              </span>
            </div>
          </div>
          <div class="row" v-if="player">
            <q-avatar size="80px">
              <img src="https://cdn.quasar.dev/img/avatar.png" />
            </q-avatar>
          </div>
        </div>
        <q-separator />
        <div :class="`${backgroundColor} text-bold`">
          <q-card-section class="q-pa-xs" :class="textColor">
            <div class="row justify-between" v-if="player">
              <span class="text-caption"> {{ player.name }} </span>
              <span class="text-caption text-grey-8">
                
                Pontos: {{ player.pts }}
              </span>
            </div>
            <span v-else style="font-size: 9px">
              Cartas contra humanidade
            </span>
          </q-card-section>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script>
import { Cookies } from "quasar";
export default {
  name: "Card",
  props: [
    "backgroundColor",
    "textColor",
    "text",
    "player",
    "canHover",
    "currentLeader",
  ],

  data() {
    return {};
  },

  computed: {
    currentPlayer() {
      return this.player.id === Cookies.get('id')
    }
  }
};
</script>

<style>
.hover-card:hover {
  transform: scale(1.2);
  cursor: pointer;
  z-index: 1;
  transition: transform 0.8s;
}
</style>
