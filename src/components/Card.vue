<template>
  <div>
    <q-card
      :class="`${
        canHover ? 'hover-card' : ''
      } ${backgroundColor} text-bold q-ma-xs`"
      bordered
      flat
      style="width: 160px"
    >
      <div>
        <div class="q-pa-sm row items-center">
          <div style="word-wrap: break-word; height: 150px" :class="textColor">
            <div v-if="text">
              <span :style="text.length >= 40 ? 'font-size: 11px' : ''">
                {{ text }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <q-separator />
      <div :class="`${backgroundColor} text-bold`">
        <q-card-section class="q-pa-xs" :class="textColor">
          <span style="font-size: 9px"> Cartas contra humanidade </span>
        </q-card-section>
      </div>
    </q-card>
  </div>
</template>

<script>
export default {
  name: "Card",
  props: ["backgroundColor", "textColor", "text", "canHover"],

  data() {
    return {};
  },
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
