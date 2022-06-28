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
            <div class="col-12" v-if="getInAlreadyRoom">
              <span class="text-subtitle2 text-bold"> Sessão Id </span>
              <q-input square filled v-model="form.session" dense />
            </div>
          </div>
          <div class="row items-center">
            <q-checkbox v-model="getInAlreadyRoom" />
            <span>Entrar em uma sala já existente</span>
          </div>
          <div class="row q-gutter-md justify-center">
            <q-btn
              dense
              label="Entrar na sessão"
              color="green-8"
              no-caps
              size="md"
              @click="createPlayer()"
            />
          </div>
        </div>
      </q-card>
    </div>
  </div>
</template>
<script>
import { Cookies } from "quasar";

export default {
  data() {
    return {
      getInAlreadyRoom: false,

      form: {
        name: null,
      },

      channel: "CartasContraHumanidadeChannel",
    };
  },

  channels: {
    CartasContraHumanidadeChannel: {
      connected() {
        console.log("connected");
      },
    },
  },

  mounted() {
    this.$cable.subscribe({
      channel: this.channel,
    });
  },

  methods: {
    createPlayer() {
      Cookies.set("id", Math.random().toString(36).slice(-8));

      let id = Cookies.get("id");

      var player = {
        id: id,
        name: this.form.name,
      };

      this.$cable.perform({
        channel: this.channel,
        action: "create_player",
        data: {
          player: player,
        },
      });

      this.$router.push("/rooms");
    },
  },
};
</script>
