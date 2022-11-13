<template>
  <div>
    <div style="width: 200px">
      <q-list
        dense
        style="position: relative"
        v-for="(player, index) in players"
        v-bind:key="index"
      >
        <q-item class="q-gutter-x-sm items-center">
          <div v-if="bossRound">
            <q-icon
              name="star"
              v-if="bossRound.id == player.id"
              color="yellow-8"
              size="sm"
            />
            <!-- <q-icon name="done" v-if="!bossRound" color="green-8" size="sm" /> -->
            <q-icon
              name="schedule"
              v-else-if="player"
              color="orange-8"
              size="sm"
            />
          </div>
          <q-badge class="score" color="black"> 0 </q-badge>
          <q-item-section>
            <span class="text-h6">{{ player.name }}</span>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Score",

  data() {
    return {};
  },

  computed: {
    ...mapGetters(["bossRound", "room"]),

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
  justify-content: center
}
</style>
