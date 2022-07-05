<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

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
    const session = Math.random().toString(36).slice(-8);

    this.setSession(session);

    this.$cable.subscribe({
      channel: this.channel,
      session: session,
    });
  },

  methods: {
    ...mapActions(["setSession"]),
  },
};
</script>
