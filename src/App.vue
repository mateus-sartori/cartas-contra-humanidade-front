<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      channel: "CartasContraHumanidadeChannel",
    };
  },

  channels: {
    CartasContraHumanidadeChannel: {
      connected() {
        console.log("Connected from App");
      },
    },
  },

  mounted() {
    this.$cable.subscribe({
      channel: this.channel,
    });
  },
};
</script>
