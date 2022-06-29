<template>
  <div class="container flex flex-center" style="height: 100vh">
    <div>
      <q-card class="q-pa-lg">
        <div class="column justify-center">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <span class="text-subtitle2 text-bold">Nome: </span>
              <q-input filled v-model="form.name" dense />
            </div>
          </div>
          <span v-if="this.errorMessage" class="text-red">
            {{ this.errorMessage }}
          </span>
          <div class="row q-gutter-md justify-center q-mt-sm">
            <q-btn
              dense
              label="Entrar na sessão"
              color="green-8"
              no-caps
              size="md"
              @click="enterInSession()"
            />
          </div>
        </div>
      </q-card>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { Cookies } from "quasar";

export default {
  data() {
    return {
      getInAlreadyRoom: false,

      form: {
        name: null,
      },
      errorMessage: null,

      channel: "CartasContraHumanidadeChannel",
    };
  },

  mounted() {
    this.removeExistedPlayerIp();
  },

  methods: {
    enterInSession() {
      axios.get("https://api.my-ip.io/ip.json").then((response) => {
        const ip = response.data.ip;
        if (!this.form.name) {
          this.errorMessage = "É preciso informar um nome.";
          return;
        }

        this.errorMessage = null;

        Cookies.set("id", Math.random().toString(36).slice(-8));

        let id = Cookies.get("id");

        var player = {
          id: id,
          name: this.form.name,
          ip: ip,
        };

        this.$cable.perform({
          channel: this.channel,
          action: "create_player",
          data: {
            player: player,
          },
        });

        this.$router.push("/rooms");
      });
    },

    removeExistedPlayerIp() {
      axios.get("https://api.my-ip.io/ip.json").then((response) => {
        const ip = response.data.ip;

        this.$cable.perform({
          channel: this.channel,
          action: "remove_player_from_session",
          data: {
            ip: ip,
          },
        });
      });
    },
  },
};
</script>
