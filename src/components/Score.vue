<template>
  <div>
    <div style="width: 200px;">
      <q-list
      dense
      style="position: relative"
      v-for="(player, index) in players"
      v-bind:key="index"
      >
      
        <div>
          <q-item class="q-gutter-x-sm items-center">
            <div v-if="bossRound" class="cursor-pointer">
              <q-tooltip> Patrão da Rodada </q-tooltip>
              <q-icon
                name="fa-solid fa-crown"
                v-if="bossRound.id == player.id"
                color="yellow-8"
                size="sm"
              />
            </div>
            <div v-if="player && bossRound" class="cursor-pointer">
              <div v-if="player.pending && !(bossRound.id == player.id)">
                <q-tooltip> Aguardando </q-tooltip>
                <q-icon name="schedule" color="orange-8" size="sm" />
              </div>
              <div v-else-if="!(bossRound.id == player.id)">
                <q-tooltip> Pronto </q-tooltip>
                <q-icon name="done" color="green-8" size="sm" />
              </div>
            </div>
            <q-badge class="score" color="black"> {{player.score ? player.score : 0}} </q-badge>
            <q-item-section>
              <span class="text-caption">{{ player.name }}</span>
            </q-item-section>
          </q-item>
        </div>
      </q-list>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Score",

  data() {
    return {};
  },

  computed: {
    ...mapGetters(["bossRound", "room", "currentPlayer"]),

    players() {
      return this.room["players"];
    },
  },
};
</script>

<style>
.score {
  height: 30px;
  width: 32px;
  justify-content: center;
}
</style>
